import React, {Component, FunctionComponent, ComponentClass, createElement} from 'react';
import omit from 'lodash.omit';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../store/actions';
import {getValue} from '../utils/dom-helper';
import ReduxFormContext from '../redux-form/redux-form-context';
import FieldArrayContext from '../field-array/field-array-context';
import {getIn} from '../utils/object-manager';
import {
  validateFormByValues as validateFormByValuesUtil,
} from '../store/utils';
import {
  IFormContext,
} from '../redux-form/types';

interface IProps {
  name: string;
  component: FunctionComponent | ComponentClass | string;
  formContext: IFormContext;
  fieldArrayContext: object;
  warn: ValidateProps;
  validate: ValidateProps;

  onChange(event: any): void;

  onBlur(event: any): void;

  onFocus(event: any): void;
}

interface IState {
}

interface IInjected {
  actions: IReduxFormActions<any>;
  formState: IReduxFormState<any>;
  ownProps: any;
}

class Field extends Component<IProps, IState> {
  static defaultProps = {
    actions: {},
    formContext: {},
    fieldArrayContext: {},
    onChange: undefined,
    onBlur: undefined,
    onFocus: undefined,
    warn: undefined,
    validate: undefined,
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
      formContext: {form, updateValidateAndWarnMap},
      // fieldArrayContext: {fieldName: fieldArrayName},
      validate,
      warn,
    } = this.props;

    updateValidateAndWarnMap(name, validate, warn);
    registerField(form, name, getIn(values, name));
  }

  componentWillUnmount() {
    const {
      actions: {removeField},
    } = this.injected;
    const {
      name,
      formContext: {form, destroyOnUnmount},
    } = this.props;
    if (destroyOnUnmount) {
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
      },
    } = this.props;

    const submitValidateMap = {validate: validateSubmit, warn: warnSubmit};
    const validateMap = {validate: {}, warn: {}};

    if (validate) {
      validateMap.validate[name] = validate;
    }

    if (warn) {
      validateMap.warn[name] = warn;
    }

    const currentValues = {
      ...values,
      [name]: value,
    };

    const resultMap = validateFormByValuesUtil(currentValues, validateMap, submitValidateMap);

    if (Object.keys(resultMap.errors).length !== 0
      || Object.keys(resultMap.warnings).length !== 0) {
      updateValidateAndWarningMessages(form, resultMap);
    }
  };

  onChange = (e) => {
    const value = getValue(e);
    const {
      actions: {change},
    } = this.injected;
    const {
      formContext: {form},
      name,
      onChange,
    } = this.props;

    if (onChange) {
      onChange(e);
    }

    change(form, name, value);
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
    const input = {
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
    name, component, formContext, fieldArrayContext, warn, validate, ...ownProps
  } = ownPropsArg;

  return {
    name,
    component,
    formContext,
    warn,
    validate,
    ownProps: {...ownProps, name},
    ...stateProps,
    actions: dispatchProps,
  };
};

const FieldConnected = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Field);

const FieldWithContext = (props) => (
  <ReduxFormContext.Consumer>
    {(formContext) => (
      <FieldArrayContext.Consumer>
        {(fieldArrayContext) => (
          <FieldConnected
            {...props}
            formContext={formContext}
            fieldArrayContext={fieldArrayContext}
          />
        )}
      </FieldArrayContext.Consumer>
    )}
  </ReduxFormContext.Consumer>
);

export default FieldWithContext;
