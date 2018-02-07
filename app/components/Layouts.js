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

export default class Layouts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      heightNumber: 10,
      heightSuffix: 'px',
      widthNumber: 10,
      widthSuffix: 'px',
      marginNumber: 2,
      marginSuffix: 'px',
      paddingNumber: 2,
      paddingSuffix: 'px'
    };

    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleHeightNumberChange = this.handleHeightNumberChange.bind(this);
    this.handleHeightSuffixChange = this.handleHeightSuffixChange.bind(this);
    this.handleWidthNumberChange = this.handleWidthNumberChange.bind(this);
    this.handleWidthSuffixChange = this.handleWidthSuffixChange.bind(this);
    this.handleMarginNumberChange = this.handleMarginNumberChange.bind(this);
    this.handleMarginSuffixChange = this.handleMarginSuffixChange.bind(this);
  }

  handleVisibilityChange() {
    const { actions, element } = this.props;
    const visible = !this.state.visible;
    this.setState({ visible });
    const visibilityProperty = visible ? 'visible' : 'hidden';
    actions.addProperty(element, 'visibility', visibilityProperty);
  }

  handleHeightNumberChange(event) {
    const heightNumber = event.target.value;
    this.setState({ heightNumber });
    const { actions, element } = this.props;
    actions.addProperty(element, 'height', heightNumber + this.state.heightSuffix);
  }

  handleHeightSuffixChange(selectedOption) {
    const { actions, element } = this.props;
    const selectedSuffix = selectedOption && selectedOption.value;
    this.setState({ heightSuffix: selectedSuffix });
    actions.addProperty(element, 'height', this.state.heightNumber + selectedSuffix);
  }

  handleWidthNumberChange(event) {
    const widthNumber = event.target.value;
    this.setState({ widthNumber });
    const { actions, element } = this.props;
    actions.addProperty(element, 'width', widthNumber + this.state.widthSuffix);
  }

  handleWidthSuffixChange(selectedOption) {
    const { actions, element } = this.props;
    const selectedSuffix = selectedOption && selectedOption.value;
    this.setState({ widthSuffix: selectedSuffix });
    actions.addProperty(element, 'width', this.state.widthNumber + selectedSuffix);
  }

  handleMarginNumberChange(event) {
    const marginNumber = event.target.value;
    this.setState({ marginNumber });
    const { actions, element } = this.props;
    actions.addProperty(element, 'margin', marginNumber + this.state.marginSuffix);
  }

  handleMarginSuffixChange(selectedOption) {
    const { actions, element } = this.props;
    const selectedSuffix = selectedOption && selectedOption.value;
    this.setState({ marginSuffix: selectedSuffix });
    actions.addProperty(element, 'margin', this.state.marginNumber + selectedSuffix);
  }

  handlePaddingNumberChange(event) {
    const paddingNumber = event.target.value;
    this.setState({ paddingNumber });
    const { actions, element } = this.props;
    actions.addProperty(element, 'padding', paddingNumber + this.state.paddingSuffix);
  }

  handlePaddingSuffixChange(selectedOption) {
    const { actions, element } = this.props;
    const selectedSuffix = selectedOption && selectedOption.value;
    this.setState({ paddingSuffix: selectedSuffix });
    actions.addProperty(element, 'padding', this.state.paddingNumber + selectedSuffix);
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
          <h2 className={style.selectColorTitle}>Visibility</h2>
          <div id={style.borderStyles}>
            <div id={style.toggleShrinker}>
              <label className={style.switch}>
                <input id="checkbox-visibility" type="checkbox" onChange={() => { this.handleVisibilityChange(); }} />
                <span className={[style.slider, style.round].join(' ')} />
              </label>
            </div>
          </div>

          <h2 className={style.selectColorTitle}>Height</h2>
          <div className={style.inputContainer}>
            <input
              type="text"
              className={style.inputNumber}
              value={this.state.heightNumber}
              onChange={(event) => { this.handleHeightNumberChange(event); }}
            />
            <Select
              clearable={false}
              name="valid-height-suffix"
              value={this.state.heightSuffix}
              onChange={this.handleHeightSuffixChange}
              options={optionsArray}
            />
          </div>

          <h2 className={style.selectColorTitle}>Width</h2>
          <div className={style.inputContainer}>
            <input
              type="text"
              className={style.inputNumber}
              value={this.state.widthNumber}
              onChange={(event) => { this.handleWidthNumberChange(event); }}
            />
            <Select
              clearable={false}
              name="valid-width-suffix"
              value={this.state.widthSuffix}
              onChange={this.handleWidthSuffixChange}
              options={optionsArray}
            />
          </div>

          <h2 className={style.selectColorTitle}>Margin</h2>
          <div className={style.inputContainer}>
            <input
              type="text"
              className={style.inputNumber}
              value={this.state.marginNumber}
              onChange={(event) => { this.handleMarginNumberChange(event); }}
            />
            <Select
              clearable={false}
              name="valid-margin-suffix"
              value={this.state.marginSuffix}
              onChange={this.handleMarginSuffixChange}
              options={optionsArray}
            />
          </div>

          <h2 className={style.selectColorTitle}>Padding</h2>
          <div className={style.inputContainer}>
            <input
              type="text"
              className={style.inputNumber}
              value={this.state.paddingNumber}
              onChange={(event) => { this.handlePaddingNumberChange(event); }}
            />
            <Select
              clearable={false}
              name="valid-padding-suffix"
              value={this.state.paddingSuffix}
              onChange={this.handlePaddingSuffixChange}
              options={optionsArray}
            />
          </div>
        </form>
      </div>
    );
  }
}
