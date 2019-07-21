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
} from '../constants';
import {
  IMapErrorsAndWarningsMessages,
} from '../types';

export const registerForm = (form: string) => ({
  type: REGISTER_FORM, meta: {form},
});

export const registerField = (form: string, field: string, value: any) => ({
  type: REGISTER_FIELD, meta: {form, field}, payload: {value},
});

export const change = (form: string, field: string, value: any) => ({
  type: CHANGE, meta: {form, field}, payload: {value},
});

export const focus = (form: string, field: string) => ({
  type: FOCUS, meta: {form, field},
});

export const blur = (form: string, field: string) => ({
  type: BLUR, meta: {form, field},
});

export const updateValidateMessage = (form: string, field: string, value: any) => ({
  type: UPDATE_VALIDATE_MESSAGE, meta: {form, field}, payload: {value},
});

export const updateValidateMessages = (form: string, errorsMap: MapMessages<any>, submitted?: boolean) => ({
  type: UPDATE_VALIDATE_MESSAGES, meta: {form}, payload: {value: errorsMap, submitted},
});

export const updateWarningMessage = (form: string, field: string, value?: string) => ({
  type: UPDATE_WARNING_MESSAGE, meta: {form, field}, payload: {value},
});

export const updateWarningMessages = (form: string, warningMap: MapMessages<any>, submitted?: string) => ({
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
export const updateValidateAndWarningMessages = (
  form: string,
  map: IMapErrorsAndWarningsMessages<any>,
  submitted?: boolean,
) => ({
  type: UPDATE_VALIDATE_AND_WARNING_MESSAGES, meta: {form}, payload: {value: map, submitted},
});

export const changeSubmitted = (form: string, value: boolean) => ({
  type: CHANGE_SUBMITTED, meta: {form}, payload: {value},
});

export const updateFormState = (form: string, state: IReduxFormState<any>) => ({
  type: UPDATE_FORM_STATE, meta: {form}, payload: {value: state},
});

export const removeField = (form: string, field: string) => ({
  type: REMOVE_FIELD, meta: {form, field},
});

export const removeForm = (form: string) => ({
  type: REMOVE_FORM, meta: {form},
});

export const arrayPush = (form: string, field: string, value: any) => ({
  type: ARRAY_PUSH, meta: {form, field}, payload: {value},
});
