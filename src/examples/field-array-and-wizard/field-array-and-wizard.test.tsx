import ReduxThunkTester from 'redux-thunk-tester';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {reducer} from '../../index';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import getFieldArrayAndWizard from './field-array-and-wizard';
import React from 'react';

const renderComponent = (onSubmit?) => {
  const reduxThunkTester = new ReduxThunkTester();
  const FieldArrayAndWizard = getFieldArrayAndWizard();

  const store = createStore(
    combineReducers({reduxForm: reducer}),
    applyMiddleware(reduxThunkTester.createReduxThunkHistoryMiddleware()),
  );

  const component = mount(
    <Provider store={store}><FieldArrayAndWizard onSubmit={onSubmit} /></Provider>,
  );

  return {
    reduxThunkTester,
    getStep1: (): IReduxFormState<{}> => store.getState().reduxForm.step1 as IReduxFormState<{}>,
    getStep2: (): IReduxFormState<{}> => store.getState().reduxForm.step2 as IReduxFormState<{}>,
    getWizardExample: (): IReduxFormWizard<{}> =>
      store.getState().reduxForm.fieldArrayWizard as IReduxFormWizard<{}>,
    component,
  };
};

describe('<FieldArrayAndWizard />', () => {
  test('Render field-array form (inputs).', () => {
    const {component} = renderComponent();
    expect(component.find('input')).toMatchSnapshot();
  });

  test('Render field-array form (store Step1)', () => {
    const {getStep1} = renderComponent();
    expect(getStep1()).toMatchSnapshot();
  });

  test('Store field-array submit Step1 (store)', () => {
    const {component, getStep1} = renderComponent();
    component.find({name: 'step1Input'}).at(0)
      .simulate('change', {target: {value: 'test first name 0'}});
    component.find('form').simulate('submit');
    expect(getStep1()).toMatchSnapshot();
  });

  test('Store field-array submit Step1 (inputs)', () => {
    const {component} = renderComponent();
    component.find({name: 'step1Input'}).at(0)
      .simulate('change', {target: {value: 'test first name 0'}});
    component.find('form').simulate('submit');
    expect(component.find('input')).toMatchSnapshot();
  });

  test('Render field-array after push user (store Step2)', () => {
    const {component, getStep2} = renderComponent();
    component.find({name: 'step1Input'}).at(0)
      .simulate('change', {target: {value: 'test first name 0'}});
    component.find('form').simulate('submit');
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
    component.find('form').simulate('submit');
    expect(getStep2()).toMatchSnapshot();
  });

  test('Render field-array after push user (store wizard)', () => {
    const {component, getWizardExample} = renderComponent();
    component.find({name: 'step1Input'}).at(0)
      .simulate('change', {target: {value: 'test first name 0'}});
    component.find('form').simulate('submit');
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
    component.find('form').simulate('submit');
    expect(getWizardExample()).toMatchSnapshot();
  });
});
