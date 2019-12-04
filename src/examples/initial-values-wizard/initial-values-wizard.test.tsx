import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import ReduxThunkTester from 'redux-thunk-tester';
import Field from '../../field';
import InitialValuesWizard from './initial-values-wizard';
import {reducer} from '../../index';

interface IValuesForm1 {
  firstName?: string;
  lastName?: string;
}

interface IValuesForm2 {
  phone?: string;
  email?: string;
}

interface IValuesForm3 {
  dob?: string;
  hobby?: string;
}

const renderComponent = (onSubmit?) => {
  const reduxThunkTester = new ReduxThunkTester();

  const store = createStore(
    combineReducers({reduxForm: reducer}),
    applyMiddleware(reduxThunkTester.createReduxThunkHistoryMiddleware()),
  );

  const component = mount(
    <Provider store={store}><InitialValuesWizard onSubmit={onSubmit} /></Provider>,
  );

  return {
    reduxThunkTester,
    getStep1: (): IReduxFormState<IValuesForm1> => store.getState().reduxForm.step1 as IReduxFormState<IValuesForm1>,
    getStep2: (): IReduxFormState<IValuesForm2> => store.getState().reduxForm.step2 as IReduxFormState<IValuesForm2>,
    getStep3: (): IReduxFormState<IValuesForm3> => store.getState().reduxForm.step3 as IReduxFormState<IValuesForm3>,
    getWizardExample: (): IReduxFormWizard<IValuesForm1 & IValuesForm2 & IValuesForm3> =>
      store.getState().reduxForm.wizardExample as IReduxFormWizard<IValuesForm1 & IValuesForm2 & IValuesForm3>,
    component,
  };
};

describe('<InitialValuesWizard />', () => {
  test('Render inputs form 1', () => {
    const {component} = renderComponent();
    expect(component.find('input')).toMatchSnapshot();
  });

  test('Render InitialValuesWizard: store of wizard', () => {
    const {getWizardExample} = renderComponent();
    expect(getWizardExample()).toMatchSnapshot();
  });

  test('submit on page 1: store of wizard', () => {
    const {getWizardExample, component} = renderComponent();
    component.find('form').simulate('submit');
    expect(getWizardExample()).toMatchSnapshot();
  });
});
