import React, {Component} from 'react';
import {
  IWrappedComponentProps,
  updateValidateAndWarnMap,
  IFormContext,
} from './types';
import {connect, ReactReduxContext} from 'react-redux';
import {bindActionCreators, Store} from 'redux';
import ReduxFormContext from './redux-form-context';
import * as actions from '../store/actions';
import {
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
const reduxForm = <V extends {}>(paramsArg: IReduxFormParams<V>) => (WrappedComponent: any) => {
  const defaultParams = {
    destroyOnUnmount: true,
  };
  const params = {...defaultParams, ...paramsArg};

  interface IProps {
    store: Store;
  }

  interface IState {
  }

  interface IInjected<Values> extends IProps {
    actions: IReduxFormActions<Values>;
    formState: IReduxFormState<Values>;
    wizardState: IReduxFormWizard<Values> | undefined;
    ownProps: {
      onSubmit(event: any): void;
    };
  }

  class ReduxFormClass<Values> extends Component<IProps, IState> {
    displayName = getDisplayName(WrappedComponent);
    validateMap: IMapValidate;
    warnMap: IMapValidate;
    customSubmit: ((reduxFormEvent: IReduxFormSubmitEvent<Values>) => void) | null;

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

    get injected(): IInjected<Values> {
      return this.props as IInjected<Values>;
    }

    componentWillMount() {
      const {actions: {registerForm}} = this.injected;
      const {wizard} = params;
      registerForm(params.form, wizard);
    }

    componentDidMount(): void {
      const {initialValues, wizard, form} = params;
      const {actions: {setInitialValues}} = this.injected;
      if (initialValues) {
        setInitialValues(form, initialValues, wizard);
      }
    }

    componentWillUnmount() {
      const {actions: {removeForm}} = this.injected;

      if (params.destroyOnUnmount) {
        removeForm(params.form);
      }
    }

    updateValidateAndWarnMap: updateValidateAndWarnMap = (field, validate, warning) => {
      if (validate) {
        this.validateMap[field] = validate;
      }

      if (warning) {
        this.warnMap[field] = warning;
      }
    };

    validateForm = (submitted?: boolean): IFullReduxFormState<any> => {
      const {actions: {updateFormState}} = this.injected;
      const {store} = this.props;
      const {validate, warn, form, wizard} = params;
      const validateMap = {validate: this.validateMap, warn: this.warnMap};
      const submitValidateMap = {validate, warn};
      const state = store.getState().reduxForm;
      const result = validateFormByStateUtil({
        state, form, validateMap, submitValidateMap, submitted, wizard,
      });
      const currentFormState: IReduxFormState<Values> = result[form] as IReduxFormState<Values>;
      const currentWizardState: IReduxFormWizard<Values> | undefined = wizard
        ? result[wizard] as IReduxFormWizard<Values>
        : undefined;

      if (currentFormState) {
        updateFormState(form, currentFormState, wizard, currentWizardState);
      }

      return result;
    };

    onSubmit = (e) => {
      const {form, wizard} = params;

      if (e && e.preventDefault) {
        e.preventDefault();
      }

      const {actions: formActions} = this.injected;
      const validateState = this.validateForm(true);
      const validateFormState: IReduxFormState<Values> = validateState[form] as IReduxFormState<Values>;
      const validateWizardState: IReduxFormWizard<Values> | undefined = wizard
        ? validateState[wizard] as IReduxFormWizard<Values> : undefined;

      if (this.customSubmit && validateState) {
        const values = validateFormState.values || ({} as Values);
        this.customSubmit({values, state: validateFormState, actions: formActions, wizard: validateWizardState});
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

      const formContext: IFormContext = {
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
    wizardState: params.wizard ? state.reduxForm[params.wizard] : undefined,
  });

  const mapDispatchToProps = (dispatch) => ({
    actions: {...bindActionCreators(actions, dispatch)},
  });

  const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ownProps,
    ...stateProps,
    ...dispatchProps,
  });

  const ReduxForm = (props) => (
    <ReactReduxContext.Consumer>
      {(reduxContext) => (
        <ReduxFormClass {...props} store={reduxContext.store} />
      )}
    </ReactReduxContext.Consumer>
  );

  return connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxForm);
};

export default reduxForm;
