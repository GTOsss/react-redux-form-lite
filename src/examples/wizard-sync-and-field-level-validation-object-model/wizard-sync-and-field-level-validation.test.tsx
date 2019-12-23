import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import ReduxThunkTester from 'redux-thunk-tester';
import Field from '../../field';
import WizardSyncAndFieldLevelValidation from './wizard-sync-and-field-level-validation';
import {reducer} from '../../index';
import get = Reflect.get;

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
    <Provider store={store}><WizardSyncAndFieldLevelValidation onSubmit={onSubmit} /></Provider>,
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

describe('<WizardSyncAndFieldLevelValidationObjectModel />', () => {
  test('Render WizardSyncAndFieldLevelValidation (inputs)', () => {
    const {component} = renderComponent();
    expect(component.find('input')).toMatchSnapshot();
  });

  test('Render WizardSyncAndFieldLevelValidation: store of wizard', () => {
    const {getWizardExample} = renderComponent();
    expect(getWizardExample()).toMatchSnapshot();
  });

  test('submit failed on page 1 (render inputs)', () => {
    const {component} = renderComponent();
    component.find('form').simulate('submit');
    expect(component.find('input')).toMatchSnapshot();
  });

  test('submit failed on page 1 (store)', () => {
    const {component, getStep1} = renderComponent();
    component.find('form').simulate('submit');
    expect(getStep1()).toMatchSnapshot();
  });

  test('submit failed on page 1, incorrect firstName (store)', () => {
    const {component, getStep1} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'te'}});
    component.find('form').simulate('submit');
    expect(getStep1()).toMatchSnapshot();
  });

  test('submit failed on page 1 (errors in wizard === errors in step1)', () => {
    const {component, getWizardExample, getStep1} = renderComponent();
    component.find('form').simulate('submit');
    expect(getStep1().form.errorsMap).toStrictEqual(getWizardExample().wizard.errorsMap);
    expect(getWizardExample()).toMatchSnapshot();
  });

  test('submit success on page 1 (render inputs)', () => {
    const {component} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    expect(component.find('input')).toMatchSnapshot();
  });

  test('submit success on page 1 (store of wizard)', () => {
    const {component, getWizardExample} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    expect(getWizardExample()).toMatchSnapshot();
  });

  test('submit success on page 1 (store of step1)', () => {
    const {component, getStep1} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    expect(getStep1()).toMatchSnapshot();
  });

  test('submit success on page 1 (store of step2)', () => {
    const {component, getStep2} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    expect(getStep2()).toMatchSnapshot();
  });

  test('submit success on 1, failed on 2 (render inputs)', () => {
    const {component} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('form').simulate('submit');
    expect(component.find('input')).toMatchSnapshot();
  });

  test('submit success on 1, failed on 2 (errors in wizard === errors in step2)', () => {
    const {component, getWizardExample, getStep2} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    expect(getStep2().form.errorsMap).toStrictEqual(getWizardExample().wizard.errorsMap);
  });

  test('submit success on 1, failed on 2, click prevent page (render inputs)', () => {
    const {component} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('form').simulate('submit');
    component.find('button').at(0).simulate('click');
    expect(component.find('input')).toMatchSnapshot();
  });

  test('submit success on 1, failed on 2, click prevent page, submit success on 1 (render inputs)', () => {
    const {component} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('form').simulate('submit');
    component.find('button').at(0).simulate('click');
    component.find('form').simulate('submit');
    expect(component.find('input')).toMatchSnapshot();
  });

  test('submit success on 1, failed on 2, click prevent page (store of wizard)', () => {
    const {component, getWizardExample} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('form').simulate('submit');
    component.find('button').at(0).simulate('click');
    expect(getWizardExample()).toMatchSnapshot();
  });

  test('submit success on 1, failed on 2, click prevent page, submit success on 1 (store 2)', () => {
    const {component, getStep2} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('form').simulate('submit');
    component.find('button').at(0).simulate('click');
    component.find('form').simulate('submit');
    expect(getStep2()).toMatchSnapshot();
  });

  test('submit success on 1, failed on 2, click prevent (render inputs)', () => {
    const {component} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('button').at(0).simulate('click');
    expect(component.find('input')).toMatchSnapshot();
  });

  test('submit success on 1, failed on 2, click prevent (store of wizard)', () => {
    const {component, getWizardExample} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('button').at(0).simulate('click');
    expect(getWizardExample()).toMatchSnapshot();
  });

  test('submit success on 1, failed on 2 (store 2)', () => {
    const {component, getStep2} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('form').simulate('submit');
    expect(getStep2()).toMatchSnapshot();
  });

  test('submit success on 1, failed on 2 (store of wizard)', () => {
    const {component, getWizardExample} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('form').simulate('submit');
    expect(getWizardExample()).toMatchSnapshot();
  });

  test('submit success on 1, 2 (render inputs)', () => {
    const {component} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    expect(component.find('input')).toMatchSnapshot();
  });

  test('submit success on 1, 2 (store of wizard)', () => {
    const {component, getWizardExample} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    expect(getWizardExample()).toMatchSnapshot();
  });

  test('submit success on 1, failed on 2, click prevent, success on 1 (render inputs)', () => {
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

  test('submit success on 1, 2, 3 (store of wizard)', () => {
    const {component, getWizardExample} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    expect(getWizardExample()).toMatchSnapshot();
  });

  test('submit success on 1, 2, 3 (store 3)', () => {
    const {component, getStep3, reduxThunkTester} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('form').simulate('submit');
    expect(getStep3()).toMatchSnapshot();
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

  test('submit field-level failed on 1', () => {
    const {component, getWizardExample, getStep1, reduxThunkTester} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('form').simulate('submit');
    expect(getWizardExample().wizard.errorsMap).toStrictEqual(getStep1().form.errorsMap);
    expect(getWizardExample()).toMatchSnapshot();
  });
});
