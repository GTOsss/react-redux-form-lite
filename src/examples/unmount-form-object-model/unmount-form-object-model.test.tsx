import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import ReduxThunkTester from 'redux-thunk-tester';
import UnmountForm from './unmount-form-object-model';
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

describe('<UnmountFormObjectModel />', () => {
  test('Render UnmountForm (inputs)', () => {
    const {component} = renderComponent();
    expect(component.find('input')).toMatchSnapshot();
  });

  test('Render UnmountForm after unmount form', () => {
    const {component} = renderComponent();

    component.find('button').at(1).simulate('click');
    expect(component).toMatchSnapshot();
  });

  test('Render UnmountForm (store)', () => {
    const {store} = renderComponent();

    expect(store.getState().reduxForm.example).toMatchSnapshot();
  });

  test('Unmount form (store)', () => {
    const {component, store} = renderComponent();

    component.find('button').at(1).simulate('click');
    expect(store.getState().reduxForm.example).toMatchSnapshot();
  });

  test('Unmount form and mount form (store)', () => {
    const {component, store} = renderComponent();

    component.find('button').at(1).simulate('click');
    component.find('button').at(0).simulate('click');
    expect(store.getState().reduxForm.example).toMatchSnapshot();
  });
});
