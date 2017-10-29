import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { routerReducer as routing } from 'react-router-redux';

const fromLabel = (state = { printing: 'ready', error: undefined }, action) {
  switch (action.type) {
    case 'PRINT_FROM_LABEL':
      return Object.assign({}, state, { printing: 'printing' });
    case 'PRINT_FROM_LABEL_ERROR':
      return Object.assign({}, state, { printing: 'failed', error: action.error });
    case 'PRINT_FROM_LABEL_SUCCESS':
      return Object.assign({}, state, { printing: 'done', error: undefined });
      
  }
}


export default combineReducers({
  form,
  routing,
});
