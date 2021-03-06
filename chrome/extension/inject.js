/* global chrome */
import React, { Component } from 'react';
import { render } from 'react-dom';
import Dock from 'react-dock';
//Does Dock have 'on hidden' property?

class InjectApp extends Component {
  constructor(props) {
    super(props);
    this.state = { isVisible: false };
  }
  componentDidMount() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.toggleSidebar === 'true') {
        this.setState({ isVisible: !this.state.isVisible }, sendResponse);
      }
    });
  }
  render() {
    return (
      <div>
        <Dock
          position="right"
          dimMode="none"
          size={0.3}
          isVisible={this.state.isVisible}
        >
          <iframe
            style={{
              width: '100%',
              height: '100%',
            }}
            frameBorder={0}
            allowTransparency="true"
            src={chrome.extension.getURL(`inject.html?protocol=${location.protocol}`)}
          />
        </Dock>
      </div>
    );
  }
}

window.addEventListener('load', () => {
  const injectDOM = document.createElement('div');
  injectDOM.className = 'inject-react-example';
  injectDOM.style.textAlign = 'center';
  document.body.appendChild(injectDOM);
  render(<InjectApp />, injectDOM);
});
