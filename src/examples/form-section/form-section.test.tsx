import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import ReduxThunkTester from 'redux-thunk-tester';
import getFormSection from './form-section';
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
  const FormSection = getFormSection();

  const store = createStore(
    combineReducers({reduxForm: reducer}),
    applyMiddleware(reduxThunkTester.createReduxThunkHistoryMiddleware()),
  );

  const component = mount(
    <Provider store={store}>
      <FormSection onSubmit={onSubmit} />
    </Provider>,
  );

  return {
    reduxThunkTester,
    getFormState: () => store.getState().reduxForm.simple as IReduxFormState<IValues>,
    component,
  };
};

describe('<FormSection />', () => {
  test('Render simple form (inputs).', () => {
    const {component} = renderComponent();
    expect(component.find('input')).toMatchSnapshot();
  });

  test('Render simple form after push user (inputs).', () => {
    const {component} = renderComponent();
    component.find('#addUser').simulate('click');
    expect(component.find('input')).toMatchSnapshot();
  });

  test('Register form and fields: store.', () => {
    const {getFormState} = renderComponent();
    expect(getFormState()).toMatchSnapshot();
  });

  test('Render simple form after push user (store).', () => {
    const {component, getFormState} = renderComponent();
    component.find('#addUser').simulate('click');
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
    component.find('input').at(0).simulate('change', {target: {value: 'te'}});
    component.find('input').at(0).simulate('change', {target: {value: 'tes'}});
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});

    expect(getFormState()).toMatchSnapshot();
  });

  test('Blur field: store', () => {
    const {component, getFormState} = renderComponent();

    component.find('input').at(0).simulate('focus');
    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('input').at(0).simulate('change', {target: {value: 'te'}});
    component.find('input').at(0).simulate('change', {target: {value: 'tes'}});
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
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
});
