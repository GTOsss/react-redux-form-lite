import React from 'react';
import {mount, shallow} from 'enzyme';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import SyncValidation from './sync-validation';
import ReduxThunkTester from 'redux-thunk-tester';
import {reducer} from '../../index';
import stringifyObject from 'stringify-object';

const renderComponent = () => {
  const reduxThunkTester = new ReduxThunkTester();

  const store = createStore(
    combineReducers({reduxForm: reducer}),
    applyMiddleware(reduxThunkTester.createReduxThunkHistoryMiddleware()),
  );

  const component = mount(<Provider store={store}><SyncValidation /></Provider>);

  return {reduxThunkTester, store, component};
};

describe('<SyncValidation />', () => {
  test('onSubmit with updateValidateMessage(): add error', () => {
    let onSubmit = (values, form, actions) => {
      actions.updateValidateMessage('example', 'firstName', 'firstName error');
    };


  });
});
