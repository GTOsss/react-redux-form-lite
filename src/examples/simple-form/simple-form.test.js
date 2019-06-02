import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import ReduxThunkTester from 'redux-thunk-tester';
import SimpleForm from './simple-form';
import {reducer} from '../../index';

const renderComponent = (onSubmit) => {
  const reduxThunkTester = new ReduxThunkTester();

  const store = createStore(
    combineReducers({reduxForm: reducer}),
    applyMiddleware(reduxThunkTester.createReduxThunkHistoryMiddleware()),
  );

  const component = mount(
    <Provider store={store}>
      <SimpleForm onSubmit={onSubmit} />
    </Provider>,
  );

  return {reduxThunkTester, store, component};
};

describe('<SimpleForm />', () => {
  test('Render simple form.', () => {
    const {component} = renderComponent();
    expect(component).toMatchSnapshot();
  });

  test('Register form and fields: action history.', () => {
    const {reduxThunkTester: {getActionHistory}} = renderComponent();

    expect(getActionHistory()).toMatchSnapshot();
  });

  test('Register form and fields: store.', () => {
    const {store} = renderComponent();

    expect(store.getState().reduxForm.simple).toMatchSnapshot();
  });

  test('Focus field: actions history.', () => {
    const {
      reduxThunkTester: {getActionHistory, clearActionHistory}, component,
    } = renderComponent();

    clearActionHistory();
    component.find('input').at(0).simulate('focus');

    expect(getActionHistory()).toMatchSnapshot();
  });

  test('Focus field: store', () => {
    const {store, component} = renderComponent();

    component.find('input').at(0).simulate('focus');

    expect(store.getState().reduxForm.simple).toMatchSnapshot();
  });

  test('Change field: actions history.', () => {
    const {
      reduxThunkTester: {clearActionHistory, getActionHistoryStringify}, component,
    } = renderComponent();

    component.find('input').at(0).simulate('focus');
    clearActionHistory();
    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('input').at(0).simulate('change', {target: {value: 'te'}});
    component.find('input').at(0).simulate('change', {target: {value: 'tes'}});
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});

    expect(getActionHistoryStringify()).toMatchSnapshot();
  });

  test('Changed field: store', () => {
    const {component, store} = renderComponent();

    component.find('input').at(0).simulate('focus');
    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('input').at(0).simulate('change', {target: {value: 'te'}});
    component.find('input').at(0).simulate('change', {target: {value: 'tes'}});
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});

    expect(store.getState().reduxForm.simple).toMatchSnapshot();
  });

  test('Blur field: actions history', () => {
    const {
      component, reduxThunkTester: {getActionHistoryStringify, clearActionHistory},
    } = renderComponent();

    component.find('input').at(0).simulate('focus');
    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('input').at(0).simulate('change', {target: {value: 'te'}});
    component.find('input').at(0).simulate('change', {target: {value: 'tes'}});
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    clearActionHistory();
    component.find('input').at(0).simulate('blur');

    expect(getActionHistoryStringify()).toMatchSnapshot();
  });

  test('Blur field: store', () => {
    const {component, store} = renderComponent();

    component.find('input').at(0).simulate('focus');
    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('input').at(0).simulate('change', {target: {value: 'te'}});
    component.find('input').at(0).simulate('change', {target: {value: 'tes'}});
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(0).simulate('blur');

    expect(store.getState().reduxForm.simple).toMatchSnapshot();
  });

  test('onSubmit', () => {
    const onSubmit = jest.fn();
    const {component} = renderComponent(onSubmit);

    component.find('form').simulate('submit');
    expect(onSubmit.mock.calls.length).toBe(1);
    expect(onSubmit.mock.calls).toMatchSnapshot();
  });
});
