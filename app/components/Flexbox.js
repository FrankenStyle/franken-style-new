import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as cssActions from '../actions/cssProperties';
import style from '../containers/App.css';

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
      displayFlex: false
    };
    this.displayFlex = this.displayFlex.bind(this);
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
      </div>
    );
  }
}

export default Flexbox;
