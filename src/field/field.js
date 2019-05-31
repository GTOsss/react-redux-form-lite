import React, {Component, createElement, createFactory} from 'react';
import Omit from 'lodash.omit';
import PropTypes from 'prop-types';
import FieldContext from './field-context';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../store/actions';
import {getValue} from '../utils/dom-helper';
import ReduxFormContext from '../redux-form/redux-form-context';
import FieldArrayContext from '../field-array/field-array-context';

class Field extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {
      name,
      actions: {registerField},
      formContext: {form, updateValidateAndWarningMap},
      fieldArrayContext: {fieldName: fieldArrayName},
      validate,
      warn,
    } = this.props;

    updateValidateAndWarningMap(name, validate, warn);
    registerField(form, name);
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
      validate, warn, actions: {
        updateValidateMessage, updateWarningMessage,
      }, formContext: {form}, name
    } = this.props;

    if (validate && (typeof validate === 'function')) {
      updateValidateMessage(form, name, validate(value));
    } else if (validate && Array.isArray(validate)) {
      for (let i = 0; i < validate.length; i += 1) {
        const result = validate[i](value);
        if ((result === 0) || result) {
          updateValidateMessage(form, name, result);
          break;
        }

        if (i === (validate.length - 1)) {
          updateValidateMessage(form, name, undefined);
        }
      }
    }

    if (warn && (typeof warn === 'function')) {
      updateWarningMessage(form, name, warn(value));
    } else if (warn && Array.isArray(warn)) {
      for (let i = 0; i < warn.length; i += 1) {
        const result = warn[i](value);
        if ((result === 0) || result) {
          updateWarningMessage(form, name, result);
          break;
        }

        if (i === (warn.length - 1)) {
          updateWarningMessage(form, name, undefined);
        }
      }
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
    const {component, formContext, fieldArrayContext, ...props} = this.props;
    const meta = {};
    const input = {
      onChange: this.onChange,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
    };

    const propsDefaultInput = Omit({...props, ...input}, 'actions');
    const propsCustomInput = {...props, meta, input};

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
};

Field.defaultProps = {
  actions: {},
  formContext: {},
  fieldArrayContext: {},
  onChange: undefined,
};

const mapStateToProps = (state, props) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({
  actions: {...bindActionCreators(actions, dispatch)},
});

const FieldConnected = connect(mapStateToProps, mapDispatchToProps)(Field);

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
