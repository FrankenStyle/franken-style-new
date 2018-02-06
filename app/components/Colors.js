/* global chrome */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as cssActions from '../actions/cssProperties';
import style from '../containers/App.css';
import { SketchPicker } from 'react-color';
import ColorPicker from './ColorPicker';

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
      color: '#FA1A1A',
      backgroundColor: '#FA1A1A'
    };

    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleBackgroundColorChange = this.handleBackgroundColorChange.bind(this);
  }

  handleBackgroundColorChange(newColor) {
    const { actions, element } = this.props;
    this.setState({ backgroundColor: newColor.hex });
    actions.addProperty(element, 'background-color', newColor.hex);
  }

  handleColorChange(newColor) {
    const { actions, element } = this.props;
    this.setState({ color: newColor.hex });
    actions.addProperty(element, 'color', newColor.hex);
  }

  render() {
    return (
      <form id={style.colorForm}>
        <h2 className={style.selectColorTitle}>Font Color</h2>
        <ColorPicker color={this.state.color} onChangeHandler={this.handleColorChange} />

        <h2 className={style.selectColorTitle}>Background Color</h2>
        <ColorPicker color={this.state.backgroundColor} onChangeHandler={this.handleBackgroundColorChange} />
      </form>
    );
  }
}
