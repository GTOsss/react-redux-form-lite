import React, {Component, createElement} from 'react';
import {connect} from 'react-redux';
import omit from 'lodash.omit';
import FieldArrayContext from './field-array-context';
import ReduxFormContext from '../redux-form/redux-form-context';
import {arrayPush, registerField} from '../store/actions';
import {getIn} from '../utils/object-manager';
import {IFormContext} from '../redux-form/types';

interface IProps {
  component: React.ComponentType;
  name: string;
  formContext: IFormContext;
}

interface IInjectedProps extends IProps {
  dispatch(action: any): any;

  fieldArray: Array<any>;
  ownProps: {};
}

interface IState {
  fieldArray: Array<any>;
}

class FieldArray extends Component<IProps, IState> {
  static defaultProps = {
    name: '',
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
    } = this.props;
    const {
      formContext: {form},
      dispatch,
      fieldArray,
    } = this.injected;

    return {
      map: (callback) => fieldArray.map((el, i) => callback(`${name}[${i}]`, i, fieldArray)),
      push: (value) => dispatch(arrayPush(form, `${name}`, value)),
      length: fieldArray.length,
    };
  };

  render() {
    const {component, name, ...props} = this.props;
    const {ownProps} = this.injected;
    const meta = {};
    const fieldArrayContext = {
      fieldName: name,
    };
    const fields = this.createFields();
    return (
      <FieldArrayContext.Provider value={fieldArrayContext}>
        {createElement<any>(component, {...omit(props, 'ownProps'), ...ownProps, meta, fields})}
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
  const {name, component, formContext, ...ownProps} = ownPropsArg;

  return {
    ...stateProps,
    dispatch,
    name,
    component,
    formContext,
    ownProps,
  };
};

const FieldArrayConnected = connect(mapStateToProps, null, mergeProps)(FieldArray);

const FieldArrayWithContext = (props: Omit<IProps, 'formContext'> | Record<string, unknown>) => (
  <ReduxFormContext.Consumer>
    {(formContext) => (
      <FieldArrayConnected {...props} formContext={formContext} />
    )}
  </ReduxFormContext.Consumer>
);

export default FieldArrayWithContext;
