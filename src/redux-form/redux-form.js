import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ReduxFormContext from './redux-form-context';
import * as actions from '../store/actions';
import {updateErrorsAndWarnings as updateErrorsAndWarningsUtil} from '../store/utils';

const getDisplayName = (WrappedComponent) => WrappedComponent.displayName
  || WrappedComponent.name || 'Component';

/**
 * HOC reduxForm
 * @param {object} paramsArg Redux form params
 * @param {string} paramsArg.form  Name of form
 * @param {boolean?} paramsArg.destroyOnUnmount Will be remove in store when call componentWillUnmount
 * @param {function(values): {}} paramsArg.validate Method for validate form, should return errorsMap
 * @param {function(values): {}} paramsArg.warn Method for check warnings form, should return warningsMap
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
      this.warningMap = {};
    }

    updateValidateAndWarningMap = (field, validate, warning) => {
      if (validate) {
        this.validateMap = {...this.validateMap, [field]: validate};
      }

      if (warning) {
        this.warningMap = {...this.warningMap, [field]: warning};
      }
    };

    onSubmit = (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      const {
        actions: {updateFormState},
        form: {meta, values},
      } = this.props;

      let resultErrors = {};
      let resultWarnings = {};

      Object.entries(values).forEach(([key, value]) => {
        const validate = this.validateMap[key];
        const warn = this.warningMap[key];

        if (validate && (typeof validate === 'function')) {
          resultErrors = {...resultErrors, [key]: this.validateMap[key](value)};
        } else if (validate && Array.isArray(validate)) {
          for (let i = 0; i < validate.length; i += 1) {
            const result = validate[i](value);
            if ((result === 0) || result) {
              resultErrors = {...resultErrors, [key]: result};
              break;
            }

            if (i === (validate.length - 1)) {
              resultErrors = {...resultErrors, [key]: undefined};
            }
          }
        }

        if (warn && (typeof warn === 'function')) {
          resultWarnings = {...resultWarnings, [key]: this.warningMap[key](value)};
        } else if (warn && Array.isArray(warn)) {
          for (let i = 0; i < warn.length; i += 1) {
            const result = warn[i](value);
            if ((result === 0) || result) {
              resultWarnings = {...resultWarnings, [key]: result};
              break;
            }

            if (i === (warn.length - 1)) {
              resultWarnings = {...resultWarnings, [key]: undefined};
            }
          }
        }
      });

      if (typeof params.validate === 'function') {
        resultErrors = {...resultErrors, ...params.validate(values)}
      }

      if (typeof params.warn === 'function') {
        resultWarnings = {...resultWarnings, ...params.warn(values)}
      }

      const result = {errors: resultErrors, warnings: resultWarnings};

      const storeSection = {[params.form]: this.props.form};
      const updatedStoreSection = updateErrorsAndWarningsUtil(storeSection, params.form, result, true);
      updateFormState(params.form, updatedStoreSection[params.form]);

      if (this.customSubmit) {
        this.customSubmit(values, updatedStoreSection[params.form], this.props.actions);
      }
    };

    handleSubmit = (e) => {
      if (typeof e === 'function') {
        this.customSubmit = e;
      } else if (e && e.preventDefault) {
        this.onSubmit(e);
      }

      return this.onSubmit;
    };

    componentWillMount() {
      const {actions: {registerForm}} = this.props;
      registerForm(params.form);
    }

    render() {
      const {form, destroyOnUnmount} = params;
      const {actions: formActions, ownProps} = this.props;

      const formContext = {
        ...params,
        updateValidateAndWarningMap: this.updateValidateAndWarningMap,
      };

      return (
        <ReduxFormContext.Provider value={formContext}>
          <WrappedComponent
            {...ownProps}
            formParams={{form, destroyOnUnmount}}
            form={this.props.form}
            handleSubmit={this.handleSubmit}
            formActions={formActions}
          />
        </ReduxFormContext.Provider>
      );
    }
  }

  ReduxForm.propTypes = {
    actions: PropTypes.objectOf(PropTypes.func),
  };

  ReduxForm.defaultProps = {
    actions: {},
  };

  const mapStateToProps = (state) => ({
    form: state.reduxForm[params.form],
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
