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
      form: `${form}.form.errorsMap`,
    },
    warning: {
      meta: (key) => `${form}.meta.${key}.warning`,
      form: `${form}.form.warningsMap`,
    }
  };

  let newState = addToObjectByPath(state, pathMap[type].form, map);
  Object.entries(map).forEach(([key, value]) => {
    newState = addToObjectByPath(newState, pathMap[type].meta(key), value || '');
    if (!(value || (value === 0))) {
      newState = deleteIn(newState, `${pathMap[type].form}.${key}`);
    }
  });

  return newState;
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