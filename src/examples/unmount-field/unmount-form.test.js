import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import UnmountForm from './unmount-form';
import ReduxThunkTester from 'redux-thunk-tester';
import {reducer} from '../../index';

const renderComponent = (showLastName = false) => {
  const reduxThunkTester = new ReduxThunkTester();

  const store = createStore(
    combineReducers({reduxForm: reducer}),
    applyMiddleware(reduxThunkTester.createReduxThunkHistoryMiddleware()),
  );

  const component = mount(<Provider store={store}><UnmountForm showLastName={showLastName} /></Provider>);

  return {reduxThunkTester, store, component};
};

describe('<UnmountField />', () => {
  test('Render UnmountField', () => {
    const {component} = renderComponent();
    expect(component).toMatchSnapshot();
  });

  test('Render UnmountField: store', () => {
    const {store} = renderComponent();
    expect(store.getState().reduxForm.example).toMatchSnapshot();
  });
  
  test('UnmountField: mount field (action history)', () => {
    const {component, reduxThunkTester} = renderComponent();
    component.find('input').at(1).simulate('change', {target: {type: 'checkbox', checked: true}});
    expect(reduxThunkTester.getActionHistoryStringify()).toMatchSnapshot();
    console.log(reduxThunkTester.getActionHistoryStringify({withColor: true}));
  });

  test('UnmountField: mount field (store)', () => {
    const {component, store} = renderComponent();
    component.find('input').at(1).simulate('change', {target: {type: 'checkbox', checked: true}});
    expect(store.getState().reduxForm.example).toMatchSnapshot();
  });

  test('UnmountField: render with field and remove then it (action history)', () => {
    const {component, reduxThunkTester} = renderComponent(true);
    component.find('input').at(1).simulate('change', {target: {type: 'checkbox', checked: false}});
    expect(reduxThunkTester.getActionHistoryStringify()).toMatchSnapshot();
  });

  test('UnmountField: render with field and remove then it (store)', () => {
    const {component, store} = renderComponent(true);
    component.find('input').at(1).simulate('change', {target: {type: 'checkbox', checked: false}});
    expect(store.getState().reduxForm.example).toMatchSnapshot();
  });

  test('UnmountField: render with field, add error and remove then it (store)', () => {
    const {component, store} = renderComponent(true);
    component.find('input').at(2).simulate('change', {target: {value: ''}});
    component.find('input').at(1).simulate('change', {target: {type: 'checkbox', checked: false}});
    expect(store.getState().reduxForm.example).toMatchSnapshot();
  });

  test('UnmountField: render with field, add warning and remove then it (store)', () => {
    const {component, store} = renderComponent(true);
    component.find('input').at(2).simulate('change', {target: {value: 't'}});
    console.log(store.getState().reduxForm.example);
    component.find('input').at(1).simulate('change', {target: {type: 'checkbox', checked: false}});
    expect(store.getState().reduxForm.example).toMatchSnapshot();
  });
});
