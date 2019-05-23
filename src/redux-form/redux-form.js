import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import omit from 'lodash.omit';
import ReduxFormContext from './redux-form-context';
import * as actions from '../store/actions';
import {updateErrorsAndWarnings as updateErrorsAndWarningsUtil} from '../store/utils';

const getDisplayName = (WrappedComponent) => WrappedComponent.displayName
  || WrappedComponent.name || 'Component';

/**
 * HOC reduxForm
 * @param {object} params {
 *   form, // name of form
 *   destroyOnUnmount, // will be unmounted in store
 * }
 * @returns {function(component): {}} Component
 */
const reduxForm = (params) => (WrappedComponent) => {
  class ReduxForm extends Component {
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
        actions: {updateErrorAndWarningMessages},
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

      const result = {errors: resultErrors, warnings: resultWarnings};
      updateErrorAndWarningMessages(params.form, result);

      const storeSection = {[params.form]: this.props.form};
      const updatedStoreSection = updateErrorsAndWarningsUtil(storeSection, params.form, result);

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
      const {
        form,
        destroyOnUnmount = true,
      } = params;

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
            formAction={formActions}
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
