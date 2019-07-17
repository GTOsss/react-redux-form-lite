import {addToObjectByPath, deleteIn, getIn} from '../utils/object-manager';

/**
 *
 * @param {object} state State
 * @param {string} form Name of form
 * @param {object} map Map with errors or warnings
 * @param {boolean} submitted Submitted
 * @param {'error' | 'warning'} type Type of messages
 * @return {object} Updated state
 */
const updateMessages = (state, form, map, submitted, type) => {
  const pathMap = {
    error: {
      meta: (key) => `${form}.meta.${key}.error`,
      messagesMap: `${form}.form.errorsMap`,
      hasMessages: `${form}.form.hasErrors`,
    },
    warning: {
      meta: (key) => `${form}.meta.${key}.warning`,
      messagesMap: `${form}.form.warningsMap`,
      hasMessages: `${form}.form.hasWarnings`,
    },
  };

  const messagesMapDefault = getIn(state, pathMap[type].messagesMap, {});
  const currentMessagesMap = {...messagesMapDefault, ...map};
  let newState = addToObjectByPath(state, pathMap[type].messagesMap, currentMessagesMap);
  if (typeof submitted === 'boolean') {
    newState = addToObjectByPath(newState, `${form}.form.submitted`, submitted);
  }

  Object.entries(currentMessagesMap).forEach(([key, value]) => {
    const isRegisteredField = Boolean(getIn(state, `${form}.meta.${key}`));
    if (isRegisteredField) {
      newState = addToObjectByPath(newState, pathMap[type].meta(key), value || '');
    }
    if (isRegisteredField && !(value || (value === 0))) {
      newState = deleteIn(newState, `${pathMap[type].messagesMap}.${key}`);
      newState = addToObjectByPath(newState, `${pathMap[type].meta(key)}`, '');
    }
    if (!isRegisteredField) {
      newState = deleteIn(state, `${pathMap[type].messagesMap}.${key}`);
    }
  });

  const messagesMap = getIn(newState, pathMap[type].messagesMap);
  const hasMessages = Object.keys(messagesMap).length !== 0;

  return addToObjectByPath(newState, pathMap[type].hasMessages, hasMessages);
};

export const updateErrors = (state, form, map, submitted) =>
  updateMessages(state, form, map, submitted, 'error');

export const updateWarnings = (state, form, map, submitted) =>
  updateMessages(state, form, map, submitted, 'warning');

/**
 * @param {object} state State
 * @param {string} form Name of form
 * @param {object?} map Map with errors and warnings
 * @param {object?} map.errors Map errors
 * @param {object?} map.warnings Map warnings
 * @param {boolean?} submitted Submitted
 * @return {object} Updated state
 */
export const updateErrorsAndWarnings = (state, form, {errors = {}, warnings = {}}, submitted) => {
  const newState = updateErrors(state, form, errors, submitted);
  return updateWarnings(newState, form, warnings, submitted);
};

const getMessageMap = (key, value, validate, targetMap) => {
  if (validate && (typeof validate === 'function')) {
    // eslint-disable-next-line no-param-reassign
    targetMap[key] = validate(value);
  } else if (validate && Array.isArray(validate)) {
    for (let i = 0; i < validate.length; i += 1) {
      const result = validate[i](value);
      if ((result === 0) || result) {
        // eslint-disable-next-line no-param-reassign
        targetMap[key] = result;
        break;
      }

      if (i === (validate.length - 1)) {
        // eslint-disable-next-line no-param-reassign
        targetMap[key] = undefined;
      }
    }
  }
};

export const validateFormByValues = (values, validateMap, submitValidateMap = {}) => {
  let resultErrors = {};
  let resultWarnings = {};

  Object.entries(values).forEach(([key, value]) => {
    getMessageMap(key, value, validateMap.validate[key], resultErrors);
    getMessageMap(key, value, validateMap.warn[key], resultWarnings);
  });

  if (submitValidateMap && typeof submitValidateMap.validate === 'function') {
    resultErrors = {...resultErrors, ...submitValidateMap.validate(values)};
  }

  if (submitValidateMap && typeof submitValidateMap.warn === 'function') {
    resultWarnings = {...resultWarnings, ...submitValidateMap.warn(values)};
  }

  return {errors: resultErrors, warnings: resultWarnings};
};

/**
 * @param {object} param params
 * @param {object} param.state state
 * @param {string} param.form from name
 * @param {object} param.validateMap field level validate map with validate methods
 * @param {object} param.submitValidateMap submit level validate map with validate methods
 * @param {boolean?} param.submitted true if need set submitted
 * @returns {*|{}|Object} state or errorAndWarningMap
 */
export const validateFormByState = ({
  state, form, validateMap, submitValidateMap, submitted,
}) => {
  const formState = state[form];
  const {values} = formState;
  const result = validateFormByValues(values, validateMap, submitValidateMap);
  return updateErrorsAndWarnings(state, form, result, submitted);
};
