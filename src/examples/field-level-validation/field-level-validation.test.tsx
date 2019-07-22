import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import ReduxThunkTester from 'redux-thunk-tester';
import FieldLevelValidation from './field-level-validation';
import {reducer} from '../../index';

interface IValues {
  firstName?: string;
  lastName?: string;
  age?: string;
  number?: string;
}

const renderComponent = (innerOnSubmit?) => {
  const reduxThunkTester = new ReduxThunkTester();

  const store = createStore(
    combineReducers({reduxForm: reducer}),
    applyMiddleware(reduxThunkTester.createReduxThunkHistoryMiddleware()),
  );

  const component = mount(
    <Provider store={store}>
      <FieldLevelValidation innerOnSubmit={innerOnSubmit} />
    </Provider>,
  );

  return {
    reduxThunkTester,
    getFormState: () => store.getState().reduxForm.simple as IReduxFormState<IValues>,
    component,
  };
};

describe('<FieldLevelValidation />', () => {
  test('Render field-level-validation form.', () => {
    const {component} = renderComponent();
    expect(component).toMatchSnapshot();
  });

  test('Register form and fields: action history.', () => {
    const {reduxThunkTester: {getActionHistory}} = renderComponent();
    expect(getActionHistory()).toMatchSnapshot();
  });

  test('Register form and fields: store.', () => {
    const {getFormState} = renderComponent();

    expect(getFormState()).toMatchSnapshot();
  });

  test('Focus field: actions history.', () => {
    const {
      reduxThunkTester: {getActionHistory, clearActionHistory}, component,
    } = renderComponent();

    clearActionHistory();
    component.find('input').at(0).simulate('focus');
    expect(getActionHistory()).toMatchSnapshot();
  });

  test('Focus field: store', () => {
    const {getFormState, component} = renderComponent();

    component.find('input').at(0).simulate('focus');
    expect(getFormState()).toMatchSnapshot();
  });

  test('Change field (validate and warning): actions history (input 0).', () => {
    const {
      reduxThunkTester: {clearActionHistory, getActionHistoryStringify}, component,
    } = renderComponent();

    component.find('input').at(0).simulate('focus');
    clearActionHistory();
    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('input').at(0).simulate('change', {target: {value: ''}});
    expect(getActionHistoryStringify()).toMatchSnapshot();
  });

  test('Change field (validate and warning): actions history (input 1).', () => {
    const {
      reduxThunkTester: {clearActionHistory, getActionHistoryStringify}, component,
    } = renderComponent();

    component.find('input').at(0).simulate('focus');
    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('input').at(0).simulate('change', {target: {value: ''}});

    clearActionHistory();
    component.find('input').at(1).simulate('change', {target: {value: ''}});
    component.find('input').at(1).simulate('change', {target: {value: 't'}});
    component.find('input').at(1).simulate('change', {target: {value: 'te'}});
    component.find('input').at(1).simulate('change', {target: {value: 'tes'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'tes'}});
    component.find('input').at(1).simulate('change', {target: {value: 'te'}});
    component.find('input').at(1).simulate('change', {target: {value: 't'}});
    component.find('input').at(1).simulate('change', {target: {value: ''}});
    expect(getActionHistoryStringify()).toMatchSnapshot();
  });

  test('Change field (validate and warning): actions history (input 2).', () => {
    const {
      reduxThunkTester: {clearActionHistory, getActionHistoryStringify}, component,
    } = renderComponent();

    component.find('input').at(0).simulate('focus');
    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('input').at(0).simulate('change', {target: {value: ''}});

    clearActionHistory();
    component.find('input').at(1).simulate('change', {target: {value: ''}});
    component.find('input').at(1).simulate('change', {target: {value: 't'}});
    component.find('input').at(1).simulate('change', {target: {value: 'te'}});
    component.find('input').at(1).simulate('change', {target: {value: 'tes'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'tes'}});
    component.find('input').at(1).simulate('change', {target: {value: 'te'}});
    component.find('input').at(1).simulate('change', {target: {value: 't'}});
    component.find('input').at(1).simulate('change', {target: {value: ''}});

    clearActionHistory();
    component.find('input').at(2).simulate('change', {target: {value: ''}});
    component.find('input').at(2).simulate('change', {target: {value: '1'}});
    component.find('input').at(2).simulate('change', {target: {value: '18'}});
    component.find('input').at(2).simulate('change', {target: {value: '1'}});
    component.find('input').at(2).simulate('change', {target: {value: '19'}});
    component.find('input').at(2).simulate('change', {target: {value: '1'}});
    component.find('input').at(2).simulate('change', {target: {value: ''}});
    component.find('input').at(2).simulate('change', {target: {value: '0'}});
    component.find('input').at(2).simulate('change', {target: {value: ''}});
    expect(getActionHistoryStringify()).toMatchSnapshot();
  });

  test('Change field (validate and warning): actions history (input 3).', () => {
    const {
      reduxThunkTester: {clearActionHistory, getActionHistoryStringify}, component,
    } = renderComponent();

    component.find('input').at(0).simulate('focus');
    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('input').at(0).simulate('change', {target: {value: ''}});

    component.find('input').at(1).simulate('change', {target: {value: ''}});
    component.find('input').at(1).simulate('change', {target: {value: 't'}});
    component.find('input').at(1).simulate('change', {target: {value: 'te'}});
    component.find('input').at(1).simulate('change', {target: {value: 'tes'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('change', {target: {value: 'tes'}});
    component.find('input').at(1).simulate('change', {target: {value: 'te'}});
    component.find('input').at(1).simulate('change', {target: {value: 't'}});
    component.find('input').at(1).simulate('change', {target: {value: ''}});

    component.find('input').at(2).simulate('change', {target: {value: ''}});
    component.find('input').at(2).simulate('change', {target: {value: '1'}});
    component.find('input').at(2).simulate('change', {target: {value: '18'}});
    component.find('input').at(2).simulate('change', {target: {value: '1'}});
    component.find('input').at(2).simulate('change', {target: {value: '19'}});
    component.find('input').at(2).simulate('change', {target: {value: '1'}});
    component.find('input').at(2).simulate('change', {target: {value: ''}});
    component.find('input').at(2).simulate('change', {target: {value: '0'}});
    component.find('input').at(2).simulate('change', {target: {value: ''}});

    clearActionHistory();
    component.find('input').at(3).simulate('change', {target: {value: ''}});
    component.find('input').at(3).simulate('change', {target: {value: '1'}});
    component.find('input').at(3).simulate('change', {target: {value: ''}});
    component.find('input').at(3).simulate('change', {target: {value: '5'}});
    component.find('input').at(3).simulate('change', {target: {value: '50'}});
    component.find('input').at(3).simulate('change', {target: {value: '500'}});
    component.find('input').at(3).simulate('change', {target: {value: '50'}});
    component.find('input').at(3).simulate('change', {target: {value: '5'}});
    component.find('input').at(3).simulate('change', {target: {value: ''}});
    component.find('input').at(3).simulate('change', {target: {value: '-1'}});
    component.find('input').at(3).simulate('change', {target: {value: '-11'}});
    component.find('input').at(3).simulate('change', {target: {value: '-11'}});
    expect(getActionHistoryStringify()).toMatchSnapshot();
  });

  test('Changed field (validate and warning firstName: validate={validateIsRequired}): store', () => {
    const {component, getFormState} = renderComponent();

    component.find('input').at(0).simulate('focus');
    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('input').at(0).simulate('change', {target: {value: ''}});
    expect(getFormState().form.errorsMap).toEqual({firstName: 'Field required.'});
    expect(getFormState().form.warningsMap).toEqual({});
    expect(getFormState().form.hasErrors).toEqual(true);
    expect(getFormState().form.hasWarnings).toEqual(false);
    expect(getFormState()).toMatchSnapshot();
    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    expect(getFormState().form.errorsMap).toEqual({});
    expect(getFormState().form.warningsMap).toEqual({});
    expect(getFormState().form.hasErrors).toEqual(false);
    expect(getFormState().form.hasWarnings).toEqual(false);
  });

  test('Changed field (validate and warning'
    + 'lastName: validate={[validateIsRequired, validateMinLength(2)]}): store', () => {
    const {component, getFormState} = renderComponent();

    component.find('input').at(1).simulate('focus');
    component.find('input').at(1).simulate('change', {target: {value: 't'}});
    component.find('input').at(1).simulate('change', {target: {value: ''}});
    expect(getFormState()).toMatchSnapshot();
    expect(getFormState().form.errorsMap).toEqual({lastName: 'Field required.'});
    expect(getFormState().form.warningsMap).toEqual({});
    expect(getFormState().form.hasErrors).toEqual(true);
    expect(getFormState().form.hasWarnings).toEqual(false);

    component.find('input').at(1).simulate('change', {target: {value: 't'}});
    expect(getFormState().form.errorsMap).toEqual(
      {lastName: 'Must be 2 characters or more.'},
    );
    expect(getFormState().form.warningsMap).toEqual({});
    expect(getFormState().form.hasErrors).toEqual(true);
    expect(getFormState().form.hasWarnings).toEqual(false);

    component.find('input').at(1).simulate('change', {target: {value: 'te'}});
    expect(getFormState().form.errorsMap).toEqual({});
    expect(getFormState().form.warningsMap).toEqual({});
    // @ts-ignore
    expect(getFormState().meta.lastName.error).toEqual('');
    expect(getFormState().form.hasErrors).toEqual(false);
    expect(getFormState().form.hasWarnings).toEqual(false);
  });

  test('Changed field (validate and warning '
    + 'validate={validateIsRequired} warn={warnTooYang}): store', () => {
    const {component, getFormState} = renderComponent();

    component.find('input').at(2).simulate('focus');
    component.find('input').at(2).simulate('change', {target: {value: 't'}});
    expect(getFormState().form.errorsMap).toEqual({});
    expect(getFormState().form.warningsMap).toEqual({});

    component.find('input').at(2).simulate('change', {target: {value: ''}});
    expect(getFormState().form.errorsMap).toEqual({age: 'Field required.'});
    expect(getFormState().form.warningsMap).toEqual({});
    expect(getFormState().form.hasErrors).toEqual(true);
    expect(getFormState().form.hasWarnings).toEqual(false);

    component.find('input').at(2).simulate('change', {target: {value: '1'}});
    expect(getFormState().form.errorsMap).toEqual({});
    expect(getFormState().form.warningsMap).toEqual({age: 'Too yang.'});
    // @ts-ignore
    expect(getFormState().meta.age.warning).toEqual('Too yang.');
    expect(getFormState().form.hasErrors).toEqual(false);
    expect(getFormState().form.hasWarnings).toEqual(true);

    component.find('input').at(2).simulate('change', {target: {value: '18'}});
    expect(getFormState().form.errorsMap).toEqual({});
    expect(getFormState().form.warningsMap).toEqual({});
    // @ts-ignore
    expect(getFormState().meta.age.warning).toEqual('');
    expect(getFormState().form.hasErrors).toEqual(false);
    expect(getFormState().form.hasWarnings).toEqual(false);
    expect(getFormState()).toMatchSnapshot();
  });

  test('Changed field (validate and warning '
    + 'warn={[warnTooSmall, warnTooLarge]}): store', () => {
    const {component, getFormState} = renderComponent();

    component.find('input').at(3).simulate('focus');
    component.find('input').at(3).simulate('change', {target: {value: 't'}});
    expect(getFormState().form.errorsMap).toEqual({});
    expect(getFormState().form.warningsMap).toEqual({});
    expect(getFormState().form.hasErrors).toEqual(false);
    expect(getFormState().form.hasWarnings).toEqual(false);

    component.find('input').at(3).simulate('change', {target: {value: ''}});
    expect(getFormState().form.errorsMap).toEqual({});
    expect(getFormState().form.warningsMap).toEqual({});
    expect(getFormState().form.hasErrors).toEqual(false);
    expect(getFormState().form.hasWarnings).toEqual(false);

    component.find('input').at(3).simulate('change', {target: {value: '0'}});
    expect(getFormState().form.errorsMap).toEqual({});
    expect(getFormState().form.warningsMap).toEqual({number: 'Too small.'});
    // @ts-ignore
    expect(getFormState().meta.number.warning).toEqual('Too small.');
    expect(getFormState().form.hasErrors).toEqual(false);
    expect(getFormState().form.hasWarnings).toEqual(true);

    component.find('input').at(3).simulate('change', {target: {value: '1'}});
    expect(getFormState().form.errorsMap).toEqual({});
    expect(getFormState().form.warningsMap).toEqual({});
    // @ts-ignore
    expect(getFormState().meta.number.warning).toEqual('');
    expect(getFormState().form.hasErrors).toEqual(false);
    expect(getFormState().form.hasWarnings).toEqual(false);

    component.find('input').at(3).simulate('change', {target: {value: '10'}});
    expect(getFormState().form.errorsMap).toEqual({});
    expect(getFormState().form.warningsMap).toEqual({});
    // @ts-ignore
    expect(getFormState().meta.number.warning).toEqual('');
    expect(getFormState().form.hasErrors).toEqual(false);
    expect(getFormState().form.hasWarnings).toEqual(false);

    component.find('input').at(3).simulate('change', {target: {value: '101'}});
    expect(getFormState().form.errorsMap).toEqual({});
    expect(getFormState().form.warningsMap).toEqual({number: 'Too large.'});
    // @ts-ignore
    expect(getFormState().meta.number.warning).toEqual('Too large.');
    expect(getFormState().form.hasErrors).toEqual(false);
    expect(getFormState().form.hasWarnings).toEqual(true);
    expect(getFormState()).toMatchSnapshot();
  });

  test('handleSubmit(onSubmit) inside form-component (valid)', () => {
    const innerOnSubmit = jest.fn();

    const {component} = renderComponent(innerOnSubmit);

    component.find('input').at(0).simulate('focus');
    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('input').at(0).simulate('change', {target: {value: 'te'}});
    component.find('input').at(0).simulate('change', {target: {value: 'tes'}});
    component.find('input').at(0).simulate('change', {target: {value: 'test'}});
    component.find('input').at(0).simulate('blur');

    component.find('input').at(1).simulate('focus');
    component.find('input').at(1).simulate('change', {target: {value: 't'}});
    component.find('input').at(1).simulate('change', {target: {value: 'te'}});
    component.find('input').at(1).simulate('change', {target: {value: 'tes'}});
    component.find('input').at(1).simulate('change', {target: {value: 'test'}});
    component.find('input').at(1).simulate('blur');

    component.find('input').at(2).simulate('focus');
    component.find('input').at(2).simulate('change', {target: {value: '1'}});
    component.find('input').at(2).simulate('change', {target: {value: '18'}});
    component.find('input').at(2).simulate('blur');

    component.find('input').at(3).simulate('focus');
    component.find('input').at(3).simulate('change', {target: {value: '5'}});
    component.find('input').at(3).simulate('change', {target: {value: '50'}});
    component.find('input').at(3).simulate('blur');

    expect(innerOnSubmit.mock.calls).toEqual([]);

    component.find('form').at(0).simulate('submit');
    expect(innerOnSubmit.mock.calls.length).toEqual(1);

    const values = {
      firstName: 'test',
      lastName: 'test',
      age: '18',
      number: '50',
    };
    expect(innerOnSubmit.mock.calls[0][0]).toEqual(values);

    expect(innerOnSubmit.mock.calls[0][1]).toMatchSnapshot();
  });

  test('handleSubmit(onSubmit) inside form-component (not valid): firstArg', () => {
    const innerOnSubmit = jest.fn();

    const {component} = renderComponent(innerOnSubmit);

    component.find('input').at(0).simulate('focus');
    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('input').at(0).simulate('change', {target: {value: ''}});
    component.find('input').at(0).simulate('blur');

    component.find('input').at(1).simulate('focus');
    component.find('input').at(1).simulate('change', {target: {value: 't'}});
    component.find('input').at(1).simulate('change', {target: {value: 't'}});
    component.find('input').at(1).simulate('blur');

    component.find('input').at(2).simulate('focus');
    component.find('input').at(2).simulate('change', {target: {value: '1'}});
    component.find('input').at(2).simulate('change', {target: {value: '12'}});
    component.find('input').at(2).simulate('blur');

    component.find('input').at(3).simulate('focus');
    component.find('input').at(3).simulate('change', {target: {value: '1'}});
    component.find('input').at(3).simulate('change', {target: {value: '10'}});
    component.find('input').at(3).simulate('change', {target: {value: '105'}});
    component.find('input').at(3).simulate('blur');

    expect(innerOnSubmit.mock.calls).toEqual([]);

    component.find('form').at(0).simulate('submit');
    expect(innerOnSubmit.mock.calls.length).toEqual(1);
    expect(innerOnSubmit.mock.calls[0][0]).toMatchSnapshot();
  });

  test('handleSubmit(onSubmit) inside form-component (not valid): secondArg', () => {
    const innerOnSubmit = jest.fn();

    const {component} = renderComponent(innerOnSubmit);

    component.find('input').at(0).simulate('focus');
    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('input').at(0).simulate('change', {target: {value: ''}});
    component.find('input').at(0).simulate('blur');

    component.find('input').at(1).simulate('focus');
    component.find('input').at(1).simulate('change', {target: {value: 't'}});
    component.find('input').at(1).simulate('change', {target: {value: 't'}});
    component.find('input').at(1).simulate('blur');

    component.find('input').at(2).simulate('focus');
    component.find('input').at(2).simulate('change', {target: {value: '1'}});
    component.find('input').at(2).simulate('change', {target: {value: '12'}});
    component.find('input').at(2).simulate('blur');

    component.find('input').at(3).simulate('focus');
    component.find('input').at(3).simulate('change', {target: {value: '1'}});
    component.find('input').at(3).simulate('change', {target: {value: '10'}});
    component.find('input').at(3).simulate('change', {target: {value: '105'}});
    component.find('input').at(3).simulate('blur');

    expect(innerOnSubmit.mock.calls).toEqual([]);

    component.find('form').at(0).simulate('submit');
    expect(innerOnSubmit.mock.calls.length).toEqual(1);
    expect(innerOnSubmit.mock.calls[0][1]).toMatchSnapshot();
  });

  test('handleSubmit(onSubmit) inside form-component (not valid): thirdArg', () => {
    const innerOnSubmit = jest.fn();

    const {component} = renderComponent(innerOnSubmit);

    component.find('input').at(0).simulate('focus');
    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('input').at(0).simulate('change', {target: {value: ''}});
    component.find('input').at(0).simulate('blur');

    component.find('input').at(1).simulate('focus');
    component.find('input').at(1).simulate('change', {target: {value: 't'}});
    component.find('input').at(1).simulate('change', {target: {value: 't'}});
    component.find('input').at(1).simulate('blur');

    component.find('input').at(2).simulate('focus');
    component.find('input').at(2).simulate('change', {target: {value: '1'}});
    component.find('input').at(2).simulate('change', {target: {value: '12'}});
    component.find('input').at(2).simulate('blur');

    component.find('input').at(3).simulate('focus');
    component.find('input').at(3).simulate('change', {target: {value: '1'}});
    component.find('input').at(3).simulate('change', {target: {value: '10'}});
    component.find('input').at(3).simulate('change', {target: {value: '105'}});
    component.find('input').at(3).simulate('blur');

    expect(innerOnSubmit.mock.calls).toEqual([]);

    component.find('form').at(0).simulate('submit');
    expect(innerOnSubmit.mock.calls.length).toEqual(1);
    expect(innerOnSubmit.mock.calls[0][2]).toMatchSnapshot();
  });

  test('Submit without touch inputs (not valid): store', () => {
    const {component, getFormState} = renderComponent();

    component.find('form').at(0).simulate('submit');
    expect(getFormState()).toMatchSnapshot();
  });
});
