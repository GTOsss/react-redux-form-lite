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
  UPDATE_VALIDATE_AND_WARNING_MESSAGES,
  CHANGE_SUBMITTED,
  UPDATE_FORM_STATE,
  REMOVE_FIELD,
  REMOVE_FORM,
  VALIDATE_FORM,
} from './constants';

export const registerForm = (form) => ({
  type: REGISTER_FORM, meta: {form},
});

export const registerField = (form, field, value) => ({
  type: REGISTER_FIELD, meta: {form, field}, payload: {value},
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
 * @param {boolean?} submitted Submitted
 * @returns {{}} Action
 */
export const updateValidateAndWarningMessages = (form, map, submitted) => ({
  type: UPDATE_VALIDATE_AND_WARNING_MESSAGES, meta: {form}, payload: {value: map, submitted},
});

// /**
//  * @param {string} form Name of form
//  * @param {object} validateMap Validate map from form instance.
//  * @param {object} submitValidateMap Object with validate and warning method in form params
//  * @param {function} submitValidateMap.validate Warning method in form params
//  * @param {function} submitValidateMap.warn Validate method in form params
//  * @param {boolean?} submitted Submitted
//  * @param {function?} resultValidateCallback Callback call when validated
//  * @returns {{payload: {submitted: *, value: *}, meta: {form: *}, type: string}} Action
//  */
// export const validateForm = (
//   form,
//   validateMap,
//   submitValidateMap,
//   submitted,
//   resultValidateCallback,
// ) => ({
//   type: VALIDATE_FORM,
//   meta: {form, callback: resultValidateCallback},
//   payload: {validateMap, submitValidateMap, submitted},
// });

export const changeSubmitted = (form, value) => ({
  type: CHANGE_SUBMITTED, meta: {form}, payload: {value},
});

export const updateFormState = (form, state) => ({
  type: UPDATE_FORM_STATE, meta: {form}, payload: {value: state},
});

export const removeField = (form, field) => ({
  type: REMOVE_FIELD, meta: {form, field},
});

export const removeForm = (form) => ({
  type: REMOVE_FORM, meta: {form},
});

export const arrayPush = (form, field, value) => ({
  type: ARRAY_PUSH, meta: {form, field}, payload: {value},
});
