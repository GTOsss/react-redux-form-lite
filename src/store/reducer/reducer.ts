import {
  getIn,
  deleteIn,
  setIn,
} from '../../utils/object-manager';
import {
  updateErrors,
  updateWarnings,
  updateErrorsAndWarnings,
} from '../utils';
import {
  REGISTER_FORM,
  REGISTER_FIELD,
  CHANGE,
  FOCUS,
  BLUR,
  // ARRAY_PUSH,
  UPDATE_WARNING_MESSAGE,
  UPDATE_WARNING_MESSAGES,
  UPDATE_VALIDATE_MESSAGE,
  UPDATE_VALIDATE_MESSAGES,
  UPDATE_VALIDATE_AND_WARNING_MESSAGES,
  CHANGE_SUBMITTED,
  UPDATE_FORM_STATE,
  REMOVE_FIELD,
  REMOVE_FORM,
} from '../constants';

const initialState = {};
const initialStateForm: IFormState<any> = {
  submitted: false,
  focused: false,
  blurred: false,
  changed: false,
  errorsMap: {},
  hasErrors: false,
  hasWarnings: false,
  warningsMap: {},
  activeField: '',
};
const initialStateWizard: IReduxFormWizard<any> = {
  wizard: {
    errorsMap: {},
    hasErrors: false,
    warningsMap: {},
    hasWarnings: false,
  },
  values: {},
};
const initialMeta: IFieldMeta = {
  focused: false,
  active: false,
  blurred: false,
  changed: false,
  warning: '',
  error: '',
};

export default (state = initialState, {type, payload, meta}): IFullReduxFormState<any> => {
  const {form, field, wizard} = meta || {} as any;
  const {value, submitted} = payload || {} as any;

  const pathValue = `${form}.values.${field}`;
  const pathMeta = `${form}.meta.${field}`;
  const pathForm = `${form}.form`;
  const pathWizardState = `${wizard}.wizard`;
  const pathWizardValues = `${wizard}.values`;

  let newState: IFullReduxFormState<any> = {...state};

  switch (type) {
    case REGISTER_FORM:
      newState = setIn(newState, pathForm, initialStateForm);
      newState = wizard && !getIn(newState, wizard) ? setIn(newState, wizard, initialStateWizard) : newState;
      newState = setIn(newState, pathForm, initialStateForm);
      return newState;
    case REGISTER_FIELD:
      newState = setIn(newState, pathValue, value);
      newState = setIn(newState, pathMeta, initialMeta);
      newState = wizard ? setIn(newState, `${pathWizardValues}.${field}`, value) : newState;
      return newState;
    case FOCUS:
      newState = setIn(newState, `${pathMeta}.active`, true);
      newState = setIn(newState, `${pathMeta}.focused`, true);
      newState = setIn(newState, `${pathForm}.focused`, true);
      newState = setIn(newState, `${pathForm}.activeField`, field);
      return newState;
    case CHANGE:
      newState = setIn(newState, `${pathForm}.changed`, true);
      newState = setIn(newState, `${pathMeta}.changed`, true);
      newState = setIn(newState, `${pathValue}`, value);
      newState = wizard ? setIn(newState, `${pathWizardValues}.${field}`, value) : newState;
      return newState;
    case BLUR:
      newState = setIn(newState, `${pathMeta}.active`, false);
      newState = setIn(newState, `${pathMeta}.blurred`, true);
      newState = setIn(newState, `${pathForm}.blurred`, true);
      newState = setIn(newState, `${pathForm}.activeField`, '');
      return newState;
    case UPDATE_VALIDATE_MESSAGE:
      return updateErrors(newState, form, {[field]: value}, undefined, wizard);
    case UPDATE_WARNING_MESSAGE:
      return updateWarnings(newState, form, {[field]: value}, undefined, wizard);
    case UPDATE_VALIDATE_MESSAGES:
      return updateErrors(newState, form, value, submitted, wizard);
    case UPDATE_WARNING_MESSAGES:
      return updateWarnings(newState, form, value, submitted, wizard);
    case UPDATE_VALIDATE_AND_WARNING_MESSAGES:
      return updateErrorsAndWarnings(newState, form, value, submitted, wizard);
    case CHANGE_SUBMITTED:
      return setIn(newState, `${pathForm}.submitted`, value);
    case UPDATE_FORM_STATE:
      newState = wizard && payload.wizardState ? setIn(newState, wizard, payload.wizardState) : newState;
      return setIn(newState, form, value);
    case REMOVE_FIELD: {
      const errorsMap = getIn(newState, `${pathForm}.errorsMap`);
      const warningsMap = getIn(newState, `${pathForm}.warningsMap`);
      if (getIn(errorsMap, field) !== undefined) {
        newState = deleteIn(newState, `${pathForm}.errorsMap.${field}`);
        const hasErrors = Object.keys(getIn(newState, `${pathForm}.errorsMap`)).length !== 0;
        newState = setIn(newState, `${pathForm}.hasErrors`, hasErrors);
      }
      if (getIn(warningsMap, field) !== undefined) {
        newState = deleteIn(newState, `${pathForm}.warningsMap.${field}`);
        const hasWarnings = Object.keys(getIn(newState, `${pathForm}.warningsMap`)).length !== 0;
        newState = setIn(newState, `${pathForm}.hasWarnings`, hasWarnings);
      }
      if (getIn(newState, `${pathForm}.activeField`) === field) {
        setIn(newState, `${pathForm}.activeField`, '');
      }
      newState = deleteIn(newState, `${form}.meta.${field}`);
      newState = deleteIn(newState, `${form}.values.${field}`);
      return newState;
    }
    case REMOVE_FORM:
      return setIn(newState, `${form}`, {});
    default:
      return state;
  }
};
