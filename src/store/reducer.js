import {getIn, deleteIn, addToObjectByPath} from '../utils/object-manager';
import omit from 'lodash.omit';
import {
  REGISTER_FORM,
  REGISTER_FIELD,
  CHANGE,
  FOCUS,
  BLUR,
  ARRAY_PUSH,
  UPDATE_WARNING_MESSAGE,
  UPDATE_VALIDATE_MESSAGE,
} from './constants';

const initialState = {};
const initialStateForm = {
  submitted: false,
  focused: false,
  blurred: false,
  changed: false,
  errorsMap: null,
  warningsMap: null,
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
      if (getIn(state, `${pathForm}.errorsMap`, {})[field] !== value) {
        let errorsMap = getIn(newState, `${pathForm}.errorsMap`, {});
        errorsMap = value || (value === 0) ? {...errorsMap, [field]: value} : omit(errorsMap, field);
        errorsMap = Object.keys(errorsMap).length ? errorsMap : null;
        newState = addToObjectByPath(newState, `${pathForm}.errorsMap`, errorsMap);
        newState = addToObjectByPath(newState, `${pathMeta}.error`, value || '');
        return newState;
      }
      return state;
    case UPDATE_WARNING_MESSAGE:
      if (getIn(state, `${pathForm}.warningsMap`, {})[field] !== value) {
        let warningsMap = getIn(newState, `${pathForm}.warningsMap`, {});
        warningsMap = value || (value === 0) ? {...warningsMap, [field]: value} : omit(warningsMap, field);
        warningsMap = Object.keys(warningsMap).length ? warningsMap : null;
        newState = addToObjectByPath(newState, `${pathForm}.warningsMap`, warningsMap);
        newState = addToObjectByPath(newState, `${pathMeta}.warning`, value || '');
        return newState;
      }
      return state;
    case ARRAY_PUSH:
    // return updateValue(newState, pathValue, pathMeta, value, {});
    default:
      return state;
  }
};
