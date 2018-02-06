import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as cssActions from '../actions/cssProperties';
import style from '../containers/App.css';
import Select from 'react-select';

@connect(
  state => ({
    cssProperties: state.cssProperties
  }),
  dispatch => ({
    actions: bindActionCreators(cssActions, dispatch)
  })
)

class Flexbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayFlex: false,
      flexDirection: 'row',
      justifyContent: ''
    };
    this.displayFlex = this.displayFlex.bind(this);
    this.handleFlexDirection = this.handleFlexDirection.bind(this);
    this.handleJustifyContent = this.handleJustifyContent.bind(this);
  }

  handleFlexDirection(selectedOption) {
    const flexDirection = selectedOption.value;
    const { actions, element } = this.props;
    if (this.state.displayFlex===true) {
      this.setState({ flexDirection }, () => {
          actions.addProperty(element, 'flex-direction', this.state.flexDirection);
      });
    }
  }
  handleJustifyContent(selectedOption) {
    const justifyContent = selectedOption.value;
    const { actions, element } = this.props;
    if (this.state.displayFlex===true) {
      this.setState({ justifyContent }, () => {
          actions.addProperty(element, 'justify-content', this.state.justifyContent);
      });
    }
  }

  displayFlex(){
    const { actions, element } = this.props;
    let flexify = !this.state.displayFlex;
    this.setState({displayFlex:flexify},()=>{
      if(this.state.displayFlex === true){
        actions.addProperty(element, "display", "flex");
      }else{
        actions.removeProperty(element, "display")
      }
    });
  }

  render() {
    return (
      <div>
        <div id={style.elementSelector}>
          <div id={style.toggleShrinker}>
            <label className={style.switch}>
              <input id="checkbox" type="checkbox" onChange={() => { this.displayFlex() }} />
              <span className={[style.slider, style.round].join(' ')} />
            </label>
            <span>Display Flex</span>
          </div>
        </div>
        <div>
        <h2>Flex-direction</h2>
        <Select
        name="flex-direction"
        value={this.state.flexDirection}
        onChange={this.handleFlexDirection}
        options={[
          { value: 'row', label: 'row', clearableValue: false },
          { value: 'row-reverse', label: 'row-reverse', clearableValue: false },
          { value: 'column', label: 'column', clearableValue: false },
          { value: 'column-reverse', label: 'column-reverse', clearableValue: false },
        ]}
        />
        <h2>Flex-direction</h2>
          <Select
            name="justify-content"
            value={this.state.justifyContent}
            onChange={this.handleJustifyContent}
            options={[
              { value: 'flex-start', label: 'flex-start', clearableValue: false },
              { value: 'flex-end', label: 'flex-end', clearableValue: false },
              { value: 'center', label: 'center', clearableValue: false },
              { value: 'space-between', label: 'space-between', clearableValue: false },
              { value: 'space-around', label: 'space-around', clearableValue: false },
              { value: 'space-evenly', label: 'space-evenly', clearableValue: false }
            ]}
          />
        </div>
      </div>
    );
  }
}

export default Flexbox;
