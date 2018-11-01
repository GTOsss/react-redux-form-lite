import {
  REGISTER_FORM,
  REGISTER_FIELD,
  ARRAY_PUSH,
  BLUR,
  FOCUS,
  CHANGE,
  UPDATE_ERROR,
  UPDATE_WARNING,
} from './constants';

export const registerForm = (form) => ({
  type: REGISTER_FORM, meta: { form },
});

export const registerField = (form, field) => ({
  type: REGISTER_FIELD, meta: { form, field },
});

export const arrayPush = (form, field, value) => ({
  type: ARRAY_PUSH, meta: { form, field }, payload: { value },
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
