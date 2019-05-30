import {
  REGISTER_FORM,
  REGISTER_FIELD,
  ARRAY_PUSH,
  BLUR,
  FOCUS,
  CHANGE,
  UPDATE_VALIDATE_MESSAGE,
  UPDATE_VALIDATE_MESSAGES,
  UPDATE_WARNING_MESSAGE,
  UPDATE_WARNING_MESSAGES,
  UPDATE_ERROR_AND_WARNING_MESSAGES,
  CHANGE_SUBMITTED,
  UPDATE_FORM_STATE,
} from './constants';

export const registerForm = (form) => ({
  type: REGISTER_FORM, meta: {form},
});

export const registerField = (form, field) => ({
  type: REGISTER_FIELD, meta: {form, field},
});

export const change = (form, field, value) => ({
  type: CHANGE, meta: {form, field}, payload: {value},
});

export const focus = (form, field) => ({
  type: FOCUS, meta: {form, field},
});

export const blur = (form, field) => ({
  type: BLUR, meta: {form, field},
});

export const updateValidateMessage = (form, field, value) => ({
  type: UPDATE_VALIDATE_MESSAGE, meta: {form, field}, payload: {value},
});

export const updateValidateMessages = (form, errorsMap, submitted) => ({
  type: UPDATE_VALIDATE_MESSAGES, meta: {form}, payload: {value: errorsMap, submitted},
});

export const updateWarningMessage = (form, field, value) => ({
  type: UPDATE_WARNING_MESSAGE, meta: {form, field}, payload: {value},
});

export const updateWarningMessages = (form, warningMap, submitted) => ({
  type: UPDATE_WARNING_MESSAGES, meta: {form}, payload: {value: warningMap, submitted},
});

/**
 * @param {string} form name of form
 * @param {object} map Object with 2 fields
 * @param {object} map.errors errorsMap
 * @param {object} map.warnings warningsMap
 * @param {boolean?} submitted
 * @returns {{}}
 */
export const updateErrorAndWarningMessages = (form, map, submitted) => ({
  type: UPDATE_ERROR_AND_WARNING_MESSAGES, meta: {form}, payload: {value: map, submitted},
});

export const changeSubmitted = (form, value) => ({
  type: CHANGE_SUBMITTED, meta: {form}, payload: {value}
});

export const arrayPush = (form, field, value) => ({
  type: ARRAY_PUSH, meta: {form, field}, payload: {value},
});

export const updateFormState = (form, state) => ({
  type: UPDATE_FORM_STATE, meta: {form}, payload: {value: state},
});