/* global chrome */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as cssActions from '../actions/cssProperties';
import style from '../containers/App.css';
import ColorPicker from './ColorPicker';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

@connect(
  state => ({
    cssProperties: state.cssProperties
  }),
  dispatch => ({
    actions: bindActionCreators(cssActions, dispatch)
  })
)

export default class Borders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      borderStyle: 'none',
      borderColor: '#FA1A1A',
      borderWidthNumber: '10',
      borderWidthSuffix: 'px'
    };

    this.handleBorderColorChange = this.handleBorderColorChange.bind(this);
    this.handleBorderStyleChange = this.handleBorderStyleChange.bind(this);
    this.handleBorderWidthNumberChange = this.handleBorderWidthNumberChange.bind(this);
    this.handleBorderWidthSuffixChange = this.handleBorderWidthSuffixChange.bind(this);
  }

  handleBorderColorChange(newColor) {
    const { actions, element } = this.props;
    this.setState({ borderColor: newColor.hex });
    actions.addProperty(element, 'border-color', newColor.hex);
  }

  handleBorderStyleChange(selectedOption) {
    const { actions, element } = this.props;
    const selectedStyle = selectedOption && selectedOption.value;
    this.setState({ borderStyle: selectedStyle });
    actions.addProperty(element, 'border-style', selectedStyle);
  }

  handleBorderWidthNumberChange(event) {
    const borderWidthNumber = event.target.value;
    this.setState({ borderWidthNumber });
    const { actions, element } = this.props;
    actions.addProperty(element, 'border-width', borderWidthNumber + this.state.borderWidthSuffix);
  }

  handleBorderWidthSuffixChange(selectedOption) {
    const { actions, element } = this.props;
    const selectedSuffix = selectedOption && selectedOption.value;
    this.setState({ borderWidthSuffix: selectedSuffix });
    actions.addProperty(element, 'border-width', this.state.borderWidthNumber + selectedSuffix);
  }

  render() {
    const optionsArray = [
      { value: 'px', label: 'px' },
      { value: 'em', label: 'em' },
      { value: '%', label: '%' },
      { value: 'pt', label: 'pt' }
    ];
    const isElementSelected = this.props.isElementSelected;
    return (
      <div className={!isElementSelected ? style.disabled : ''}>
        <form id={style.colorForm}>

          <h2 className={style.selectColorTitle}>Style</h2>
          <div id={style.borderStyles}>
            <Select
              clearable={false}
              name="valid-border-styles"
              value={this.state.borderStyle}
              onChange={this.handleBorderStyleChange}
              options={[
                { value: 'none', label: 'none' },
                { value: 'dotted', label: 'dotted' },
                { value: 'dashed', label: 'dashed' },
                { value: 'solid', label: 'solid' },
                { value: 'double', label: 'double' },
                { value: 'groove', label: 'groove' },
                { value: 'ridge', label: 'ridge' },
                { value: 'inset', label: 'inset' },
                { value: 'outset', label: 'outset' },
                { value: 'hidden', label: 'hidden' }
              ]}
            />
          </div>

          <h2 className={style.selectColorTitle}>Width</h2>
          <div className={style.inputContainer}>
            <input
              className={style.inputContainer}
              type="text"
              value={this.state.borderWidthNumber}
              onChange={(event) => { this.handleBorderWidthNumberChange(event); }}
            />
            <Select
              clearable={false}
              name="valid-thickness-suffix"
              value={this.state.borderWidthSuffix}
              onChange={this.handleBorderWidthSuffixChange}
              options={optionsArray}
            />
          </div>

          <h2 className={style.selectColorTitle}>Color</h2>
          <ColorPicker color={this.state.borderColor} onChangeHandler={this.handleBorderColorChange} />
        </form>
      </div>
    );
  }
}
