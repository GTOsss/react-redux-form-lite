import {setIn, deleteIn, getIn} from '../../utils/object-manager';
import {
  IMapValidateErrorsAndWarnings,
  IValues,
  IMapSubmitValidate,
} from '../types';

/**
 *
 * @param {object} state State
 * @param {string} form Name of form
 * @param {object} map Map with errors or warnings
 * @param {boolean} submitted Submitted
 * @param {'error' | 'warning'} type Type of messages
 * @param {string?} wizard Wizard key
 * @return {object} Updated state
 */
const updateMessages = (
  state: IFullReduxFormState<any>,
  form: string,
  map: MapMessages<any>,
  type: 'error' | 'warning',
  submitted?: boolean,
  wizard?: string,
): IFullReduxFormState<any> => {
  const pathMap = {
    error: {
      meta: (key) => `${form}.meta.${key}.error`,
      messagesMap: `${form}.form.errorsMap`,
      hasMessages: `${form}.form.hasErrors`,
      wizardHasMessages: `${wizard}.wizard.hasErrors`,
      wizardMessagesMap: `${wizard}.wizard.errorsMap`,
    },
    warning: {
      meta: (key) => `${form}.meta.${key}.warning`,
      messagesMap: `${form}.form.warningsMap`,
      hasMessages: `${form}.form.hasWarnings`,
      wizardHasMessages: `${wizard}.wizard.hasWarnings`,
      wizardMessagesMap: `${wizard}.wizard.warningsMap`,
    },
  };

  const messagesMapDefault = getIn(state, pathMap[type].messagesMap, {});
  const currentMessagesMap = {...messagesMapDefault, ...map};
  let newState = setIn(state, pathMap[type].messagesMap, currentMessagesMap);
  if (typeof submitted === 'boolean') {
    newState = setIn(newState, `${form}.form.submitted`, submitted);
  }

  Object.entries(currentMessagesMap).forEach(([key, value]) => {
    const isRegisteredField = Boolean(getIn(state, `${form}.meta.${key}`));
    if (isRegisteredField) {
      newState = setIn(newState, pathMap[type].meta(key), value || '');
    }
    if (isRegisteredField && !(value || (value === 0))) {
      newState = deleteIn(newState, `${pathMap[type].messagesMap}.${key}`);
      newState = setIn(newState, `${pathMap[type].meta(key)}`, '');
    }
    if (!isRegisteredField) {
      newState = deleteIn(newState, `${pathMap[type].messagesMap}.${key}`);
    }
  });

  const messagesMap = getIn(newState, pathMap[type].messagesMap);
  const hasMessages = Object.keys(messagesMap).length !== 0;

  if (wizard) {
    newState = setIn(newState, pathMap[type].wizardHasMessages, hasMessages);
    newState = setIn(newState, pathMap[type].wizardMessagesMap, messagesMap);
  }

  return setIn(newState, pathMap[type].hasMessages, hasMessages);
};

export const updateErrors = (
  state: IFullReduxFormState<any>,
  form: string,
  map: MapMessages<any>,
  submitted?: boolean,
  wizard?: string,
): IFullReduxFormState<any> =>
  updateMessages(state, form, map, 'error', submitted, wizard);

export const updateWarnings = (
  state: IFullReduxFormState<any>,
  form: string,
  map: MapMessages<any>,
  submitted?: boolean,
  wizard?: string,
): IFullReduxFormState<any> =>
  updateMessages(state, form, map, 'warning', submitted, wizard);

/**
 * @param {object} state State
 * @param {string} form Name of form
 * @param {object?} map Map with errors and warnings
 * @param {object?} map.errors Map errors
 * @param {object?} map.warnings Map warnings
 * @param {boolean?} submitted Submitted
 * @param {string?} wizard Key of wizard
 * @return {object} Updated state
 */
export const updateErrorsAndWarnings = (
  state: IFullReduxFormState<any>,
  form: string,
  {
    errors = {},
    warnings = {},
  }: IMapErrorsAndWarningsMessages<any>,
  submitted?: boolean,
  wizard?: string,
): IFullReduxFormState<any> => {
  const newState = updateErrors(state, form, errors, submitted, wizard);
  return updateWarnings(newState, form, warnings, submitted, wizard);
};

const getMessageMap = (
  key: string,
  value: any,
  validate: ValidateProps,
  targetMap: MapMessages<any>,
): void => {
  if (validate && (typeof validate === 'function')) {
    targetMap[key] = validate(value);
  } else if (validate && Array.isArray(validate)) {
    for (let i = 0; i < validate.length; i += 1) {
      const result = validate[i](value);
      if (result) {
        targetMap[key] = result;
        break;
      }

      if (i === (validate.length - 1)) {
        targetMap[key] = undefined;
      }
    }
  }
};

export const validateFormByValues = (
  values: IValues,
  validateMap: IMapValidateErrorsAndWarnings = {},
  submitValidateMap: IMapSubmitValidate = {},
) => {
  let resultErrors = {};
  let resultWarnings = {};

  Object.entries(values).forEach(([key, value]) => {
    if (validateMap.validate) {
      getMessageMap(key, value, validateMap.validate[key], resultErrors);
    }
    if (validateMap.warn) {
      getMessageMap(key, value, validateMap.warn[key], resultWarnings);
    }
  });

  if (submitValidateMap && typeof submitValidateMap.validate === 'function') {
    resultErrors = {...resultErrors, ...submitValidateMap.validate(values)};
  }

  if (submitValidateMap && typeof submitValidateMap.warn === 'function') {
    resultWarnings = {...resultWarnings, ...submitValidateMap.warn(values)};
  }

  return {errors: resultErrors, warnings: resultWarnings};
};

interface IValidateFormByStateParams {
  state: IFullReduxFormState<any>;
  form: string;
  validateMap: IMapValidateErrorsAndWarnings;
  submitValidateMap: IMapSubmitValidate;
  submitted?: boolean;
  wizard?: string;
}

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
  state,
  form,
  validateMap,
  submitValidateMap,
  submitted,
  wizard,
}: IValidateFormByStateParams): IFullReduxFormState<any> => {
  const formState = state[form];
  const {values = {}} = formState || {};
  const result = validateFormByValues(values, validateMap, submitValidateMap);
  return updateErrorsAndWarnings(state, form, result, submitted, wizard);
};
