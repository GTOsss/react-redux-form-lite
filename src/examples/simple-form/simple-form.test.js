import React from 'react';
import {mount, shallow} from 'enzyme';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import SimpleForm from './simple-form';
import ReduxThunkTester from 'redux-thunk-tester';
import {reducer} from '../../index';
import stringifyObject from 'stringify-object';

const renderComponent = () => {
  const reduxThunkTester = new ReduxThunkTester();

  const store = createStore(
    combineReducers({reduxForm: reducer}),
    applyMiddleware(reduxThunkTester.createReduxThunkHistoryMiddleware()),
  );

  const component = mount(<Provider store={store}><SimpleForm /></Provider>);

  return {reduxThunkTester, store, component};
};

describe('<SimpleForm />', () => {
  test('Render simple form.', () => {
    const {component} = renderComponent();
    expect(component).toMatchSnapshot();
  });

  test('Register form and fields: action history.', () => {
    const {reduxThunkTester: {getActionHistory, getActionHistoryStringify}} = renderComponent();

    console.log(getActionHistoryStringify({withColor: true}));
    expect(getActionHistory()).toMatchSnapshot();
  });

  test('Register form and fields: store.', () => {
    const {store} = renderComponent();

    expect(store.getState().reduxForm.simple).toMatchSnapshot();
    console.log(stringifyObject(store.getState().reduxForm.simple));
  });

  test('Focus field: actions history.', () => {
    const {
      reduxThunkTester: {getActionHistoryStringify, getActionHistory,clearActionHistory}, component
    } = renderComponent();

    clearActionHistory();
    component.find('input').at(0).simulate('focus');

    expect(getActionHistory()).toMatchSnapshot();
    console.log(getActionHistoryStringify({withColor: true}));
  });

  test('Focus field: store', () => {
    const {store} = renderComponent();

    expect(store.getState().reduxForm.simple).toMatchSnapshot();
    console.log(stringifyObject(store.getState().reduxForm.simple));
  });

  test('Change field: actions history.', () => {
    const {reduxThunkTester: {clearActionHistory, getActionHistoryStringify}, component} = renderComponent();

    component.find('input').at(0).simulate('focus');
    clearActionHistory();
    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('input').at(0).simulate('change', {target: {value: 'te'}});
    component.find('input').at(0).simulate('change', {target: {value: 'tes'}});
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});

    expect(getActionHistoryStringify()).toMatchSnapshot();
    console.log(getActionHistoryStringify({withColor: true}));
  });

  test('Changed field: store', () => {
    const {component, store} = renderComponent();

    component.find('input').at(0).simulate('focus');
    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('input').at(0).simulate('change', {target: {value: 'te'}});
    component.find('input').at(0).simulate('change', {target: {value: 'tes'}});
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});

    expect(store.getState().reduxForm.simple).toMatchSnapshot();
    console.log(stringifyObject(store.getState().reduxForm.simple));
  });

  test('Blur field: actions history', () => {
    const {component, reduxThunkTester: {getActionHistoryStringify, clearActionHistory}} = renderComponent();

    component.find('input').at(0).simulate('focus');
    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('input').at(0).simulate('change', {target: {value: 'te'}});
    component.find('input').at(0).simulate('change', {target: {value: 'tes'}});
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    clearActionHistory();
    component.find('input').at(0).simulate('blur');

    expect(getActionHistoryStringify()).toMatchSnapshot();
    console.log(getActionHistoryStringify({withColor: true}));
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
    console.log(stringifyObject(store.getState().reduxForm.simple));
  });
});
