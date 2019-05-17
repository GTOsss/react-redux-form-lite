import React from 'react';
import {mount, shallow} from 'enzyme';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import FieldLevelValidation from './field-level-validation';
import ReduxThunkTester from 'redux-thunk-tester';
import {reducer} from '../../index';
import stringifyObject from 'stringify-object';

const renderComponent = () => {
  const reduxThunkTester = new ReduxThunkTester();

  const store = createStore(
    combineReducers({reduxForm: reducer}),
    applyMiddleware(reduxThunkTester.createReduxThunkHistoryMiddleware()),
  );

  const component = mount(<Provider store={store}><FieldLevelValidation /></Provider>);

  return {reduxThunkTester, store, component};
};

describe('<FieldLevelValidation />', () => {
  test('Render field-level-validation form.', () => {
    const {component} = renderComponent();
    expect(component).toMatchSnapshot();
  });

  test('Register form and fields: action history.', () => {
    const {reduxThunkTester: {getActionHistory, getActionHistoryStringify}} = renderComponent();

    console.log(getActionHistoryStringify({withColor: true}));
    expect(getActionHistory()).toMatchSnapshot();
  });

  test('Register form and fields: store.', () => {
    const {store} = renderComponent();

    expect(store.getState().reduxForm.simple).toMatchSnapshot();
    console.log(stringifyObject(store.getState().reduxForm.simple));
  });

  test('Focus field: actions history.', () => {
    const {
      reduxThunkTester: {getActionHistoryStringify, getActionHistory, clearActionHistory}, component
    } = renderComponent();

    clearActionHistory();
    component.find('input').at(0).simulate('focus');
    expect(getActionHistory()).toMatchSnapshot();
    console.log(getActionHistoryStringify({withColor: true}));
  });

  test('Focus field: store', () => {
    const {store, component} = renderComponent();

    component.find('input').at(0).simulate('focus');
    expect(store.getState().reduxForm.simple).toMatchSnapshot();
    console.log(stringifyObject(store.getState().reduxForm.simple));
  });

  test('Change field (validate and warning): actions history.', () => {
    const {reduxThunkTester: {clearActionHistory, getActionHistoryStringify}, component} = renderComponent();

    component.find('input').at(0).simulate('focus');
    clearActionHistory();
    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('input').at(0).simulate('change', {target: {value: ''}});
    expect(getActionHistoryStringify()).toMatchSnapshot();
    console.log(getActionHistoryStringify({withColor: true}));

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
    console.log(getActionHistoryStringify({withColor: true}));

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
    console.log(getActionHistoryStringify({withColor: true}));

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
    console.log(getActionHistoryStringify({withColor: true}));
  });

  test('Changed field (validate and warning firstName: validate={validateIsRequired}): store', () => {
    const {component, store} = renderComponent();

    component.find('input').at(0).simulate('focus');
    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    component.find('input').at(0).simulate('change', {target: {value: ''}});
    expect(store.getState().reduxForm.simple.form.errorsMap).toEqual({firstName: 'Field required.'});
    expect(store.getState().reduxForm.simple.form.warningsMap).toEqual(null);
    expect(store.getState().reduxForm.simple).toMatchSnapshot();

    component.find('input').at(0).simulate('change', {target: {value: 't'}});
    expect(store.getState().reduxForm.simple.form.errorsMap).toEqual(null);
    expect(store.getState().reduxForm.simple.form.warningsMap).toEqual(null);
    expect(store.getState().reduxForm.simple).toMatchSnapshot();
  });

  test('Changed field (validate and warning' +
    'lastName: validate={[validateIsRequired, validateMinLength(2)]}): store', () => {

    const {component, store} = renderComponent();

    component.find('input').at(1).simulate('focus');
    component.find('input').at(1).simulate('change', {target: {value: 't'}});
    component.find('input').at(1).simulate('change', {target: {value: ''}});
    expect(store.getState().reduxForm.simple).toMatchSnapshot();
    expect(store.getState().reduxForm.simple.form.errorsMap).toEqual({lastName: 'Field required.'});
    expect(store.getState().reduxForm.simple.form.warningsMap).toEqual(null);

    component.find('input').at(1).simulate('change', {target: {value: 't'}});
    expect(store.getState().reduxForm.simple).toMatchSnapshot();
    expect(store.getState().reduxForm.simple.form.errorsMap).toEqual(
      {lastName: 'Must be 2 characters or more.'},
    );
    expect(store.getState().reduxForm.simple.form.warningsMap).toEqual(null);

    component.find('input').at(1).simulate('change', {target: {value: 'te'}});
    expect(store.getState().reduxForm.simple).toMatchSnapshot();
    expect(store.getState().reduxForm.simple.form.errorsMap).toEqual(null);
    expect(store.getState().reduxForm.simple.form.warningsMap).toEqual(null);
    expect(store.getState().reduxForm.simple.meta.lastName.error).toEqual('');
  });

  test('Changed field (validate and warning ' +
    'validate={validateIsRequired} warn={warnTooYang}): store', () => {

    const {component, store} = renderComponent();

    component.find('input').at(2).simulate('focus');
    component.find('input').at(2).simulate('change', {target: {value: 't'}});
    expect(store.getState().reduxForm.simple.form.errorsMap).toEqual(null);
    expect(store.getState().reduxForm.simple.form.warningsMap).toEqual(null);
    expect(store.getState().reduxForm.simple).toMatchSnapshot();

    component.find('input').at(2).simulate('change', {target: {value: ''}});
    expect(store.getState().reduxForm.simple.form.errorsMap).toEqual({age: 'Field required.'});
    expect(store.getState().reduxForm.simple.form.warningsMap).toEqual(null);
    expect(store.getState().reduxForm.simple).toMatchSnapshot();

    component.find('input').at(2).simulate('change', {target: {value: '1'}});
    expect(store.getState().reduxForm.simple.form.errorsMap).toEqual(null);
    expect(store.getState().reduxForm.simple.form.warningsMap).toEqual({age: 'Too yang.'});
    expect(store.getState().reduxForm.simple.meta.age.warning).toEqual('Too yang.');
    expect(store.getState().reduxForm.simple).toMatchSnapshot();

    component.find('input').at(2).simulate('change', {target: {value: '18'}});
    expect(store.getState().reduxForm.simple.form.errorsMap).toEqual(null);
    expect(store.getState().reduxForm.simple.form.warningsMap).toEqual(null);
    expect(store.getState().reduxForm.simple.meta.age.warning).toEqual('');
    expect(store.getState().reduxForm.simple).toMatchSnapshot();
  });

  test('Changed field (validate and warning ' +
    'warn={[warnTooSmall, warnTooLarge]}): store', () => {

    const {component, store} = renderComponent();

    component.find('input').at(3).simulate('focus');
    component.find('input').at(3).simulate('change', {target: {value: 't'}});
    expect(store.getState().reduxForm.simple.form.errorsMap).toEqual(null);
    expect(store.getState().reduxForm.simple.form.warningsMap).toEqual(null);
    expect(store.getState().reduxForm.simple).toMatchSnapshot();

    component.find('input').at(3).simulate('change', {target: {value: ''}});
    expect(store.getState().reduxForm.simple.form.errorsMap).toEqual(null);
    expect(store.getState().reduxForm.simple.form.warningsMap).toEqual(null);
    expect(store.getState().reduxForm.simple).toMatchSnapshot();

    component.find('input').at(3).simulate('change', {target: {value: '0'}});
    expect(store.getState().reduxForm.simple.form.errorsMap).toEqual(null);
    expect(store.getState().reduxForm.simple.form.warningsMap).toEqual({number: 'Too small.'});
    expect(store.getState().reduxForm.simple.meta.number.warning).toEqual('Too small.');
    expect(store.getState().reduxForm.simple).toMatchSnapshot();

    component.find('input').at(3).simulate('change', {target: {value: '1'}});
    expect(store.getState().reduxForm.simple.form.errorsMap).toEqual(null);
    expect(store.getState().reduxForm.simple.form.warningsMap).toEqual(null);
    expect(store.getState().reduxForm.simple.meta.number.warning).toEqual('');

    component.find('input').at(3).simulate('change', {target: {value: '10'}});
    expect(store.getState().reduxForm.simple.form.errorsMap).toEqual(null);
    expect(store.getState().reduxForm.simple.form.warningsMap).toEqual(null);
    expect(store.getState().reduxForm.simple.meta.number.warning).toEqual('');

    component.find('input').at(3).simulate('change', {target: {value: '101'}});
    expect(store.getState().reduxForm.simple.form.errorsMap).toEqual(null);
    expect(store.getState().reduxForm.simple.form.warningsMap).toEqual({number: 'Too large.'});
    expect(store.getState().reduxForm.simple.meta.number.warning).toEqual('Too large.');
    expect(store.getState().reduxForm.simple).toMatchSnapshot();
  });
});
