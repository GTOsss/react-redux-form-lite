import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReduxFormContext from './redux-form-context';
import * as actions from '../store/actions';

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
    onSubmit = (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      const { values } = this.props;

      if (this.customSubmit) {
        this.customSubmit(values);
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
      const { actions: { registerForm } } = this.props;
      registerForm(params.form);
    }

    render() {
      const {
        form,
        destroyOnUnmount = true,
      } = params;
      const { actions: formActions } = this.props;
      return (
        <ReduxFormContext.Provider value={params}>
          <WrappedComponent
            {...this.props}
            formProps={{ form, destroyOnUnmount }}
            handleSubmit={this.handleSubmit}
            onSubmit={this.onSubmit}
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

  const mapDispatchToProps = (dispatch) => ({
    actions: { ...bindActionCreators(actions, dispatch) },
  });

  return connect(null, mapDispatchToProps)(ReduxForm);
};

export default reduxForm;
