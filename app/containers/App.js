/* global chrome */
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import * as TodoActions from '../actions/todos';
import 'react-tabs/style/react-tabs.css';
import './App.css';
import { SketchPicker } from 'react-color';

@connect(
  state => ({
    todos: state.todos,
    cssProperties: state.cssProperties
  }),
  dispatch => ({
    actions: bindActionCreators(TodoActions, dispatch)
  })
)

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: '',
      element: 'Select an Element',
      highlight: false,
      sketchOn: false,
      newCss: ''
    };

    this.handleBackgroundColorChange = this.handleBackgroundColorChange.bind(this);
    this.handleHighlightChange = this.handleHighlightChange.bind(this);
    this.handleSketchChange = this.handleSketchChange.bind(this);
    this.handleScreenCapture = this.handleScreenCapture.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleResetStore = this.handleResetStore.bind(this);
    this.download = this.download.bind(this);
  }

  componentDidMount() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      let cssSelector;

      if (request.cssSelector) cssSelector = request.cssSelector;

      this.setState({ element: cssSelector });
      sendResponse({ test: 'test' });
    });
  }
  download( text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', 'style.css');
    element.style.display = 'none';
    element.click();

    document.body.removeChild(element);
  }
  handleDownload() {
    const storeElement = this.state.element;
    
        let promisifyGet = () => { 
          return new Promise((resolve)=>{
            let newCss='';
            chrome.storage.local.get((result)=>{
                  const storeObj = JSON.parse(result.state);
                  const cssProperties = storeObj.cssProperties;
                  for (let tagNames in cssProperties) {
                    const propertiesArrayLength = cssProperties[tagNames].length-1;
                    const singleProperty = cssProperties[tagNames]; // array at tagname
                    const cssStyle = singleProperty[propertiesArrayLength];//most recently changed property 
                    const className = tagNames.split('.');// [span, classname]
                    if(className.length===1){
                      newCss += (tagNames + JSON.stringify(cssStyle) + '\n');
                    } else {
                      newCss += ('.' + className[1] + JSON.stringify(cssStyle) + '\n');
                    }
                  }
                  newCss = newCss.replace(/['"]+/g, '');//replaces quotes from JSON.stringify
                  resolve(newCss);
            })
          })
        }
         promisifyGet().then(css=>this.setState({newCss: css}))
         .then(()=>this.download(this.state.newCss));
  }

  handleBackgroundColorChange(newColor) {
    const { todos, actions } = this.props;
    this.setState({ backgroundColor: newColor.hex });
    actions.addProperty(this.state.element, 'background-color', newColor.hex);
  }

  handleHighlightChange() {
    const highlight = !this.state.highlight;
    this.setState({ highlight });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { highlight }, (response) => {
      });
    });
  }

  handleSketchChange() {
    const sketchOn = !this.state.sketchOn;
    this.setState({ sketchOn });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { sketchOn }, (response) => {
      });
    });
  }

  handleScreenCapture(){
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let id = tabs[0].id;

      chrome.tabs.captureVisibleTab(function (screenshotUrl) {
        const viewTabUrl = chrome.extension.getURL('screenshot.html?id=' + id++)
        let targetId = null;

        chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
          if (tabId != targetId || changedProps.status != "complete")
            return;
          chrome.tabs.onUpdated.removeListener(listener);
          const views = chrome.extension.getViews();
          for (var i = 0; i < views.length; i++) {
            const view = views[i];
            if (view.location.href == viewTabUrl) {
              view.setScreenshotUrl(screenshotUrl);
              break;
            }
          }
        });
        chrome.tabs.create({ url: viewTabUrl }, function (tab) {
          targetId = tab.id;
        });
      });
    });
  }
  handleResetStore(){
    chrome.storage.local.clear(function() {
      var error = chrome.runtime.lastError;
      if (error) {
          console.error(error);
      }
    });
  }

  render() {
    const { todos, actions } = this.props;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">FrankenStyle</h1>
          <button type="button" onClick={this.handleHighlightChange}>
            Select element
          </button>
          <input type="text" value={this.state.element} id="displayImg" />
          <hr />
          <button type="button" onClick={this.handleSketchChange}>
            <img src="/img/sketch.png" height="20" width="20" alt="Sketch" />
          </button>
          <br />
          <button type="button" onClick={this.handleScreenCapture}>
            <img src="/img/camera.png" height="20" width="20" alt="Screen Capture" />
          </button>
        </header>

        <Tabs>
          <TabList >
            <Tab>Color/Background</Tab>
            <Tab>Flex</Tab>
            <Tab>Text</Tab>
            <Tab>Border</Tab>
            <Tab>Position</Tab>
            <Tab>Row</Tab>
          </TabList>

          <TabPanel>
            <form >
              <SketchPicker color={this.state.backgroundColor} onChange={this.handleBackgroundColorChange} />
            </form>
          </TabPanel>
          <TabPanel>
            <h2>Flex</h2>
          </TabPanel>
          <TabPanel>
            <h2>Text</h2>
          </TabPanel>
          <TabPanel>
            <h2>Border</h2>
          </TabPanel>
          <TabPanel>
            <h2>Position</h2>
          </TabPanel>
          <TabPanel>
            <h2>Row</h2>
          </TabPanel>
        </Tabs>
        <button onClick= {this.handleDownload}> Download CSS </button>
        <div>
        <button onClick= {this.handleReset}>STORE RESET </button>
        </div>
      </div>
    );
  }
}
