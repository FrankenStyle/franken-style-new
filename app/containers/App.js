/* global chrome */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import * as cssActions from '../actions/cssProperties';
import style from './App.css';
import { promisifyGetCSS } from '../reducers/cssProperties';
import { Borders, Colors, Flexbox, Texts, Layouts } from '../components';

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
      currentUrl: '',
      isElementSelected: false
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
    console.log('skadfhljdshfljhalj')
    this.handleReset()
    this.setState({ currentUrl: window.location.ancestorOrigins[0] });
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      let cssSelector;

      if (request.cssSelector) {
        cssSelector = request.cssSelector;
      }

      if (request.clicked) {
        this.setState({ isElementSelected: true });
        const chekboxElement = document.getElementById('checkbox');
        chekboxElement.click();
      }

      this.setState({ element: cssSelector });
      sendResponse({ test: 'test' });
    });

    // function handleRemoved(tabId){
    //  this.handleReset();
    // }
    // chrome.tabs.onRemoved.addListener(handleRemoved)


  }

  componentWillUnmount(){
    this.handleReset()
    alert('AJSFHJANFAKSJ')
  }

  download(text) {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${  encodeURIComponent(text)}`);
    element.setAttribute('download', 'style.css');
    element.style.display = 'none';
    element.click();
    document.body.removeChild(element);
  }

  handleDownload() {
    promisifyGetCSS().then(css => this.setState({ newCSS: css }))
      .then(() => this.download(this.state.newCSS));
  }

  handleHighlightChange() {
    const highlight = !this.state.highlight;
    this.setState({ highlight });
    if (highlight && this.state.isElementSelected) {
      this.setState({ isElementSelected: false });
    }
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

      chrome.tabs.sendMessage(tabs[0].id, { toggleSidebar: 'true' }, (response) => {
      });

      setTimeout(() =>  {
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
      }, 250);
    });
  }

  handleClose() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { toggleSidebar: 'true' }, (response) => {
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
          <link rel="stylesheet" href="https://unpkg.com/react-select/dist/react-select.css" />

          <button id={style.buttonClose} type="button" onClick={this.handleClose}>
            <img src="/img/close.png" alt="Close" />
          </button>
          <h1 className={style.appTitle}>FrankenStyle</h1>

          <div id={style.elementSelector}>
            <div id={style.toggleShrinker}>
              <label className={style.switch}>
                <input id="checkbox" type="checkbox" onChange={() => { this.handleHighlightChange(); }} />
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
              <Tab className={style.tabStyle}>Layout</Tab>
            </TabList>
            <TabPanel>
              <Colors element={this.state.element} isElementSelected={this.state.isElementSelected} />
            </TabPanel>
            <TabPanel>
              <Flexbox element={this.state.element} isElementSelected={this.state.isElementSelected} />
            </TabPanel>
            <TabPanel>
              <Texts element={this.state.element} isElementSelected={this.state.isElementSelected} />
            </TabPanel>
            <TabPanel>
              <Borders element={this.state.element} isElementSelected={this.state.isElementSelected} />
            </TabPanel>
            <TabPanel>
              <Layouts element={this.state.element} isElementSelected={this.state.isElementSelected} />
            </TabPanel>
          </Tabs>

          <div id={style.footer}>
            <div id={style.buttons}>
              <button id={style.buttonReset} type="button" onClick={this.handleReset}>
                <img src="/img/reset.png" alt="Reset" title="Reset Chrome Storage.." />
              </button>
              <button id={style.buttonDownload} type="button" onClick={this.handleDownload}>
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
