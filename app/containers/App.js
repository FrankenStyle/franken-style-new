/* global chrome */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import * as cssActions from '../actions/cssProperties';
import style from './App.css';
import { SketchPicker } from 'react-color';

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
      backgroundColor: '',
      element: 'Select an Element',
      highlight: false,
      sketchOn: false
    };

    this.handleBackgroundColorChange = this.handleBackgroundColorChange.bind(this);
    this.handleHighlightChange = this.handleHighlightChange.bind(this);
    this.handleSketchChange = this.handleSketchChange.bind(this);
    this.handleScreenCapture = this.handleScreenCapture.bind(this);
  }

  componentDidMount() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      let cssSelector;

      if (request.cssSelector) cssSelector = request.cssSelector;

      this.setState({ element: cssSelector });
      sendResponse({ test: 'test' });
    });
  }

  handleBackgroundColorChange(newColor) {
    const { actions } = this.props;
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
    if (sketchOn) {
     const sketchOnClick = 'color: red; outline:1px solid limegreen;';
     document.getElementById('sketchButton').style.cssText = sketchOnClick;
   } else{
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
        const viewTabUrl = chrome.extension.getURL(`screenshot.html?id=${  id++}`);
        let targetId = null;

        chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
          if (tabId != targetId || changedProps.status != 'complete')
            {return;}
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

  render() {
    const { actions } = this.props;
    return (
      <div className={style.App}>
        <header className={style.appHeader}>
          <link rel="stylesheet" href="https://unpkg.com/react-tabs@2/style/react-tabs.css" />
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
            <form id={style.colorForm}>
              <h2 className={style.selectColorTitle}>Select Background Color</h2>
              <SketchPicker color={this.state.backgroundColor} onChange={this.handleBackgroundColorChange} />
            </form>
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
      </div>
    );
  }
}
