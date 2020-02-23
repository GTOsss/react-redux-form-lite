import ReduxThunkTester from 'redux-thunk-tester';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {reducer} from '../../index';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import getFieldArray from './field-array';
import * as React from 'react';

const renderComponent = (pushUser?) => {
  const reduxThunkTester = new ReduxThunkTester();
  const FieldArray = getFieldArray();

  const store = createStore(
    combineReducers({reduxForm: reducer}),
    applyMiddleware(reduxThunkTester.createReduxThunkHistoryMiddleware()),
  );

  const component = mount(
    <Provider store={store}>
      <FieldArray pushUser={pushUser} />
    </Provider>,
  );

  return {
    reduxThunkTester,
    getFormState: () => store.getState().reduxForm.fieldArrayExample as IReduxFormState<any>,
    component,
  };
};

describe('<FieldArrayOnlyArray />', () => {
  test('Store field-array after 1 push', () => {
    const {component, getFormState} = renderComponent();
    component.find('#addUser').simulate('click');
    expect(getFormState()).toMatchSnapshot();
  });

  test('Store field-array after 1 push, remove 1', () => {
    const {component, getFormState} = renderComponent();
    component.find('#addUser').simulate('click');
    component.find('#removeUser').at(0).simulate('click');
    expect(getFormState()).toMatchSnapshot();
  });

  test('Store field-array after 3 push, remove 2 (remove middle)', () => {
    const {component, getFormState} = renderComponent();
    component.find('#addUser').simulate('click');
    component.find('input').at(0).simulate('change', {target: {value: '1'}});
    component.find('input').at(1).simulate('change', {target: {value: '1'}});
    component.find('input').at(2).simulate('change', {target: {value: '1'}});
    component.find('#addUser').simulate('click');
    component.find('input').at(3).simulate('change', {target: {value: '2'}});
    component.find('input').at(4).simulate('change', {target: {value: '2'}});
    component.find('input').at(5).simulate('change', {target: {value: '2'}});
    component.find('#addUser').simulate('click');
    component.find('input').at(6).simulate('change', {target: {value: '3'}});
    component.find('input').at(7).simulate('change', {target: {value: '3'}});
    component.find('input').at(8).simulate('change', {target: {value: '3'}});
    component.find('#removeUser').at(1).simulate('click');
    expect(getFormState()).toMatchSnapshot();
  });

  test('Store field-array after 4 push, remove 2 (remove middle), submit', () => {
    const {component, getFormState} = renderComponent();
    component.find('#addUser').simulate('click');
    component.find('input').at(0).simulate('change', {target: {value: '1'}});
    component.find('input').at(1).simulate('change', {target: {value: '1'}});
    component.find('input').at(2).simulate('change', {target: {value: '1'}});
    component.find('#addUser').simulate('click');
    component.find('input').at(3).simulate('change', {target: {value: '2'}});
    component.find('input').at(4).simulate('change', {target: {value: '2'}});
    component.find('input').at(5).simulate('change', {target: {value: '2'}});
    component.find('#addUser').simulate('click');
    component.find('input').at(6).simulate('change', {target: {value: '3'}});
    component.find('input').at(7).simulate('change', {target: {value: '3'}});
    component.find('input').at(8).simulate('change', {target: {value: '3'}});
    component.find('#addUser').simulate('click');
    component.find('input').at(9).simulate('change', {target: {value: '4'}});
    component.find('input').at(10).simulate('change', {target: {value: '4'}});
    component.find('input').at(11).simulate('change', {target: {value: '4'}});
    component.find('#removeUser').at(2).simulate('click');
    component.find('form').simulate('submit');
    expect(getFormState()).toMatchSnapshot();
  });
});
