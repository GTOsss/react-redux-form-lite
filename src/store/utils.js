import {addToObjectByPath, deleteIn, getIn} from '../utils/object-manager';

/**
 *
 * @param state
 * @param form
 * @param map
 * @param {boolean} submitted
 * @param {'error' | 'warning'} type
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
    }
  };

  const messagesMapDefault = getIn(state, pathMap[type].messagesMap, {});
  const currentMessagesMap = {...messagesMapDefault, ...map};
  let newState = addToObjectByPath(state, pathMap[type].messagesMap, currentMessagesMap);
  if (typeof submitted === 'boolean') {
    newState = addToObjectByPath(newState, `${form}.form.submitted`, submitted);
  }

  Object.entries(currentMessagesMap).forEach(([key, value]) => {
    newState = addToObjectByPath(newState, pathMap[type].meta(key), value || '');
    if (!(value || (value === 0))) {
      newState = deleteIn(newState, `${pathMap[type].messagesMap}.${key}`);
      newState = addToObjectByPath(newState, `${pathMap[type].meta(key)}`, '');
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
 * @param state
 * @param form
 * @param {object?} map
 * @param {object?} map.errors
 * @param {object?} map.warnings
 * @param {boolean?} submitted
 */
export const updateErrorsAndWarnings = (state, form, {errors = {}, warnings = {}}, submitted) => {
  let newState = updateErrors(state, form, errors, submitted);
  return updateWarnings(newState, form, warnings, submitted);
};