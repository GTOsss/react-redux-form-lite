import React, {Component} from 'react';
import {
  IWrappedComponentProps,
  IReduxFormParams,
} from './types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ReduxFormContext from './redux-form-context';
import * as actions from '../store/actions';
import {
  // updateErrorsAndWarnings as updateErrorsAndWarningsUtil,
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
 * @returns {function(Component<IWrappedComponentProps<any>>): React.ReactElement} Component
 */
const reduxForm = (paramsArg: IReduxFormParams) => (WrappedComponent: any) => {
  const defaultParams = {
    destroyOnUnmount: true,
  };
  const params = {...defaultParams, ...paramsArg};

  interface IProps {

  }

  interface IState {

  }

  interface IInjected {
    actions: IReduxFormActions<any>;
    formState: IReduxFormState<any>;
    ownProps: {
      onSubmit(event: any): void;
    };
  }

  class ReduxForm extends Component<IProps, IState> {
    displayName = getDisplayName(WrappedComponent);
    validateMap: IMapValidate;
    warnMap: IMapValidate;
    customSubmit: ((values: any, state: IReduxFormState<any>, actions: IReduxFormActions<any>) => void) | null;

    static defaultProps = {
      actions: {},
      ownProps: {},
      formState: {
        form: {},
        meta: {},
        values: {},
      },
    };

    constructor(props) {
      super(props);

      this.validateMap = {};
      this.warnMap = {};
      this.customSubmit = null;
    }

    get injected(): IInjected {
      return this.props as IInjected;
    }

    componentWillMount() {
      const {actions: {registerForm}} = this.injected;
      registerForm(params.form);
    }

    componentWillUnmount() {
      const {actions: {removeForm}} = this.injected;

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

    validateForm = (submitted?: boolean): IReduxFormState<any> | undefined => {
      const {formState, actions: {updateFormState}} = this.injected;
      const {validate, warn, form} = params;
      const validateMap = {validate: this.validateMap, warn: this.warnMap};
      const submitValidateMap = {validate, warn};
      const state = {[form]: formState};
      const result = validateFormByStateUtil({
        state, form, validateMap, submitValidateMap, submitted,
      });
      const currentFormState = result[form];
      if (currentFormState) {
        updateFormState(form, currentFormState);
      }
      return result[form];
    };

    onSubmit = (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      const {actions: formActions} = this.injected;
      const validateState = this.validateForm(true);

      if (this.customSubmit && validateState) {
        const values = validateState.values || null;
        this.customSubmit(values, validateState, formActions);
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
        actions: formActions,
        formState,
        ownProps: {onSubmit, ...ownProps},
      } = this.injected;

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
