import {getIn, deleteIn, addToObjectByPath} from '../utils/object-manager';
import {updateErrors, updateWarnings, updateErrorsAndWarnings} from './utils';
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
  UPDATE_VALIDATE_AND_WARNING_MESSAGES,
  CHANGE_SUBMITTED,
  UPDATE_FORM_STATE,
  REMOVE_FIELD,
  REMOVE_FORM,
} from './constants';

const initialState = {};
const initialStateForm = {
  submitted: false,
  focused: false,
  blurred: false,
  changed: false,
  errorsMap: {},
  hasErrors: false,
  hasWarnings: false,
  warningsMap: {},
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
  const {value, submitted} = payload || {};

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
      return updateErrors(newState, form, value, submitted);
    case UPDATE_WARNING_MESSAGES:
      return updateWarnings(newState, form, value, submitted);
    case UPDATE_VALIDATE_AND_WARNING_MESSAGES:
      return updateErrorsAndWarnings(newState, form, value, submitted);
    case CHANGE_SUBMITTED:
      return addToObjectByPath(newState, `${pathForm}.submitted`, value);
    case UPDATE_FORM_STATE:
      return addToObjectByPath(newState, form, value);
    case REMOVE_FIELD: {
      const errorsMap = getIn(newState, `${pathForm}.errorsMap`);
      const warningsMap = getIn(newState, `${pathForm}.warningsMap`);
      if (getIn(errorsMap, field) !== undefined) {
        newState = deleteIn(newState, `${pathForm}.errorsMap.${field}`);
        const hasErrors = Object.keys(getIn(newState, `${pathForm}.errorsMap`)).length !== 0;
        newState = addToObjectByPath(newState, `${pathForm}.hasErrors`, hasErrors);
      }
      if (getIn(warningsMap, field) !== undefined) {
        newState = deleteIn(newState, `${pathForm}.warningsMap.${field}`);
        const hasWarnings = Object.keys(getIn(newState, `${pathForm}.warningsMap`)).length !== 0;
        newState = addToObjectByPath(newState, `${pathForm}.hasWarnings`, hasWarnings);
      }
      if (getIn(newState, `${pathForm}.activeField`) === field) {
        addToObjectByPath(newState, `${pathForm}.activeField`, '');
      }
      newState = deleteIn(newState, `${form}.meta.${field}`);
      newState = deleteIn(newState, `${form}.values.${field}`);
      return newState;
    }
    case REMOVE_FORM:
      return addToObjectByPath(newState, `${form}`, {});
    // case ARRAY_PUSH:
    // return updateValue(newState, pathValue, pathMeta, value, {});
    default:
      return state;
  }
};
