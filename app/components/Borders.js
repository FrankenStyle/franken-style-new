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
      borderStyle: 'solid',
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
    actions.addProperty(element, 'border-width', this.state.borderWidthNumber + selectedSuffix );
  }

  render() {
    return (
      <form id={style.colorForm}>
        <h2 className={style.selectColorTitle}>Select Border Style</h2>
        <div id={style.borderStyles}>
          <Select
            name="valid-border-styles"
            value={this.state.borderStyle}
            onChange={this.handleBorderStyleChange}
            options={[
              { value: 'dotted', label: 'dotted' },
              { value: 'dashed', label: 'dashed' },
              { value: 'solid', label: 'solid' },
              { value: 'double', label: 'double' },
              { value: 'groove', label: 'groove' },
              { value: 'ridge', label: 'ridge' },
              { value: 'inset', label: 'inset' },
              { value: 'outset', label: 'outset' },
              { value: 'none', label: 'none' },
              { value: 'hidden', label: 'hidden' }
            ]}
          />
        </div>

        <h2 className={style.selectColorTitle}>Select Border Color</h2>
        <ColorPicker color={this.state.borderColor} onChangeHandler={this.handleBorderColorChange} />

        <h2 className={style.selectColorTitle}>Select Border Width</h2>
        <div id={style.borderWidth}>
          <input type="text" value={this.state.borderWidthNumber} onChange={(event) => { this.handleBorderWidthNumberChange(event); }}  />
          <Select
            name="valid-thickness-suffix"
            value={this.state.borderWidthSuffix}
            onChange={this.handleBorderWidthSuffixChange}
            options={[
              { value: 'px', label: 'px' },
              { value: 'em', label: 'em' },
              { value: '%', label: '%' },
              { value: 'pt', label: 'pt' }
            ]}
          />
        </div>
      </form>
    );
  }
}
