import ReduxThunkTester from 'redux-thunk-tester';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {reducer} from '../../index';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import getFieldArray from './field-array';
import React from 'react';

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

describe('<FieldArray />', () => {
  test('Render field-array form (inputs).', () => {
    const {component} = renderComponent();
    expect(component.find('input')).toMatchSnapshot();
  });

  test('Render field-array form (store)', () => {
    const {getFormState} = renderComponent();
    expect(getFormState()).toMatchSnapshot();
  });

  test('Store field-array after push user (store)', () => {
    const {component, getFormState} = renderComponent();
    component.find('#addUser').simulate('click');
    expect(getFormState()).toMatchSnapshot();
  });

  test('Render field-array after push user (inputs)', () => {
    const {component} = renderComponent();
    component.find('#addUser').simulate('click');
    expect(component.find('input')).toMatchSnapshot();
  });

  test('Store field-array after 2 push user (store)', () => {
    const {component, getFormState} = renderComponent();
    component.find('#addUser').simulate('click');
    component.find('#addUser').simulate('click');
    expect(getFormState()).toMatchSnapshot();
  });

  test('Render field-array after 2 push user (inputs)', () => {
    const {component} = renderComponent();
    component.find('#addUser').simulate('click');
    component.find('#addUser').simulate('click');
    expect(component.find('input')).toMatchSnapshot();
  });

  test('Store field-array after 2 push, change fields user (store)', () => {
    const {component, getFormState} = renderComponent();
    component.find('#addUser').simulate('click');
    component.find('#addUser').simulate('click');
    component.find({name: 'users[0].firstName'}).at(0)
      .simulate('change', {target: {value: 'test first name 0'}});
    component.find({name: 'users[0].secondName'}).at(0)
      .simulate('change', {target: {value: 'test second name 0'}});
    component.find({name: 'users[0].about.hobby'}).at(0)
      .simulate('change', {target: {value: 'test about hobby 0'}});
    component.find({name: 'users[1].firstName'}).at(1)
      .simulate('change', {target: {value: 'test first name 1'}});
    component.find({name: 'users[1].secondName'}).at(1)
      .simulate('change', {target: {value: 'test second name 1'}});
    component.find({name: 'users[1].about.hobby'}).at(1)
      .simulate('change', {target: {value: 'test about hobby 1'}});
    expect(getFormState()).toMatchSnapshot();
  });

  test('Store field-array after 2 push, submit fail (store)', () => {
    const {component, getFormState} = renderComponent();
    component.find('#addUser').simulate('click');
    component.find('#addUser').simulate('click');
    component.find('form').simulate('submit');
    expect(getFormState()).toMatchSnapshot();
  });

  test('Store field-array after 2 push, change fields user, submit fail (store)', () => {
    const {component, getFormState} = renderComponent();
    component.find('#addUser').simulate('click');
    component.find('#addUser').simulate('click');
    component.find({name: 'users[0].firstName'}).at(0)
      .simulate('change', {target: {value: 'test first name 0'}});
    component.find({name: 'users[0].about.hobby'}).at(0)
      .simulate('change', {target: {value: 'test about hobby 0'}});
    component.find({name: 'users[1].secondName'}).at(1)
      .simulate('change', {target: {value: 'test second name 1'}});
    component.find({name: 'users[1].about.hobby'}).at(1)
      .simulate('change', {target: {value: 'test about hobby 1'}});
    component.find('form').simulate('submit');
    expect(getFormState()).toMatchSnapshot();
  });

  test('Store field-array after 2 push, change fields user, submit fail users[1] (store)', () => {
    const {component, getFormState} = renderComponent();
    component.find('#addUser').simulate('click');
    component.find('#addUser').simulate('click');
    component.find({name: 'users[0].firstName'}).at(0)
      .simulate('change', {target: {value: 'test first name 0'}});
    component.find({name: 'users[0].secondName'}).at(0)
      .simulate('change', {target: {value: 'test first name 0'}});
    component.find({name: 'users[0].about.hobby'}).at(0)
      .simulate('change', {target: {value: 'test about hobby 0'}});
    component.find({name: 'users[1].secondName'}).at(1)
      .simulate('change', {target: {value: 'test second name 1'}});
    component.find({name: 'users[1].about.hobby'}).at(1)
      .simulate('change', {target: {value: 'test about hobby 1'}});
    component.find('form').simulate('submit');

    component.find({name: 'users[1].firstName'}).at(1)
      .simulate('change', {target: {value: 'test first name 1'}});
    component.find('form').simulate('submit');
    expect(getFormState()).toMatchSnapshot();
  });

  test('Store field-array after 3 push, failed change first name third user (should be length 10)', () => {
    const {component, getFormState} = renderComponent();
    component.find('#addUser').simulate('click');
    component.find('#addUser').simulate('click');
    component.find('#addUser').simulate('click');
    component.find({name: 'users[2].firstName'}).at(0)
      .simulate('change', {target: {value: 'test 2'}});
    expect(getFormState()).toMatchSnapshot();
  });

  test('Store field-array after 3 push, failed change first name third user (should be length 10), submit', () => {
    const {component, getFormState} = renderComponent();
    component.find('#addUser').simulate('click');
    component.find('#addUser').simulate('click');
    component.find('#addUser').simulate('click');
    component.find({name: 'users[2].firstName'}).at(0)
      .simulate('change', {target: {value: 'test 2'}});
    component.find('form').simulate('submit');
    expect(getFormState()).toMatchSnapshot();
  });

  test('Store field-array after 3 push, push 2 friends for first user, submit', () => {
    const {component, getFormState} = renderComponent();
    component.find('#addUser').simulate('click');
    component.find('#addUser').simulate('click');
    component.find('#addFriendToUser').at(0).simulate('click');
    component.find('#addFriendToUser').at(0).simulate('click');
    component.find({name: 'users[0].friends[0].firstName'}).at(0)
      .simulate('change', {target: {value: 'test first name'}});
    component.find({name: 'users[0].friends[0].contacts.phone'}).at(0)
      .simulate('change', {target: {value: 'test friend phone'}});
    component.find('form').simulate('submit');
    expect(getFormState()).toMatchSnapshot();
  });

  test('Store field-array after push user with filled fields', () => {
    const user = {firstName: 'test fist name'};
    const {component, getFormState} = renderComponent((fields) => fields.push(user));
    component.find('#addUser').simulate('click');
    component.find('form').simulate('submit');
    expect(getFormState()).toMatchSnapshot();
  });
});
