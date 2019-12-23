import * as React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import ReduxThunkTester from 'redux-thunk-tester';
import {reducer} from '../../index';
import InitialValues from './initial-values-object-model';

export interface IValues {
  profile?: {
    firstName?: string;
    lastName?: string;
    sex?: string;
  };
  contacts?: {
    email?: string;
  };
  additionalInfo?: {
    favoriteColor?: string;
    employed?: boolean;
    more?: {
      notes?: string;
    }
  };
}

const renderComponent = (onSubmit?) => {
  const reduxThunkTester = new ReduxThunkTester();

  const store = createStore(
    combineReducers({reduxForm: reducer}),
    applyMiddleware(reduxThunkTester.createReduxThunkHistoryMiddleware()),
  );

  const component = mount(
    <Provider store={store}>
      <InitialValues onSubmit={onSubmit} />
    </Provider>,
  );

  return {
    reduxThunkTester,
    getFormState: () => store.getState().reduxForm.simple as IReduxFormState<IValues>,
    component,
  };
};

describe('<InitialValuesObjectModel />', () => {
  test('Render inputs', () => {
    const {component} = renderComponent();
    expect(component.find('input')).toMatchSnapshot();
  });

  test('Render inputs (store)', () => {
    const {getFormState} = renderComponent();
    expect(getFormState()).toMatchSnapshot();
  });

  test('Render inputs after change', () => {
    const {component} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'new value 0'}});
    component.find('input').at(1).simulate('change', {target: {value: 'new value 1'}});
    expect(component.find('input')).toMatchSnapshot();
  });

  test('Reset form (render inputs)', () => {
    const {component} = renderComponent();
    component.find('input').at(0).simulate('change', {target: {value: 'some name'}});
    component.find('input').at(1).simulate('change', {target: {value: 'some second name'}});
    component.find('input').at(2).simulate('change', {target: {value: 'some email'}});
    component.find('#resetForm').simulate('click');
    expect(component.find('input')).toMatchSnapshot();
  });
});
