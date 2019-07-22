import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import ReduxThunkTester from 'redux-thunk-tester';
import Field from '../../field';
import WizardSyncValidation from './wizard-sync-validation';
import {reducer} from '../../index';

const renderComponent = (onSubmit?) => {
  const reduxThunkTester = new ReduxThunkTester();

  const store = createStore(
    combineReducers({reduxForm: reducer}),
    applyMiddleware(reduxThunkTester.createReduxThunkHistoryMiddleware()),
  );

  const component = mount(
    <Provider store={store}><WizardSyncValidation onSubmit={onSubmit} /></Provider>,
  );

  return {reduxThunkTester, store, component};
};

describe('<WizardSyncValidation />', () => {
  test('Render WizardSyncValidation', () => {
    const {component} = renderComponent();

    expect(component).toMatchSnapshot();
  });

  test('Render WizardSyncValidation: inputs', () => {
    const {component} = renderComponent();

    expect(component.find('input')).toMatchSnapshot();
  });

  test('Render WizardSyncValidation: store of wizard', () => {
    const {store} = renderComponent();

    // @ts-ignore
    expect(store.getState().wizard).toMatchSnapshot();
  });

  test('submit failed on page 1 (render inputs)', () => {
    const {component} = renderComponent();
    component.find('form').simulate('submit');
    expect(component.find('input')).toMatchSnapshot();
  });

  test('submit failed on page 1 (store)', () => {
    const {component, store} = renderComponent();
    component.find('form').simulate('submit');
    expect(store.getState().reduxForm.step1).toMatchSnapshot();
  });

  test('submit success on page 1 (render inputs)', () => {
    const {component} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    expect(component.find('input')).toMatchSnapshot();
  });

  test('submit success on page 1 (action history)', () => {
    const {component, reduxThunkTester} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    expect(reduxThunkTester.getActionHistoryStringify()).toMatchSnapshot();
  });

  test('submit success on page 1 (store of step1)', () => {
    const {component, store} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    expect(store.getState().reduxForm.step1).toMatchSnapshot();
  });

  test('submit success on page 1 (store of step2)', () => {
    const {component, store} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    expect(store.getState().reduxForm.step2).toMatchSnapshot();
  });

  test('submit success on page 1 (store of wizard)', () => {

  });

  test('submit success on 1, failed on 2 (render inputs)', () => {
    const {component} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('form').simulate('submit');
    expect(component.find('input')).toMatchSnapshot();
  });

  test('submit failed on page 1, 2 (store)', () => {
    const {component, store} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('form').simulate('submit');
    expect(store.getState().reduxForm.example).toMatchSnapshot();
  });

  test('submit success on page 1, 2 (render inputs)', () => {
    const {component} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    expect(component.find('input')).toMatchSnapshot();
  });

  test('submit success on page 1, 2 (store)', () => {
    const {component, store} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    expect(store.getState().reduxForm.example).toMatchSnapshot();
  });

  test('submit success on page 1, 2 and click prevent (render inputs)', () => {
    const {component} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('button').at(0).simulate('click');
    expect(component.find('input')).toMatchSnapshot();
  });

  test('submit success on page 1, failed on 2 and click prevent (render inputs)', () => {
    const {component} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('button').at(0).simulate('click');
    expect(component.find('input')).toMatchSnapshot();
  });

  test('submit success on page 1, failed on 2 and click prevent (store)', () => {
    const {component, store} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('button').at(0).simulate('click');
    expect(store.getState().reduxForm.example).toMatchSnapshot();
  });

  test('submit success on page 1, failed on 2, success on 1 (render inputs)', () => {
    const {component} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('button').at(0).simulate('click');
    component.find('form').simulate('submit');
    expect(component.find('input')).toMatchSnapshot();
  });

  test('submit success on page 1, failed on 2, success on 1 (render Fields)', () => {
    const {component} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('button').at(0).simulate('click');
    component.find('form').simulate('submit');
    expect(component.find(Field)).toMatchSnapshot();
  });

  test('submit success on page 1, 2, 3 (store)', () => {
    const {component, store} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    expect(store.getState().reduxForm.example).toMatchSnapshot();
  });

  test('submit success on page 1, 2, 3 (onSubmit)', () => {
    const onSubmit = jest.fn();
    const {component} = renderComponent(onSubmit);
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    expect(onSubmit.mock.calls).toMatchSnapshot();
  });
});
