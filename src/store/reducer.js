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
  submitting: false,
  submitSucceeded: false,
  anyTouched: false,
  active: undefined,
};

const updateValue = (state, pathValue, pathMeta, value, meta) => {
  let newState = { ...state };
  newState = addToObjectByPath(newState, pathValue, value);
  return addToObjectByPath(newState, pathMeta, meta);
};

export default (state = initialState, { type, payload, meta }) => {
  const {
    form, field, fieldArray,
  } = meta || {};
  const {
    value,
  } = payload || {};

  const pathValue = fieldArray ? `${form}.values.${fieldArray}.${field}` : `${form}.values.${field}`;
  const pathMeta = fieldArray ? `${form}.meta.${fieldArray}.${field}` : `${form}.meta.${field}`;
  const pathForm = `${form}.form`;

  let newState = { ...state };

  switch (type) {
    case REGISTER_FORM:
      return addToObjectByPath(newState, pathForm, initialStateForm);
    case REGISTER_FIELD:
      return updateValue(newState, pathValue, pathMeta, undefined, {});
    case FOCUS:
      return addToObjectByPath(newState, `${pathForm}.active`, field);
    case BLUR:
      return addToObjectByPath(newState, `${pathForm}.anyTouched`, true);
    case CHANGE:
      return updateValue(newState, pathValue, pathMeta, value, { changed: true });
    case ARRAY_PUSH:
      return updateValue(newState, pathValue, pathMeta, value, {});
    default:
      return state;
  }
};
