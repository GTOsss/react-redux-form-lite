import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import ReduxThunkTester from 'redux-thunk-tester';
import UnmountForm from './unmount-form';
import {reducer} from '../../index';

const renderComponent = () => {
  const reduxThunkTester = new ReduxThunkTester();

  const store = createStore(
    combineReducers({reduxForm: reducer}),
    applyMiddleware(reduxThunkTester.createReduxThunkHistoryMiddleware()),
  );

  const component = mount(
    <Provider store={store}><UnmountForm /></Provider>,
  );

  return {reduxThunkTester, store, component};
};

describe('<UnmountField />', () => {
  test('Render UnmountField (inputs)', () => {
    const {component} = renderComponent();
    expect(component.find('input')).toMatchSnapshot();
  });

  test('Render UnmountField: inputs', () => {
    const {component} = renderComponent();
    expect(component.find('input')).toMatchSnapshot();
  });

  test('Render UnmountField: store', () => {
    const {store} = renderComponent();
    expect(store.getState().reduxForm.example).toMatchSnapshot();
  });

  test('Render UnmountField: inputs after change', () => {
    const {component} = renderComponent();
    component.find('input').at(1).simulate('change', {target: {type: 'checkbox', checked: true}});
    expect(component.find('input')).toMatchSnapshot();
  });

  test('UnmountField: mount field (action history)', () => {
    const {component, reduxThunkTester} = renderComponent();
    component.find('input').at(1).simulate('change', {target: {type: 'checkbox', checked: true}});
    expect(reduxThunkTester.getActionHistoryStringify()).toMatchSnapshot();
  });

  test('UnmountField: mount field (store)', () => {
    const {component, store} = renderComponent();
    component.find('input').at(1).simulate('change', {target: {type: 'checkbox', checked: true}});
    expect(store.getState().reduxForm.example).toMatchSnapshot();
  });

  test('UnmountField: render with field and then remove it (action history)', () => {
    const {component, reduxThunkTester} = renderComponent();
    component.find('input').at(1).simulate('change', {target: {type: 'checkbox', checked: true}});
    component.find('input').at(1).simulate('change', {target: {type: 'checkbox', checked: false}});
    expect(reduxThunkTester.getActionHistoryStringify()).toMatchSnapshot();
  });

  test('UnmountField: render with field and then remove it (store)', () => {
    const {component, store} = renderComponent();
    component.find('input').at(1).simulate('change', {target: {type: 'checkbox', checked: true}});
    component.find('input').at(1).simulate('change', {target: {type: 'checkbox', checked: false}});
    expect(store.getState().reduxForm.example).toMatchSnapshot();
  });

  test('UnmountField: mount field, add error and then remove it (store)', () => {
    const {component, store} = renderComponent();
    component.find('input').at(1).simulate('change', {target: {type: 'checkbox', checked: true}});
    component.find('input').at(2).simulate('change', {target: {value: ''}});
    component.find('input').at(1).simulate('change', {target: {type: 'checkbox', checked: false}});
    expect(store.getState().reduxForm.example).toMatchSnapshot();
  });

  test('UnmountField: mount field, add warning and then remove it (store)', () => {
    const {component, store} = renderComponent();
    component.find('input').at(1).simulate('change', {target: {type: 'checkbox', checked: true}});
    component.find('input').at(2).simulate('change', {target: {value: 't'}});
    component.find('input').at(1).simulate('change', {target: {type: 'checkbox', checked: false}});
    expect(store.getState().reduxForm.example).toMatchSnapshot();
  });
});
