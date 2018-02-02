import { combineReducers } from 'redux';
import todos from './todos';
import cssProperties from './cssProperties'

export default combineReducers({
  todos,
  cssProperties
});
