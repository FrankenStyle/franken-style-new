/* global chrome */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as cssActions from '../actions/cssProperties';
import style from '../containers/App.css';
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

export default class Texts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontSizeNumber: 15,
      fontSizeSuffix: 'px',
      fontFamily: 'Arial',
    };

    this.handleFontSizeNumberChange = this.handleFontSizeNumberChange.bind(this);
    this.handleFontSizeSuffixChange = this.handleFontSizeSuffixChange.bind(this);
    this.handleFontFamilyChange = this.handleFontFamilyChange.bind(this);
  }


  handleFontSizeNumberChange(event) {
    const fontSizeNumber = event.target.value;
    this.setState({ fontSizeNumber });
    const { actions, element } = this.props;
    actions.addProperty(element, 'font-size', fontSizeNumber + this.state.fontSizeSuffix);
  }

  handleFontSizeSuffixChange(selectedOption) {
    const { actions, element } = this.props;
    const selectedSuffix = selectedOption && selectedOption.value;
    this.setState({ fontSizeSuffix: selectedSuffix });
    actions.addProperty(element, 'font-size', this.state.fontSizeNumber + selectedSuffix);
  }

  handleFontFamilyChange(selectedOption) {
    const { actions, element } = this.props;
    const selectedFontFamily = selectedOption && selectedOption.value;
    this.setState({ fontFamily: selectedFontFamily });
    actions.addProperty(element, 'font-family', selectedFontFamily);
  }

  render() {
    return (
      <form id={style.colorForm}>


        <h2 className={style.selectColorTitle}>Select Font Size</h2>
        <div id={style.borderWidth}>
          <input type="text" value={this.state.fontSizeNumber} onChange={(event) => { this.handleFontSizeNumberChange(event); }} />
          <Select
            name="valid-font-suffix"
            value={this.state.fontSizeSuffix}
            onChange={this.handleFontSizeSuffixChange}
            options={[
              { value: 'px', label: 'px' },
              { value: 'em', label: 'em' },
              { value: '%', label: '%' },
              { value: 'pt', label: 'pt' }
            ]}
          />
        </div>


        <h2 className={style.selectColorTitle}>Select Font Family</h2>
        <div id={style.fontFamily}>
          <Select
            name="valid-font-family"
            value={this.state.fontFamily}
            onChange={this.handleFontFamilyChange}
            options={[
              { value: 'Arial', label: 'Arial' },
              { value: 'Helvetica', label: 'Helvetica' },
              { value: 'Times', label: 'Times' },
              { value: 'Courier', label: 'Courier' },
              { value: 'Georgia', label: 'Georgia' },
              { value: 'Palatino', label: 'Palatino' },
              { value: 'Garamond', label: 'Garamond' },
              { value: 'Comic Sans MS', label: 'Comic Sans MS' }
            ]}
          />
        </div>

      </form>
    );
  }
}
