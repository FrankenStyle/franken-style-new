/* global chrome */
import React, { Component } from 'react';
import style from './Button.css';

class Button extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { toggleSidebar: 'true' }, function (response) {
      });
    });
  }
  render() {
    return (
      <div >
        <button className={style.toggleButton} onClick={this.handleClick}>OPEN FRANKENSTYLE</button>
      </div>
    );
  }
}


export default Button;
