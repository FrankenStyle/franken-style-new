/* global chrome */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import * as cssActions from '../actions/cssProperties';
import style from './App.css';
import Colors from '../components/Colors';

@connect(
  state => ({
    cssProperties: state.cssProperties
  }),
  dispatch => ({
    actions: bindActionCreators(cssActions, dispatch)
  })
)

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      element: 'Select an Element',
      highlight: false,
      sketchOn: false,
      newCSS: '',
      currentUrl: ''
    };

    this.handleHighlightChange = this.handleHighlightChange.bind(this);
    this.handleSketchChange = this.handleSketchChange.bind(this);
    this.handleScreenCapture = this.handleScreenCapture.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.download = this.download.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  componentDidMount() {
    this.setState({ currentUrl: window.location.ancestorOrigins[0] });
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      let cssSelector;
      if (request.cssSelector) cssSelector = request.cssSelector;
      this.setState({ element: cssSelector });
      sendResponse({ test: 'test' });
    });
  }

  download(text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', 'style.css');
    element.style.display = 'none';
    element.click();
    document.body.removeChild(element);
  }

  handleDownload() {
    const promisifyGet = () =>
      new Promise((resolve) => {
        let newCSS='';
        chrome.storage.local.get((result)=>{
          const storeObj = JSON.parse(result.state);
          const cssProperties = storeObj.cssProperties;
          for (const tagNames in cssProperties) {
            const propertiesArrayLength = cssProperties[tagNames].length-1;
            const singleProperty = cssProperties[tagNames]; // array at tagname
            const cssStyle = singleProperty[propertiesArrayLength];//most recently changed property
            const className = tagNames.split('.');// [span, classname]
            if (className.length===1){
              newCSS += (tagNames + JSON.stringify(cssStyle) + '\n');
            } else {
              newCSS += ('.' + className[1] + JSON.stringify(cssStyle) + '\n');
            }
          }
          newCSS = newCSS.replace(/['"]+/g, '')
            .replace(/[,]+/g, ';')
            .replace(/[}]+/g, ';}');//replaces quotes from JSON.stringify and format for css
          resolve(newCSS);
        });
      });
    promisifyGet().then(css => this.setState({ newCSS: css }))
      .then(() => this.download(this.state.newCSS));
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
    if (sketchOn) {
      const sketchOnClick = 'color: red; outline:1px solid limegreen;';
      document.getElementById('sketchButton').style.cssText = sketchOnClick;
    } else {
      const sketchOffClick = 'color:whitesmoke;';
      document.getElementById('sketchButton').style.cssText = sketchOffClick;
    }
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { sketchOn }, (response) => {
      });
    });
  }

  handleScreenCapture() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let id = tabs[0].id;

      chrome.tabs.captureVisibleTab((screenshotUrl) => {
        const viewTabUrl = chrome.extension.getURL(`/screenshot/screenshot.html?id=${id++}`);
        let targetId = null;

        chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
          if (tabId != targetId || changedProps.status != 'complete') { return; }
          chrome.tabs.onUpdated.removeListener(listener);
          const views = chrome.extension.getViews();
          for (let i = 0; i < views.length; i++) {
            const view = views[i];
            if (view.location.href == viewTabUrl) {
              view.setScreenshotUrl(screenshotUrl);
              break;
            }
          }
        });
        chrome.tabs.create({ url: viewTabUrl }, (tab) => {
          targetId = tab.id;
        });
      });
    });
  }

  handleClose() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { toggleSidebar: 'true' }, function (response) {
      });
    });
  }

  handleReset() {
    const { actions } = this.props;
    actions.resetProperties();
  }

  render() {
    return (
      <div className={style.App}>
        <header className={style.appHeader}>
          <link rel="stylesheet" href="https://unpkg.com/react-tabs@2/style/react-tabs.css" />
          <button id={style.buttonClose} type="button" onClick={this.handleClose}>
            <img src="/img/close.png" alt="Close" />
          </button>
          <h1 className={style.appTitle}>FrankenStyle</h1>

          <div id={style.elementSelector}>
            <div id={style.toggleShrinker}>
              <label className={style.switch}>
                <input type="checkbox" onChange={() => { this.handleHighlightChange(); }} />
                <span className={[style.slider, style.round].join(' ')} />
              </label>
              <span>Select Element</span>
            </div>

            <input type="text" value={this.state.element} id={style.displayImg} />
          </div>
          <hr />
          <div className={style.buttons}>
            <button className={style.buttonStyle} id="sketchButton" type="button" onClick={this.handleSketchChange}>
              <img src="/img/sketch.png" alt="Sketch" /> Draw
            </button>
            <button className={style.buttonStyle} type="button" onClick={this.handleScreenCapture}>
              <img src="/img/camera.png" alt="Screen Capture" /> Screenshot
            </button>
          </div>
        </header>

        <div id={style.mainSection}>
          <Tabs>
            <TabList id={style.colorTab} >
              <Tab className={style.tabStyle}>Color/Background</Tab>
              <Tab className={style.tabStyle}>Flex</Tab>
              <Tab className={style.tabStyle}>Text</Tab>
              <Tab className={style.tabStyle}>Border</Tab>
              <Tab className={style.tabStyle}>Position</Tab>
              <Tab className={style.tabStyle}>Row</Tab>
            </TabList>
            <TabPanel>
              <Colors element={this.state.element} />
            </TabPanel>
            <TabPanel>
              <h2 className={style.selectColorTitle}>Coming Soon!</h2>
            </TabPanel>
            <TabPanel>
              <h2 className={style.selectColorTitle}>Coming Soon!</h2>
            </TabPanel>
            <TabPanel>
              <h2 className={style.selectColorTitle}>Coming Soon!</h2>
            </TabPanel>
            <TabPanel>
              <h2 className={style.selectColorTitle}>Coming Soon!</h2>
            </TabPanel>
            <TabPanel>
              <h2 className={style.selectColorTitle}>Coming Soon!</h2>
            </TabPanel>
          </Tabs>
          
          <div id={style.footer}>
            <div id={style.buttons}>
              <button id={style.buttonReset} type="button" onClick={this.handleReset}>
                <img src="/img/reset.png" alt="Reset" title="Reset Chrome Storage.." />
              </button>
              <button id={style.buttonDownload} type="button" onClick= {this.handleDownload}>
                <img src="/img/download.png" alt="Download" title="Download CSS File" />
              </button>
            </div>
            <input type="text" value={this.state.currentUrl} id={style.currentUrl} disabled />
          </div>
        </div>
      </div>
    );
  }
}
