import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import SyncValidation from './sync-validation';
import ReduxThunkTester from 'redux-thunk-tester';
import {reducer} from '../../index';

const renderComponent = (onSubmit) => {
  const reduxThunkTester = new ReduxThunkTester();

  const store = createStore(
    combineReducers({reduxForm: reducer}),
    applyMiddleware(reduxThunkTester.createReduxThunkHistoryMiddleware()),
  );

  const component = mount(<Provider store={store}><SyncValidation onSubmit={onSubmit}/></Provider>);

  return {reduxThunkTester, store, component};
};

describe('<SyncValidation />', () => {
  test('render sync validation form', () => {
    const {component} = renderComponent(() => {});
    expect(component).toMatchSnapshot();
  });

  test('validate', () => {
    const {component, store} = renderComponent(() => {});

    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');

    expect(store.getState().reduxForm.example).toMatchSnapshot();
  });

  test('validate: onSubmit after failed submit', () => {
    const onSubmit = jest.fn();
    const {component, store} = renderComponent(onSubmit);

    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    expect(onSubmit.mock.calls.length).toBe(1);
    expect(onSubmit.mock.calls[0][0]).toEqual({firstName: 'test', lastName: undefined});
    expect(onSubmit.mock.calls[0][1].form.hasErrors).toBeTruthy();
    expect(onSubmit.mock.calls[0][1].form.hasWarnings).toBeFalsy();
    expect(onSubmit.mock.calls[0][1].form.errorsMap).toEqual({lastName: 'Field required.'});
    expect(onSubmit.mock.calls[0][1].form.warningsMap).toEqual({});
    expect(store.getState().reduxForm.example).toMatchSnapshot();
  });
  
  test('validate: onSubmit after failed and success', () => {
    const onSubmit = jest.fn();
    const {component, store} = renderComponent(onSubmit);

    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    expect(onSubmit.mock.calls.length).toBe(2);
    expect(onSubmit.mock.calls[1][0]).toEqual({firstName: 'test', lastName: 'test'});
    expect(onSubmit.mock.calls[1][1].form.hasErrors).toBeFalsy();
    expect(onSubmit.mock.calls[1][1].form.hasWarnings).toBeFalsy();
    expect(onSubmit.mock.calls[1][1].form.errorsMap).toEqual({});
    expect(onSubmit.mock.calls[1][1].form.warningsMap).toEqual({});
    expect(store.getState().reduxForm.example).toMatchSnapshot();
  });

  test('warn', () => {
    const {component, store} = renderComponent(() => {});

    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');

    expect(store.getState().reduxForm.example).toMatchSnapshot();
  });

  test('warn: onSubmit after failed submit', () => {
    const onSubmit = jest.fn();
    const {component, store} = renderComponent(onSubmit);

    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    expect(onSubmit.mock.calls.length).toBe(1);
    expect(onSubmit.mock.calls[0][0]).toEqual({firstName: 't', lastName: 'test'});
    expect(onSubmit.mock.calls[0][1].form.hasErrors).toBeFalsy();
    expect(onSubmit.mock.calls[0][1].form.hasWarnings).toBeTruthy();
    expect(onSubmit.mock.calls[0][1].form.warningsMap).toEqual({
      firstName: 'The minimum length of the value must be 2.',
    });
    expect(onSubmit.mock.calls[0][1].form.errorsMap).toEqual({});
    expect(store.getState().reduxForm.example).toMatchSnapshot();
  });

  test('warn: onSubmit after failed and success', () => {
    const onSubmit = jest.fn();
    const {component, store} = renderComponent(onSubmit);

    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    expect(onSubmit.mock.calls.length).toBe(2);
    expect(onSubmit.mock.calls[1][0]).toEqual({firstName: 'test', lastName: 'test'});
    expect(onSubmit.mock.calls[1][1].form.hasErrors).toBeFalsy();
    expect(onSubmit.mock.calls[1][1].form.hasWarnings).toBeFalsy();
    expect(onSubmit.mock.calls[1][1].form.errorsMap).toEqual({});
    expect(onSubmit.mock.calls[1][1].form.warningsMap).toEqual({});
    expect(store.getState().reduxForm.example).toMatchSnapshot();
  });
});
