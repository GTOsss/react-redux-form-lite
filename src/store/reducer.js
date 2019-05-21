import {getIn, deleteIn, addToObjectByPath} from '../utils/object-manager';
import {updateErrors, updateWarnings, updateErrorsAndWarnings} from './utils';
import omit from 'lodash.omit';
import {
  REGISTER_FORM,
  REGISTER_FIELD,
  CHANGE,
  FOCUS,
  BLUR,
  ARRAY_PUSH,
  UPDATE_WARNING_MESSAGE,
  UPDATE_WARNING_MESSAGES,
  UPDATE_VALIDATE_MESSAGE,
  UPDATE_VALIDATE_MESSAGES,
  UPDATE_ERROR_AND_WARNING_MESSAGES,
} from './constants';

const initialState = {};
const initialStateForm = {
  submitted: false,
  focused: false,
  blurred: false,
  changed: false,
  errorsMap: {},
  haveErrors: false,
  warningsMap: {},
  haveWarnings: false,
  activeField: '',
};
const initialMeta = {
  focused: false,
  active: false,
  blurred: false,
  changed: false,
  warning: '',
  error: '',
};

export default (state = initialState, {type, payload, meta}) => {
  const {form, field} = meta || {};
  const {value} = payload || {};

  const pathValue = `${form}.values.${field}`;
  const pathMeta = `${form}.meta.${field}`;
  const pathForm = `${form}.form`;

  let newState = {...state};

  switch (type) {
    case REGISTER_FORM:
      newState = addToObjectByPath(newState, pathForm, initialStateForm);
      return newState;
    case REGISTER_FIELD:
      newState = addToObjectByPath(state, pathValue, value);
      newState = addToObjectByPath(newState, pathMeta, initialMeta);
      return newState;
    case FOCUS:
      newState = addToObjectByPath(newState, `${pathMeta}.active`, true);
      newState = addToObjectByPath(newState, `${pathMeta}.focused`, true);
      newState = addToObjectByPath(newState, `${pathForm}.focused`, true);
      newState = addToObjectByPath(newState, `${pathForm}.activeField`, field);
      return newState;
    case CHANGE:
      newState = addToObjectByPath(newState, `${pathForm}.changed`, true);
      newState = addToObjectByPath(newState, `${pathMeta}.changed`, true);
      newState = addToObjectByPath(newState, `${pathValue}`, value);
      return newState;
    case BLUR:
      newState = addToObjectByPath(newState, `${pathMeta}.active`, false);
      newState = addToObjectByPath(newState, `${pathMeta}.blurred`, true);
      newState = addToObjectByPath(newState, `${pathForm}.blurred`, true);
      newState = addToObjectByPath(newState, `${pathForm}.activeField`, '');
      return newState;
    case UPDATE_VALIDATE_MESSAGE:
      return updateErrors(newState, form, {[field]: value});
    case UPDATE_WARNING_MESSAGE:
      return updateWarnings(newState, form, {[field]: value});
    case UPDATE_VALIDATE_MESSAGES:
      return updateErrors(newState, form, value);
    case UPDATE_WARNING_MESSAGES:
      return updateWarnings(newState, form, value);
    case UPDATE_ERROR_AND_WARNING_MESSAGES:
      return updateErrorsAndWarnings(newState, form, value);
    case ARRAY_PUSH:
    // return updateValue(newState, pathValue, pathMeta, value, {});
    default:
      return state;
  }
};
