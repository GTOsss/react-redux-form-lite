import React, {Component, createElement} from 'react';
import omit from 'lodash.omit';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import stringToPath from 'lodash.topath';
import * as actions from '../store/actions';
import {getValue} from '../utils/dom-helper';
import ReduxFormContext from '../redux-form/redux-form-context';
import FieldArrayContext, {IFieldArrayContext} from '../field-array/field-array-context';
import {getIn, setIn} from '..';
import {
  validateFormByValues as validateFormByValuesUtil,
} from '../store/utils';
import FormSectionContext from '../form-section/form-section-context';
import {IPropsField as IProps} from '../../index';
import {IPropInput} from '../../index';
import {IFormContext} from '../redux-form/types';

interface IState {
}

interface IInjected {
  formContext: IFormContext;
  fieldArrayContext: IFieldArrayContext;
  actions: IReduxFormActions<any>;
  formState: IReduxFormState<any>;
  ownProps: any;
}

class Field extends Component<IProps, IState> {
  static defaultProps = {
    actions: {},
    formContext: {},
    fieldArrayContext: {},
    formState: {},
    ownProps: {},
  };

  get injected(): IInjected {
    // @ts-ignore
    return this.props as IInjected;
  }

  componentDidMount() {
    const {
      actions: {registerField},
      formState: {values},
    } = this.injected;

    const {
      name,
      formContext: {form, updateValidateAndWarnMap, wizard},
      // fieldArrayContext: {fieldName: fieldArrayName},
      validate,
      warn,
    } = this.props;

    updateValidateAndWarnMap(name, validate, warn);
    registerField(form, name, getIn(values, name), wizard);
  }

  componentWillUnmount() {
    const {
      actions: {removeField},
      formContext: {form, destroyOnUnmount},
      fieldArrayContext: {name: fieldArrayName},
    } = this.injected;
    const {
      name,
    } = this.props;
    if (destroyOnUnmount && !fieldArrayName) {
      removeField(form, name);
    }
  }

  validateAndWarning = (value) => {
    const {
      actions: {updateValidateAndWarningMessages},
      formState: {values},
    } = this.injected;
    const {
      validate,
      warn,
      name,
      formContext: {
        form,
        validate: validateSubmit,
        warn: warnSubmit,
        wizard,
      },
    } = this.props;

    const submitValidateMap = {validate: validateSubmit, warn: warnSubmit};
    const validateMap = {validate: {}, warn: {}};

    const path = stringToPath(name);
    const formattedName = path.join('.');

    if (validate) {
      validateMap.validate[formattedName] = validate;
    }

    if (warn) {
      validateMap.warn[formattedName] = warn;
    }

    const currentValues = setIn(values, name, value);

    const resultMap = validateFormByValuesUtil(currentValues, validateMap, submitValidateMap);

    if (Object.keys(resultMap.errors).length !== 0
      || Object.keys(resultMap.warnings).length !== 0) {
      updateValidateAndWarningMessages(form, resultMap, undefined, wizard);
    }
  };

  onChange = (e) => {
    const value = getValue(e);
    const {
      actions: {change},
    } = this.injected;
    const {
      formContext: {form, wizard},
      name,
      onChange,
    } = this.props;

    if (onChange) {
      onChange(e);
    }

    change(form, name, value, wizard);
    this.validateAndWarning(value);
  };

  onFocus = (e) => {
    const {
      actions: {focus},
    } = this.injected;
    const {
      formContext: {form}, name, onFocus,
    } = this.props;

    if (onFocus) {
      onFocus(e);
    }

    focus(form, name);
  };

  onBlur = (e) => {
    const {
      actions: {blur},
    } = this.injected;
    const {
      formContext: {form}, name, onBlur,
    } = this.props;

    const value = getValue(e);

    if (onBlur) {
      onBlur(e);
    }

    blur(form, name);
    this.validateAndWarning(value);
  };

  render() {
    const {formState, ownProps} = this.injected;
    const {component, formContext, fieldArrayContext, ...props} = this.props;

    const meta = getIn(formState, `meta.${props.name}`, {});
    const input: IPropInput = {
      value: getIn(formState, `values.${props.name}`, ''),
      onChange: this.onChange,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
    };

    const propsDefaultInput = {...ownProps, ...input};
    const propsCustomInput = {
      ...omit(props, 'ownProps'),
      ...ownProps,
      meta,
      input,
    };

    return typeof component === 'string'
      ? createElement(component, propsDefaultInput)
      : createElement(component, propsCustomInput);
  }
}

const mapStateToProps = (state, props) => ({
  formState: state.reduxForm[props.formContext.form],
});

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);

const mergeProps = (stateProps, dispatchProps, ownPropsArg) => {
  const {
    name: fieldName, component, formContext, formSectionContext, fieldArrayContext, warn, validate, ...ownProps
  } = ownPropsArg;
  let name = fieldName;

  if (formSectionContext.name) {
    name = `${formSectionContext.name}.${fieldName}`;
  }

  return {
    name,
    component,
    formContext,
    formSectionContext,
    warn,
    validate,
    ownProps: {...ownProps, name},
    ...stateProps,
    actions: dispatchProps,
  };
};

// @ts-ignore
const FieldConnected = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Field);

const FieldWithContext = (props) => (
  <ReduxFormContext.Consumer>
    {(formContext) => (
      <FormSectionContext.Consumer>
        {(formSectionContext) => (
          <FieldArrayContext.Consumer>
            {(fieldArrayContext) => (
              <FieldConnected
                {...props}
                formContext={formContext}
                fieldArrayContext={fieldArrayContext}
                formSectionContext={formSectionContext}
              />
            )}
          </FieldArrayContext.Consumer>
        )}
      </FormSectionContext.Consumer>
    )}
  </ReduxFormContext.Consumer>
);

export default FieldWithContext;
