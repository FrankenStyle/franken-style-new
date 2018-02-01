/* global chrome */
import React, { Component } from 'react';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './App.css';
import { SketchPicker } from 'react-color';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as TodoActions from '../actions/todos';

@connect(
  state => ({
    todos: state.todos
  }),
  dispatch => ({
    actions: bindActionCreators(TodoActions, dispatch)
  })
)

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontColor: '',
      element: 'Select an Element',
      highlight: false
    };

    this.handleFontColorChange = this.handleFontColorChange.bind(this);
    this.handleHighlightChange = this.handleHighlightChange.bind(this);
  }

  componentDidMount() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      let selectedClassName;
      let selectedNode;
      let selectedClassList;

      if (request.selectedClassList) selectedClassList = Array.prototype.slice.call(request.selectedClassList).join('.');

      if (request.selectedNode) selectedNode = request.selectedNode.toLowerCase();
      else selectedNode = '';

      if (request.selectedClassName) selectedClassName = request.selectedClassName.split(' ').join('.');
      else selectedClassName = '';

      const display = selectedClassName ? `${selectedNode}.${selectedClassName}` : selectedNode;

      this.setState({ element: display });
      sendResponse({ test: 'test' });
    });
  }

  handleFontColorChange(newColor) {
    this.setState({ fontColor: newColor.hex });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { 'background-color': newColor.hex }, (response) => {
      });
    });
  }

  handleHighlightChange() {
    const highlight = !this.state.highlight;
    this.setState({ highlight });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { highlight }, (response) => {
      });
    });
  }

  render() {
    const { todos, actions } = this.props;
    console.log("todos:", todos, "actions:", actions)
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">FrankenStyle</h1>
          <button type="button" onClick={this.handleHighlightChange}>
            Select element
          </button>
          <input type="text" value={this.state.element} id="displayImg" />

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
              <SketchPicker color={this.state.fontColor} onChange={this.handleFontColorChange} id="fontColor" />
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

// export default App;
