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
      fontWeight: 'normal',
      textTransform: 'none',
      textDecoration: 'none'
    };

    this.handleFontSizeNumberChange = this.handleFontSizeNumberChange.bind(this);
    this.handleFontSizeSuffixChange = this.handleFontSizeSuffixChange.bind(this);
    this.handleFontFamilyChange = this.handleFontFamilyChange.bind(this);
    this.handleFontWeightChange = this.handleFontWeightChange.bind(this);
    this.handleTextTransformChange = this.handleTextTransformChange.bind(this);
    this.handleTextDecorationChange = this.handleTextDecorationChange.bind(this);
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

  handleFontWeightChange(selectedOption) {
    const { actions, element } = this.props;
    const selectedFontWeight = selectedOption && selectedOption.value;
    this.setState({ fontWeight: selectedFontWeight });
    actions.addProperty(element, 'font-weight', selectedFontWeight);
  }

  handleTextTransformChange(selectedOption) {
    const { actions, element } = this.props;
    const selectedTextTransform = selectedOption && selectedOption.value;
    this.setState({ textTransform: selectedTextTransform });
    actions.addProperty(element, 'text-transform', selectedTextTransform);
  }

  handleTextDecorationChange(selectedOption) {
    const { actions, element } = this.props;
    const selectedTextDecoration = selectedOption && selectedOption.value;
    this.setState({ textDecoration: selectedTextDecoration });
    actions.addProperty(element, 'text-decoration', selectedTextDecoration);
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
          <h2 className={style.selectColorTitle}>Font Size</h2>
          <div className={style.inputContainer}>
            <input
              type="text"
              className={style.inputNumber}
              id={style.fontSizeInput}
              value={this.state.fontSizeNumber}
              onChange={(event) => { this.handleFontSizeNumberChange(event); }}
            />
            <Select
              clearable={false}
              name="valid-font-suffix"
              value={this.state.fontSizeSuffix}
              onChange={this.handleFontSizeSuffixChange}
              options={optionsArray}
            />
          </div>

          <h2 className={style.selectColorTitle}>Font Family</h2>
          <div id={style.fontFamily}>
            <Select
              clearable={false}
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

          <h2 className={style.selectColorTitle}>Font Weight</h2>
          <div id={style.fontFamily}>
            <Select
              clearable={false}
              name="valid-font-weight"
              value={this.state.fontWeight}
              onChange={this.handleFontWeightChange}
              options={[
                { value: 'normal', label: 'normal' },
                { value: 'bold', label: 'bold' },
                { value: 'lighter', label: 'lighter' },
                { value: 'bolder', label: 'bolder' },
                { value: 'inherit', label: 'inherit' },
                { value: 'initial', label: 'initial' },
                { value: 'unset', label: 'unset' }
              ]}
            />
          </div>

          <h2 className={style.selectColorTitle}>Text Transformation</h2>
          <div id={style.fontFamily}>
            <Select
              clearable={false}
              name="valid-font-weight"
              value={this.state.textTransform}
              onChange={this.handleTextTransformChange}
              options={[
                { value: 'none', label: 'none' },
                { value: 'capitalize', label: 'capitalize' },
                { value: 'lowercase', label: 'lowercase' },
                { value: 'uppercase', label: 'uppercase' },
                { value: 'initial', label: 'initial' },
                { value: 'inherit', label: 'inherit' },
                { value: 'unset', label: 'unset' }
              ]}
            />
          </div>

          <h2 className={style.selectColorTitle}>Text Decoration</h2>
          <div id={style.fontFamily}>
            <Select
              clearable={false}
              name="valid-font-weight"
              value={this.state.textDecoration}
              onChange={this.handleTextDecorationChange}
              options={[
                { value: 'none', label: 'none' },
                { value: 'underline', label: 'underline' },
                { value: 'line-through', label: 'line-through' },
                { value: 'overline', label: 'overline' },
                { value: 'initial', label: 'initial' },
                { value: 'inherit', label: 'inherit' },
                { value: 'unset', label: 'unset' }
              ]}
            />
          </div>

        </form>
      </div>
    );
  }
}
