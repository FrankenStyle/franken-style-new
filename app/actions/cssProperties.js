import * as types from '../constants/ActionTypes';

export function addProperty(tagName, property, propertyValue){
  return {
    type: types.ADD_PROPERTY,
    tagName,
    property,
    propertyValue
  };
}