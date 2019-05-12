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
      formContext: {form},
      fieldArrayContext: {fieldName: fieldArrayName},
    } = this.props;

    registerField(form, name);
  }

  validateAndWarning = (value) => {
    const {
      validate, warning, actions: {
        setValidateMessage, setWarningMessage,
      }
    } = this.props;

    if (validate && (typeof validate === 'function')) {
      setValidateMessage(validate(value));
    } else if (validate && Array.isArray(validate)) {
      for (let i = 0; i < validate.length; i += 1) {
        const result = validate(value);
        if ((result === 0) && result) {
          setValidateMessage(result);
          break;
        }
      }
    }

    if (warning && (typeof warning === 'function')) {
      setWarningMessage(warning(value));
    } else if (warning && Array.isArray(warning)) {
      for (let i = 0; i < warning.length; i += 1) {
        const result = warning(value);
        if ((result === 0) && result) {
          setWarningMessage(result);
          break;
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

    this.validateAndWarning(value);

    const {actions: {change}, formContext: {form}, name} = this.props;
    change(form, name, value);
  };

  onFocus = () => {
    const {actions: {focus}, formContext: {form}, name} = this.props;
    focus(form, name);
  };

  onBlur = () => {
    const {actions: {blur}, formContext: {form}, name} = this.props;
    blur(form, name);
  };

  render() {
    const {component, formContext, fieldArrayContext, ...props} = this.props;
    const meta = {};
    const input = {
      onChange: this.onChange,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
    };

    const propsDefaultInput = Omit({ ...props, ...input }, 'actions');
    const propsCustomInput = { ...props, meta, input };

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

const mapStateToProps = (state) => ({});

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
