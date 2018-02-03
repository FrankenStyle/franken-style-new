/* global chrome */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as cssActions from '../actions/cssProperties';
import style from '../containers/App.css';
import { SketchPicker } from 'react-color';

@connect(
  state => ({
    cssProperties: state.cssProperties
  }),
  dispatch => ({
    actions: bindActionCreators(cssActions, dispatch)
  })
)

export default class Colors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: ''
    };

    this.handleBackgroundColorChange = this.handleBackgroundColorChange.bind(this);
  }

  handleBackgroundColorChange(newColor) {
    const { actions, element } = this.props;
    this.setState({ backgroundColor: newColor.hex });
    actions.addProperty(element, 'background-color', newColor.hex);
  }

  render() {
    return (
      <form id={style.colorForm}>
        <h2 className={style.selectColorTitle}>Select Background Color</h2>
        <SketchPicker color={this.state.backgroundColor} onChange={this.handleBackgroundColorChange} />
      </form>
    );
  }
}
