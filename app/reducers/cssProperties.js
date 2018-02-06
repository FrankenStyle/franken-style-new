import { ADD_PROPERTY, RESET_PROPERTIES, CURRENT_CSS } from '../constants/ActionTypes';

const initialState = {};

/**
 * THUNK CREATORS
 */

export const promisifyGetCSS = () =>
new Promise((resolve) => {
  let newCSS = '';
  chrome.storage.local.get((result)=>{
    const storeObj = JSON.parse(result.state);
    const cssProperties = storeObj.cssProperties;
    for (const tagNames in cssProperties) {
      const propertiesArrayLength = cssProperties[tagNames].length-1;
      const singleProperty = cssProperties[tagNames]; // array at tagname
      const cssStyle = singleProperty[propertiesArrayLength];//most recently changed property
      const className = tagNames.split('.');// [span, classname]
      if (className[1]===undefined){
        newCSS += (tagNames + JSON.stringify(cssStyle) + '\n');
      } else {
        newCSS += ('.' + className[1] + JSON.stringify(cssStyle) + '\n');
      }
    }
    newCSS = newCSS.replace(/['"]+/g, '')
      .replace(/[,]+/g, ';')
      .replace(/[}]+/g, ';}');//replaces quotes from JSON.stringify and format for css
    resolve(newCSS);
  });
});

export const download = (text)=> {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', 'style.css');
  element.style.display = 'none';
  element.click();
  document.body.removeChild(element);
};
/**
 * REDUCER
 */
export default function cssProperties(state = initialState, action) {
  switch (action.type) {
    case ADD_PROPERTY:
      const tagName = action.tagName;
      const property = action.property;
      const propertyValue = action.propertyValue;
      let propHistory = state[tagName] || [];
      return {
        ...state,
        [tagName]: propHistory.concat({
          ...(propHistory[propHistory.length - 1] || {}),
          [property]: propertyValue
        })
      };
    case RESET_PROPERTIES:
      return {};
    default:
      return state;
  }
}

