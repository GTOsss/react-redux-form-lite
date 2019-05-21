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

export const updateValidateMessages = (form, errorsMap) => ({
  type: UPDATE_VALIDATE_MESSAGES, meta: {form}, payload: {value: errorsMap},
});

export const updateWarningMessage = (form, field, value) => ({
  type: UPDATE_WARNING_MESSAGE, meta: {form, field}, payload: {value},
});

export const updateWarningMessages = (form, warningMap) => ({
  type: UPDATE_WARNING_MESSAGES, meta: {form}, payload: {value: warningMap},
});

/**
 * @param {string} form name of form
 * @param {object} map Object with 2 fields
 * @param {object} map.errors errorsMap
 * @param {object} map.warnings warningsMap
 * @returns {{}}
 */
export const updateErrorAndWarningMessages = (form, map) => ({
  type: UPDATE_ERROR_AND_WARNING_MESSAGES, meta: {form}, payload: {value: map},
});

export const arrayPush = (form, field, value) => ({
  type: ARRAY_PUSH, meta: {form, field}, payload: {value},
});