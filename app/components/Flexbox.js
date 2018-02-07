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
      flexDirection: '',
      justifyContent: '',
      alignItems: "",
      alignContent:""
    };
    this.displayFlex = this.displayFlex.bind(this);
    this.handleFlexDirection = this.handleFlexDirection.bind(this);
    this.handleJustifyContent = this.handleJustifyContent.bind(this);
    this.handleAlignItems = this.handleAlignItems.bind(this);
    this.handleAlignContent = this.handleAlignItems.bind(this);
  }

  displayFlex(){
    const { actions, element } = this.props;
    let flexify = !this.state.displayFlex;
    this.setState({displayFlex:flexify},()=>{
      if(this.state.displayFlex === true){
        actions.addProperty(element, "display", "flex");
      }else{
        actions.removeProperty(element, "display")
        actions.removeProperty(element, "justify-content")
        actions.removeProperty(element, "flex-direction")
      }
    });
  }

  handleFlexDirection(selectedOption) {
    const flexDirection = selectedOption.value;
    const { actions, element } = this.props;
    if (this.state.displayFlex===true) {
      this.setState({ flexDirection }, () => {
          actions.addProperty(element, 'flex-direction', this.state.flexDirection);
      });
    }else{
      actions.removeProperty(element, "flex-direction")
    }
  }
  handleJustifyContent(selectedOption) {
    const justifyContent = selectedOption.value;
    const { actions, element } = this.props;
    if (this.state.displayFlex===true) {
      this.setState({ justifyContent }, () => {
          actions.addProperty(element, 'justify-content', this.state.justifyContent);
      });
    }else{
      actions.removeProperty(element, "justify-content")
    }
  }

  handleAlignItems(selectedOption){
    const alignItems = selectedOption.value;
    const { actions, element } = this.props;
    if (this.state.displayFlex===true) {
      this.setState({ alignItems }, () => {
          actions.addProperty(element, 'align-items', this.state.alignItems);
      });
    }else{
      actions.removeProperty(element, "align-items")
    }
  }

  handleAlignContent(selectedOption){
    const alignContent = selectedOption.value;
    const { actions, element } = this.props;
    if (this.state.displayFlex===true) {
      this.setState({ alignContent }, () => {
          actions.addProperty(element, 'align-content', this.state.alignContent);
      });
    }else{
      actions.removeProperty(element, "align-content")
    }  }

  render() {
    const isElementSelected = this.props.isElementSelected;
    return (
      <div className={!isElementSelected ? style.disabled : ''}>
        <h2 className={style.selectColorTitle}>Enable Flex-Box</h2>
        <div id={style.elementSelector}>
          <div id={style.toggleShrinker}>
            <label className={style.switch}>
              <input id="checkbox" type="checkbox" onChange={() => { this.displayFlex() }} />
              <span className={[style.slider, style.round].join(' ')} />
            </label>
          </div>
        </div>
        <div>
        <h2 className={style.selectColorTitle}>Flex-Direction</h2>
        <Select
        name="flex-direction"
        value={this.state.flexDirection}
        onChange={this.handleFlexDirection}
        options={[
          { value: 'row', label: 'row', clearable: false  },
          { value: 'row-reverse', label: 'row-reverse', clearable: false },
          { value: 'column', label: 'column',  clearable: false  },
          { value: 'column-reverse', label: 'column-reverse', clearable: false  },
        ]}
        />
        <h2 className={style.selectColorTitle}>Justify-Content</h2>
          <Select
            name="justify-content"
            value={this.state.justifyContent}
            onChange={this.handleJustifyContent}
            options={[
              { value: 'flex-start', label: 'flex-start', clearable: false  },
              { value: 'flex-end', label: 'flex-end', clearable: false  },
              { value: 'center', label: 'center', clearable: false  },
              { value: 'space-between', label: 'space-between', clearable: false  },
              { value: 'space-around', label: 'space-around', clearable: false  },
              { value: 'space-evenly', label: 'space-evenly', clearable: false  }
            ]}
          />
          <h2 className={style.selectColorTitle}>Align-Items</h2>
          <Select
            name="align-items"
            value={this.state.alignItems}
            onChange={this.handleAlignItems}
            options={[
              { value: 'flex-start', label: 'flex-start', clearable: false  },
              { value: 'flex-end', label: 'flex-end', clearable: false  },
              { value: 'center', label: 'center', clearable: false  },
              { value: 'stretch', label: 'stretch', clearable: false  },
              { value: 'baseline', label: 'baseline', clearable: false  },
            ]}
          />
          <h2 className={style.selectColorTitle}>Align-Content</h2>
          <Select
            name="align-content"
            value={this.state.alignContent}
            onChange={this.handleAlignContent}
            options={[
              { value: 'flex-start', label: 'flex-start', clearable: false  },
              { value: 'flex-end', label: 'flex-end', clearable: false  },
              { value: 'center', label: 'center', clearable: false  },
              { value: 'space-between', label: 'space-between', clearable: false  },
              { value: 'space-around', label: 'space-around', clearable: false  },
              { value: 'stretch', label: 'stretch', clearable: false  }
            ]}
          />
        </div>
      </div>
    );
  }
}

export default Flexbox;
