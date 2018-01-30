/* global chrome */
import React, { Component } from 'react';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
// import logo from './logo.svg';
import './App.css';
import { SketchPicker } from 'react-color';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontColor: '',
      element: 'Select an Element'
    }

    this.handleFontColorChange = this.handleFontColorChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

      var selectedClassName = request.selectedClassName;
      var selectedNode = request.selectedNode.toLowerCase();
      var selectedClassList = request.selectedClassList;
      var display = selectedNode + "." + selectedClassName

      // console.log("request Obj", request)
      this.setState({ element: display })
      sendResponse({ test: 'test' })
    })
  }

  // handleFontColorChange(newColor) {
  //   this.setState({ fontColor: newColor });
  // }

  handleFontColorChange(newColor) {
    this.setState({ fontColor: newColor.hex });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { data: newColor.hex }, function (response) {
      });
    });
  }

  handleSubmit(color, event) {
    // const theData = event.target.fontColor.value;
    // event.preventDefault();
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   chrome.tabs.sendMessage(tabs[0].id, { data: theData }, function (response) {
    //   });
    // });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">FrankenStyle</h1>
          <input type="text" value={this.state.element} id="displayImg"></input>

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
            <form onSubmit={this.handleSubmit}>
              {/* <input type="text" value={this.state.fontColor} onChange={this.handleFontColorChange} id="fontColor" className="jscolor" > */}
              {/* </input> */}
              <SketchPicker color={this.state.fontColor} onChange={this.handleFontColorChange} id="fontColor"  />
              {/* <button type="submit" value="Submit"> Change Color </button> */}
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
      </div>
    );
  }
}

export default App;
