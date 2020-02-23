import React, {Component, createElement} from 'react';
import {connect} from 'react-redux';
import omit from 'lodash.omit';
import FieldArrayContext from './field-array-context';
import ReduxFormContext from '../redux-form/redux-form-context';
import {arrayPush, arrayRemove, registerField} from '../store/actions';
import {getIn} from '..';
import FormSectionContext from '../form-section/form-section-context';
import {IPropsFieldArray as IProps} from '../../index';
import {IFormContext} from '../redux-form/types';

interface IInjectedProps extends IProps {
  dispatch(action: any): any;

  formContext: IFormContext;

  fieldArray: Array<any>;
  ownProps: {};
}

interface IState {
  fieldArray: Array<any>;
}

class FieldArray extends Component<IProps, IState> {
  static defaultProps = {
    name: '',
    keyOfId: 'id',
  };

  state = {
    fieldArray: [],
  };

  get injected(): IInjectedProps {
    return this.props as IInjectedProps;
  }

  componentDidMount() {
    const {dispatch, formContext: {form, wizard}, name} = this.injected;
    dispatch(registerField(form, name, [], wizard, true));
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.fieldArray !== nextProps.fieldArray) {
      return {fieldArray: nextProps.fieldArray};
    }
    return null;
  }

  createFields = () => {
    const {
      name,
      keyOfId,
    } = this.props;
    const {
      formContext: {form},
      dispatch,
      fieldArray,
    } = this.injected;

    return {
      length: fieldArray.length,
      map: (callback) => fieldArray.map((el, i) => callback(`${name}[${i}]`, i, fieldArray)),
      push: (value) => dispatch(arrayPush(form, name, value)),
      remove: (id) => dispatch(arrayRemove(form, name, id, keyOfId!)),
    };
  };

  render() {
    const {component, name, ...props} = this.props;
    const {ownProps} = this.injected;
    const fieldArrayContext = {
      fieldArray: name,
    };
    const fields = this.createFields();
    const injectedProps = omit(props, 'ownProps', 'formContext', 'formSectionContext');

    return (
      <FieldArrayContext.Provider value={fieldArrayContext}>
        {createElement<any>(component, {...injectedProps, ...ownProps, fields})}
      </FieldArrayContext.Provider>
    );
  }
}

const mapStateToProps = (state, props) => {
  const {formContext: {form}, name} = props;
  return {
    fieldArray: getIn(state, `reduxForm.${form}.values.${name}`) || [],
  };
};

const mergeProps = (stateProps, {dispatch}: any, ownPropsArg) => {
  const {name, keyOfId, component, formContext, formSectionContext, ...ownProps} = ownPropsArg;

  return {
    ...stateProps,
    dispatch,
    name,
    keyOfId,
    component,
    formContext,
    formSectionContext,
    ownProps,
  };
};

const FieldArrayConnected = connect(mapStateToProps, null, mergeProps)(FieldArray);

const FieldArrayWithContext = (props: Omit<IProps, 'formContext'> | Record<string, unknown>) => (
  <FormSectionContext.Consumer>
    {(formSectionContext) => (
      <ReduxFormContext.Consumer>
        {(formContext) => (
          <FieldArrayConnected {...props} formContext={formContext} formSectionContext={formSectionContext} />
        )}
      </ReduxFormContext.Consumer>
    )}
  </FormSectionContext.Consumer>
);

export default FieldArrayWithContext;
