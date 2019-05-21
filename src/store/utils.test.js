import {updateWarnings, updateErrors, updateErrorsAndWarnings} from './utils';

const getMockState = () => ({
  testForm: {
    form: {
      errorsMap: {},
      warningsMap: {},
    },
    meta: {
      testField1: {
        warning: '',
        error: '',
      },
      testField2: {
        warning: '',
        error: '',
      },
    },
    values: {
      testField1: '',
      testField2: '',
    },
  },
});

describe('Store utils.', () => {
  test('updateErrors', () => {
    const form = 'testForm';
    const mockState = getMockState();

    const map1 = {testField1: 'Error for field 1'};
    expect(updateErrors(mockState, form, map1)).toMatchSnapshot();

    const map2 = {testField2: 'Error for field 2'};
    expect(updateErrors(mockState, form, map2)).toMatchSnapshot();

    const map3 = {
      testField1: 'Error for field 1',
      testField2: 'Error for field 2',
    };
    expect(updateErrors(mockState, form, map3)).toMatchSnapshot();
  });
  
  test('updateErrors (update to undefined)', () => {
    const form = 'testForm';
    const mockState = getMockState();

    const map3 = {
      testField1: 'Error for field 1',
      testField2: 'Error for field 2',
    };
    const result = updateErrors(mockState, form, map3);
    const resultUndefined = updateErrors(result, form, {testField1: undefined});
    const resultNull = updateErrors(result, form, {testField1: null});
    const resultEmptyString = updateErrors(result, form, {testField1: ''});
    expect(resultUndefined).toEqual(resultNull);
    expect(resultUndefined).toEqual(resultEmptyString);
    expect(resultUndefined).toMatchSnapshot();
  });

  test('updateWarnings', () => {
    const form = 'testForm';
    const mockState = getMockState();

    const map1 = {testField1: 'Warning for field 1'};
    expect(updateWarnings(mockState, form, map1)).toMatchSnapshot();

    const map2 = {testField2: 'Warning for field 2'};
    expect(updateWarnings(mockState, form, map2)).toMatchSnapshot();

    const map3 = {
      testField1: 'Warning for field 1',
      testField2: 'Warning for field 2',
    };
    expect(updateWarnings(mockState, form, map3)).toMatchSnapshot();
  });

  test('updateErrorsAndWarnings', () => {
    const form = 'testForm';
    const mockState = getMockState();

    const map1 = {
      errors: {testField1: 'Error for field 1'},
    };
    expect(updateErrorsAndWarnings(mockState, form, map1)).toMatchSnapshot();

    const map2 = {
      warnings: {testField1: 'Warning for field 1'}
    };
    expect(updateErrorsAndWarnings(mockState, form, map2)).toMatchSnapshot();

    const map3 = {
      errors: {testField1: 'Error for field 1'},
      warnings: {testField1: 'Warning for field 1'}
    };
    expect(updateErrorsAndWarnings(mockState, form, map3)).toMatchSnapshot();

    const map4 = {
      errors: {testField1: 'Error for field 1', testField2: 'Error for field 2'},
      warnings: {testField1: 'Warning for field 2', testField2: 'Warning for field 2'}
    };
    expect(updateErrorsAndWarnings(mockState, form, map4)).toMatchSnapshot();
  });
});