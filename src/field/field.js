import React, {Component, createElement} from 'react';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
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

class Field extends Component {
  componentDidMount() {
    const {
      name,
      actions: {registerField},
      formContext: {form, updateValidateAndWarnMap},
      fieldArrayContext: {fieldName: fieldArrayName},
      validate,
      warn,
      ownProps,
      formState: {values},
    } = this.props;

    updateValidateAndWarnMap(name, validate, warn);
    registerField(form, name, getIn(values, name));
  }

  componentWillUnmount() {
    const {
      name,
      actions: {removeField},
      formContext: {form, destroyOnUnmount},
    } = this.props;
    if (destroyOnUnmount) {
      removeField(form, name);
    }
  }

  validateAndWarning = (value) => {
    const {
      validate, warn, name, actions: {updateValidateAndWarningMessages},
      formContext: {
        form,
        validate: validateSubmit,
        warn: warnSubmit,
      },
      formState: {values},
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
    const {onChange} = this.props;
    const value = getValue(e);
    if (onChange) {
      onChange(e);
    }

    const {actions: {change}, formContext: {form}, name} = this.props;
    change(form, name, value);
    this.validateAndWarning(value);
  };

  onFocus = (e) => {
    const {actions: {focus}, formContext: {form}, name, onFocus} = this.props;
    if (onFocus) {
      onFocus(e);
    }
    focus(form, name);
  };

  onBlur = (e) => {
    const {actions: {blur}, formContext: {form}, name, onBlur} = this.props;
    const value = getValue(e);
    if (onBlur) {
      onBlur(e);
    }
    blur(form, name);
    this.validateAndWarning(value);
  };

  render() {
    const {component, formContext, fieldArrayContext, formState, ...props} = this.props;
    const meta = getIn(formState, `meta.${props.name}`, {});
    const input = {
      value: getIn(formState, `values.${props.name}`, ''),
      onChange: this.onChange,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
    };

    const propsDefaultInput = {...props.ownProps, ...input};
    const propsCustomInput = {
      ...omit(props, 'ownProps'),
      ...props.ownProps,
      meta,
      input,
    };

    return typeof component === 'string'
      ? createElement(component, propsDefaultInput)
      : createElement(component, propsCustomInput);
  }
}

Field.propTypes = {
  actions: PropTypes.objectOf(PropTypes.func),
  name: PropTypes.string.isRequired,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.element, PropTypes.string]).isRequired,
  formContext: PropTypes.objectOf(PropTypes.any),
  fieldArrayContext: PropTypes.objectOf(PropTypes.any),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  warn: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
  validate: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
  formState: PropTypes.shape({
    form: PropTypes.object,
    meta: PropTypes.object,
    values: PropTypes.object,
  }),
  ownProps: PropTypes.objectOf(PropTypes.any),
};

Field.defaultProps = {
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
