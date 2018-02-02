import {ADD_PROPERTY} from '../constants/ActionTypes';

const initialState = {}

export default function cssProperties(state = initialState, action){
    switch (action.type){
        case ADD_PROPERTY:
            const tagName = action.tagName
            const property = action.property;
            const propertyValue = action.propertyValue;
            let propHistory = state[tagName] || [];
            return {
                ...state,
                [tagName]: propHistory.concat({
                    ...(propHistory[propHistory.length-1] || {}),
                    [property]: propertyValue
                })
            }
    

        default:
            return state;    
    }
}

