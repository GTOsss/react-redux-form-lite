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
});
