import {
  REGISTER_FORM,
  REGISTER_FIELD,
  ARRAY_PUSH,
  BLUR,
  FOCUS,
  CHANGE,
  UPDATE_VALIDATE_MESSAGE,
  UPDATE_WARNING_MESSAGE,
} from './constants';

export const registerForm = (form) => ({
  type: REGISTER_FORM, meta: { form },
});

export const registerField = (form, field) => ({
  type: REGISTER_FIELD, meta: { form, field },
});

export const change = (form, field, value) => ({
  type: CHANGE, meta: { form, field }, payload: { value },
});

export const focus = (form, field) => ({
  type: FOCUS, meta: { form, field },
});

export const blur = (form, field) => ({
  type: BLUR, meta: { form, field },
});

export const setValidateMessage = (form, field, value) => ({
  type: UPDATE_VALIDATE_MESSAGE, meta: { form, field }, payload: { value },
});

export const setWarningMessage = (form, field, value) => ({
  type: UPDATE_WARNING_MESSAGE, meta: { form, field }, payload: { value },
});

export const arrayPush = (form, field, value) => ({
  type: ARRAY_PUSH, meta: { form, field }, payload: { value },
});