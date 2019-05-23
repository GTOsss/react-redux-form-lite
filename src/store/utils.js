import {addToObjectByPath, deleteIn, getIn} from '../utils/object-manager';

/**
 *
 * @param state
 * @param form
 * @param map
 * @param {'error' | 'warning'} type
 */
const updateMessages = (state, form, map, type) => {
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

export const updateErrors = (state, form, map) => updateMessages(state, form, map, 'error');

export const updateWarnings = (state, form, map) => updateMessages(state, form, map, 'warning');

/**
 * @param state
 * @param form
 * @param {object?} map
 * @param {object?} map.errors
 * @param {object?} map.warnings
 */
export const updateErrorsAndWarnings = (state, form, {errors = {}, warnings = {}}) => {
  let newState = updateErrors(state, form, errors);
  return updateWarnings(newState, form, warnings);
};