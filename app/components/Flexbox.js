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
  }

  render() {
    return (
      <div>
        <div id={style.elementSelector}>
          <div id={style.toggleShrinker}>
            <label className={style.switch}>
              <input id="checkbox" type="checkbox" onChange={() => { /* TODO ENABLE FLEXBOX*/ }} />
              <span className={[style.slider, style.round].join(' ')} />
            </label>
            <span>Enable Flexbox</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Flexbox;
