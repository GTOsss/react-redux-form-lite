import {setIn, deleteIn, getIn, mergeDeep} from '../../utils/object-manager';
import {
  IMapValidateErrorsAndWarnings,
  IValues,
  IMapSubmitValidate,
} from '../types';
import {object} from 'prop-types';

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
  const currentMessagesMap = mergeDeep({}, messagesMapDefault, map);
  let newState = setIn(state, pathMap[type].messagesMap, currentMessagesMap);
  if (typeof submitted === 'boolean') {
    newState = setIn(newState, `${form}.form.submitted`, submitted);
  }

  const mapIn = (value, path = '') => {
    if ((typeof value === 'object') && (value !== null)) {
      const currentPath = path ? `${path}.` : '';
      Object.entries(value).forEach(([k, v]) => {
        const fullPath = `${currentPath}${k}`;
        if ((typeof v !== 'object') || (v === null)) {
          const isRegisteredField = Boolean(getIn(state, `${form}.meta.${fullPath}`));
          if (isRegisteredField) {
            newState = setIn(newState, pathMap[type].meta(fullPath), v || '');
          }
          if (isRegisteredField && !(v || (v === 0))) {
            let messages = getIn(newState, pathMap[type].messagesMap);
            messages = deleteIn(messages, fullPath, true);
            newState = setIn(newState, pathMap[type].messagesMap, messages);
            newState = setIn(newState, pathMap[type].meta(fullPath), '');
          }
          if (!isRegisteredField) {
            newState = deleteIn(newState, `${pathMap[type].messagesMap}.${fullPath}`);
          }
        } else {
          mapIn(v, `${currentPath}${fullPath}`);
        }
      });
    }
  };

  mapIn(currentMessagesMap);

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
  messagesMap: MapMessages<any>,
  key: string,
  value: any,
  validate: ValidateProps,
): MapMessages<any> => {
  if (validate && (typeof validate === 'function')) {
    return setIn(messagesMap, key, validate(value));
  } else if (validate && Array.isArray(validate)) {
    for (let i = 0; i < validate.length; i += 1) {
      const result = validate[i](value);
      if (result) {
        return setIn(messagesMap, key, result);
      }

      if (i === (validate.length - 1)) {
        return setIn(messagesMap, key, undefined);
      }
    }
  }
  return messagesMap;
};

export const mergeMessages = (objectA, objectB) => {
  let result = {};

  const mapIn = (value, objectForAdditionValue, path = '') => {
    if ((typeof value === 'object') && (value !== null)) {
      const currentPath = path ? `${path}.` : '';
      Object.entries(value).forEach(([k, v]) => {
        if (typeof v !== 'object') {
          const fullPath = `${currentPath}${k}`;
          result = setIn(result, fullPath, v || getIn(objectForAdditionValue, fullPath));
        } else {
          mapIn(v, objectForAdditionValue, `${currentPath}${k}`);
        }
      });
    }
  };

  mapIn(objectA, objectB);
  mapIn(objectB, objectA);

  return result;
};

export const setInitialValues = (state, form, wizard, pathWizardValues, initialValues?) => {
  let newState = {...state};
  const currentInitialValues = initialValues || getIn(newState, `${form}.initialValues`) || {};
  const currentValues = getIn(newState, `${form}.values`);
  const mergedInitialValues = mergeMessages(currentValues, currentInitialValues);
  newState = setIn(newState, `${form}.values`, mergedInitialValues);
  newState = setIn(newState, `${form}.initialValues`, currentInitialValues);
  if (wizard) {
    const currentValuesWizard = getIn(newState, pathWizardValues);
    const mergedInitialValuesWizard = mergeMessages(currentValuesWizard, currentInitialValues);
    newState = setIn(newState, pathWizardValues, mergedInitialValuesWizard);
  }
  return newState;
};

const mapValuesInDeepAndGetMessages = (messagesMap, handlersMap, values): MapMessages<any> => {
  let result = messagesMap;
  const mapIn = (value, path = '') => {
    if ((typeof value === 'object') && (value !== null)) {
      const currentPath = path ? `${path}.` : '';
      Object.entries(value).forEach(([k, v]) => {
        if (typeof v !== 'object') {
          const fullPath = `${currentPath}${k}`;
          result = getMessageMap(result, fullPath, v, handlersMap[fullPath]);
        } else {
          mapIn(v, `${currentPath}${k}`);
        }
      });
    }
  };

  mapIn(values);
  return result;
};

export const validateFormByValues = (
  values: IValues,
  validateMap: IMapValidateErrorsAndWarnings = {},
  submitValidateMap: IMapSubmitValidate = {},
) => {
  let resultFieldLevelErrors = {};
  let resultFieldLevelWarnings = {};
  let resultSubmitErrors = {};
  let resultSubmitWarnings = {};

  if (validateMap.validate) {
    resultFieldLevelErrors = mapValuesInDeepAndGetMessages(resultFieldLevelErrors, validateMap.validate, values);
  }
  if (validateMap.warn) {
    resultFieldLevelWarnings = mapValuesInDeepAndGetMessages(resultFieldLevelWarnings, validateMap.warn, values);
  }

  if (submitValidateMap && typeof submitValidateMap.validate === 'function') {
    resultSubmitErrors = submitValidateMap.validate(values);
  }

  if (submitValidateMap && typeof submitValidateMap.warn === 'function') {
    resultSubmitWarnings = submitValidateMap.warn(values);
  }

  const resultErrors = mergeMessages(resultFieldLevelErrors, resultSubmitErrors);
  const resultWarnings = mergeMessages(resultFieldLevelWarnings, resultSubmitWarnings);

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
