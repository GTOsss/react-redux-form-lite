import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import ReduxThunkTester from 'redux-thunk-tester';
import SimpleFormObjectModel from './simple-form-object-model';
import {reducer} from '../../index';

interface IValues {
  firstName?: string;
  lastName?: string;
  email?: string;
  sex?: string;
  favoriteColor?: string;
  employed?: string;
  notes?: string;
}

const renderComponent = (onSubmit?) => {
  const reduxThunkTester = new ReduxThunkTester();

  const store = createStore(
    combineReducers({reduxForm: reducer}),
    applyMiddleware(reduxThunkTester.createReduxThunkHistoryMiddleware()),
  );

  const component = mount(
    <Provider store={store}>
      <SimpleFormObjectModel onSubmit={onSubmit} />
    </Provider>,
  );

  return {
    reduxThunkTester,
    getFormState: () => store.getState().reduxForm.simple as IReduxFormState<IValues>,
    component,
  };
};

describe('<SimpleFormObjectModel />', () => {
  test('Register form and fields: store.', () => {
    const {getFormState} = renderComponent();
    expect(getFormState()).toMatchSnapshot();
  });

  test('Focus field: store', () => {
    const {getFormState, component} = renderComponent();
    component.find('input').at(0).simulate('focus');
    expect(getFormState()).toMatchSnapshot();
  });

  test('Changed field: store', () => {
    const {component, getFormState} = renderComponent();
    component.find('input').at(0).simulate('focus');
    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    expect(getFormState()).toMatchSnapshot();
  });

  test('Blur field: store', () => {
    const {component, getFormState} = renderComponent();
    component.find('input').at(0).simulate('focus');
    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('input').at(0).simulate('blur');
    expect(getFormState()).toMatchSnapshot();
  });

  test('onSubmit', () => {
    const onSubmit = jest.fn();
    const {component} = renderComponent(onSubmit);
    component.find('form').simulate('submit');
    expect(onSubmit.mock.calls.length).toBe(1);
    expect(onSubmit.mock.calls).toMatchSnapshot();
  });

  test('Failed validation: store', () => {
    const {component, getFormState} = renderComponent();
    component.find('input').at(1).simulate('change', {target: {value: 't'}});
    component.find('form').simulate('submit');
    expect(getFormState()).toMatchSnapshot();
  });

  test('Submit success: store', () => {
    const {component, getFormState} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    expect(getFormState()).toMatchSnapshot();
  });
});
