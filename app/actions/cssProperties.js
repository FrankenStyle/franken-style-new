import * as types from '../constants/ActionTypes';

export function addProperty(tagName, property, propertyValue){
  return {
    type: types.ADD_PROPERTY,
    tagName,
    property,
    propertyValue
  };
}

export function resetProperties() {
  return {
    type: types.RESET_PROPERTIES
  };
}

export function removeProperty(tagName, property){
  return {
    type: types.REMOVE_PROPERTY,
    tagName,
    property
  }
}

