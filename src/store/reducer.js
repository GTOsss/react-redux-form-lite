import { getIn, deleteIn, addToObjectByPath } from '../utils/object-manager';
import {
  REGISTER_FORM,
  REGISTER_FIELD,
  CHANGE,
  FOCUS,
  BLUR,
  ARRAY_PUSH,
} from './constants';

const initialState = {};
const initialStateForm = {
  submitted: false,
  focused: false,
  blurred: false,
  changed: false,
  activeField: '',
};
const initialStateField = {
  focused: false,
  active: false,
  blurred: false,
  changed: false,
  warning: '',
  error: '',
};

export default (state = initialState, { type, payload, meta }) => {
  const {
    form, field,
  } = meta || {};
  const {
    value,
  } = payload || {};

  const pathValue = `${form}.values.${field}`;
  const pathMeta = `${form}.meta.${field}`;
  const pathForm = `${form}.form`;

  let newState = { ...state };

  switch (type) {
    case REGISTER_FORM:
      return addToObjectByPath(newState, pathForm, initialStateForm);
    case REGISTER_FIELD:
      newState = addToObjectByPath(state, pathValue, value);
      return addToObjectByPath(newState, pathMeta, initialStateField);
    case FOCUS:
      newState = addToObjectByPath(newState, `${pathMeta}.active`, true);
      newState = addToObjectByPath(newState, `${pathMeta}.focused`, true);
      newState = addToObjectByPath(newState, `${pathForm}.focused`, true);
      return addToObjectByPath(newState, `${pathForm}.activeField`, field);
    case BLUR:
      newState = addToObjectByPath(newState, `${pathMeta}.active`, false);
      newState = addToObjectByPath(newState, `${pathForm}.focused`, false);
      return addToObjectByPath(newState, `${pathForm}.blurred`, true);
    case CHANGE:
      newState = addToObjectByPath(newState, `${pathForm}.changed`, true);
      newState = addToObjectByPath(newState, `${pathMeta}.changed`, true);
      return addToObjectByPath(newState, `${pathValue}`, value);
    case ARRAY_PUSH:
      // return updateValue(newState, pathValue, pathMeta, value, {});
    default:
      return state;
  }
};
