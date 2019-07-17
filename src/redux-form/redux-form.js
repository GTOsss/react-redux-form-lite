import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ReduxFormContext from './redux-form-context';
import * as actions from '../store/actions';
import {
  updateErrorsAndWarnings as updateErrorsAndWarningsUtil,
  validateFormByState as validateFormByStateUtil,
} from '../store/utils';

const getDisplayName = (WrappedComponent) => WrappedComponent.displayName
  || WrappedComponent.name || 'Component';

/**
 * HOC reduxForm
 * @param {object} paramsArg Redux form params
 * @param {string} paramsArg.form  Name of form
 * @param {boolean?} paramsArg.destroyOnUnmount Will be remove in store when call
 * componentWillUnmount
 * @param {function(values): {}?} paramsArg.validate Method for validate form, should
 * return errorsMap
 * @param {function(values): {}?} paramsArg.warn Method for check warnings form, should
 * return warningsMap
 * @returns {function(component): {}} Component
 */
const reduxForm = (paramsArg) => (WrappedComponent) => {
  const defaultParams = {
    destroyOnUnmount: true,
  };
  const params = {...defaultParams, ...paramsArg};

  class ReduxForm extends Component {
    displayName = getDisplayName(WrappedComponent);

    constructor(props) {
      super(props);

      this.validateMap = {};
      this.warnMap = {};
      this.customSubmit = null;
    }

    componentWillMount() {
      const {actions: {registerForm}} = this.props;
      registerForm(params.form);
    }

    componentWillUnmount() {
      const {actions: {removeForm}} = this.props;

      if (params.destroyOnUnmount) {
        removeForm(params.form);
      }
    }

    updateValidateAndWarnMap = (field, validate, warning) => {
      if (validate) {
        this.validateMap[field] = validate;
      }

      if (warning) {
        this.warnMap[field] = warning;
      }
    };

    validateForm = (submitted) => {
      const {formState, actions: {updateFormState}} = this.props;
      const {validate, warn, form} = params;
      const validateMap = {validate: this.validateMap, warn: this.warnMap};
      const submitValidateMap = {validate, warn};
      const state = {[form]: formState};
      const result = validateFormByStateUtil({
        state, form, validateMap, submitValidateMap, submitted,
      });
      updateFormState(form, result[form]);
      return result[form];
    };

    onSubmit = (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      const {actions: formActions} = this.props;
      const resultValidate = this.validateForm(true);

      if (this.customSubmit) {
        this.customSubmit(resultValidate.values, resultValidate, formActions);
      }
    };

    handleSubmit = (e) => {
      if (typeof e === 'function') {
        this.customSubmit = e;
        return this.onSubmit;
      }

      if (e && e.preventDefault) {
        this.onSubmit(e);
      }

      return undefined;
    };

    render() {
      const {form, destroyOnUnmount} = params;
      const {
        actions: formActions, formState,
        ownProps: {onSubmit, ...ownProps},
      } = this.props;

      const formContext = {
        ...params,
        updateValidateAndWarnMap: this.updateValidateAndWarnMap,
      };

      if (typeof onSubmit === 'function') {
        this.handleSubmit(onSubmit);
      }

      return (
        <ReduxFormContext.Provider value={formContext}>
          <WrappedComponent
            {...ownProps}
            formParams={{form, destroyOnUnmount}}
            formActions={formActions}
            formState={formState}
            handleSubmit={this.handleSubmit}
          />
        </ReduxFormContext.Provider>
      );
    }
  }

  ReduxForm.propTypes = {
    actions: PropTypes.objectOf(PropTypes.func),
    ownProps: PropTypes.objectOf(PropTypes.any),
    formState: PropTypes.shape({
      form: PropTypes.object,
      meta: PropTypes.object,
      values: PropTypes.object,
    }),
  };

  ReduxForm.defaultProps = {
    actions: {},
    ownProps: {},
    formState: {
      form: {},
      meta: {},
      values: {},
    },
  };

  const mapStateToProps = (state) => ({
    formState: state.reduxForm[params.form],
  });

  const mapDispatchToProps = (dispatch) => ({
    actions: {...bindActionCreators(actions, dispatch)},
  });

  const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ownProps,
    ...stateProps,
    ...dispatchProps,
  });

  return connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxForm);
};

export default reduxForm;
