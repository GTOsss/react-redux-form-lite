import {updateWarnings, updateErrors, updateErrorsAndWarnings} from './utils';

const getMockState = () => ({
  testForm: {
    form: {
      errorsMap: {},
      warningsMap: {},
      hasErrors: false,
      hasWarnings: false,
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
  test('updateErrors field1', () => {
    const form = 'testForm';
    const mockState = getMockState();

    const map = {testField1: 'Error for field 1'};
    expect(updateErrors(mockState, form, map)).toMatchSnapshot();
  });

  test('updateErrors field2', () => {
    const form = 'testForm';
    const mockState = getMockState();

    const map = {testField2: 'Error for field 2'};
    expect(updateErrors(mockState, form, map)).toMatchSnapshot();
  });

  test('updateErrors field1, field2', () => {
    const form = 'testForm';
    const mockState = getMockState();

    const map = {
      testField1: 'Error for field 1',
      testField2: 'Error for field 2',
    };
    expect(updateErrors(mockState, form, map)).toMatchSnapshot();
  });

  test('updateErrors (update to undefined)', () => {
    const form = 'testForm';
    const mockState = getMockState();

    const map = {
      testField1: 'Error1',
      testField2: 'Error2',
    };
    let result = updateErrors(mockState, form, map);

    // remove testField1
    let resultUndefined = updateErrors(result, form, {testField1: undefined});
    expect(resultUndefined).toEqual({
      testForm: {
        form: {
          errorsMap: {testField2: 'Error2'},
          warningsMap: {},
          hasErrors: true,
          hasWarnings: false,
        },
        meta: {
          testField1: {
            warning: '',
            error: '',
          },
          testField2: {
            warning: '',
            error: 'Error2',
          },
        },
        values: {
          testField1: '',
          testField2: '',
        },
      },
    });

    let resultNull = updateErrors(result, form, {testField1: null});
    let resultEmptyString = updateErrors(result, form, {testField1: ''});
    expect(resultUndefined).toEqual(resultNull);
    expect(resultUndefined).toEqual(resultEmptyString);

    // remove testField2
    resultUndefined = updateErrors(resultUndefined, form, {testField2: undefined});
    result = resultUndefined;
    expect(resultUndefined).toEqual({
      testForm: {
        form: {
          errorsMap: {},
          warningsMap: {},
          hasErrors: false,
          hasWarnings: false,
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

    resultNull = updateErrors(result, form, {testField2: null});
    resultEmptyString = updateErrors(result, form, {testField2: ''});
    expect(resultUndefined).toEqual(resultNull);
    expect(resultUndefined).toEqual(resultEmptyString);
  });

  test('updateWarnings (update to undefined)', () => {
    const form = 'testForm';
    const mockState = getMockState();

    const map = {
      testField1: 'Warning1',
      testField2: 'Warning2',
    };
    let result = updateWarnings(mockState, form, map);

    // remove testField1
    let resultUndefined = updateWarnings(result, form, {testField1: undefined});
    expect(resultUndefined).toEqual({
      testForm: {
        form: {
          errorsMap: {},
          warningsMap: {testField2: 'Warning2'},
          hasErrors: false,
          hasWarnings: true,
        },
        meta: {
          testField1: {
            warning: '',
            error: '',
          },
          testField2: {
            warning: 'Warning2',
            error: '',
          },
        },
        values: {
          testField1: '',
          testField2: '',
        },
      },
    });

    let resultNull = updateWarnings(result, form, {testField1: null});
    let resultEmptyString = updateWarnings(result, form, {testField1: ''});
    expect(resultUndefined).toEqual(resultNull);
    expect(resultUndefined).toEqual(resultEmptyString);

    // remove testField2
    resultUndefined = updateWarnings(resultUndefined, form, {testField2: undefined});
    result = resultUndefined;
    expect(resultUndefined).toEqual({
      testForm: {
        form: {
          errorsMap: {},
          warningsMap: {},
          hasErrors: false,
          hasWarnings: false,
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

    resultNull = updateErrors(result, form, {testField2: null});
    resultEmptyString = updateErrors(result, form, {testField2: ''});
    expect(resultUndefined).toEqual(resultNull);
    expect(resultUndefined).toEqual(resultEmptyString);
  });

  test('updateWarnings field1', () => {
    const form = 'testForm';
    const mockState = getMockState();

    const map = {testField1: 'Warning for field 1'};
    expect(updateWarnings(mockState, form, map)).toMatchSnapshot();
  });

  test('updateWarnings field2', () => {
    const form = 'testForm';
    const mockState = getMockState();

    const map = {testField2: 'Warning for field 2'};
    expect(updateWarnings(mockState, form, map)).toMatchSnapshot();
  });

  test('updateWarning field1, field2', () => {
    const form = 'testForm';
    const mockState = getMockState();

    const map = {
      testField1: 'Warning for field 1',
      testField2: 'Warning for field 2',
    };
    expect(updateWarnings(mockState, form, map)).toMatchSnapshot();
  });

  test('updateErrorsAndWarnings field1(error)', () => {
    const form = 'testForm';
    const mockState = getMockState();

    const map1 = {
      errors: {testField1: 'Error for field 1'},
    };
    expect(updateErrorsAndWarnings(mockState, form, map1)).toMatchSnapshot();
  });

  test('updateErrorsAndWarnings field1(warning)', () => {
    const form = 'testForm';
    const mockState = getMockState();

    const map = {
      warnings: {testField1: 'Warning for field 1'}
    };
    expect(updateErrorsAndWarnings(mockState, form, map)).toMatchSnapshot();
  });

  test('updateErrorsAndWarnings field1(error), field1(warning)', () => {
    const form = 'testForm';
    const mockState = getMockState();

    const map3 = {
      errors: {testField1: 'Error for field 1'},
      warnings: {testField1: 'Warning for field 1'}
    };
    expect(updateErrorsAndWarnings(mockState, form, map3)).toMatchSnapshot();
  });

  test('updateErrorsAndWarnings field1(error, warning) field2(error, warning)', () => {
    const form = 'testForm';
    const mockState = getMockState();

    const map4 = {
      errors: {testField1: 'Error for field 1', testField2: 'Error for field 2'},
      warnings: {testField1: 'Warning for field 2', testField2: 'Warning for field 2'}
    };
    expect(updateErrorsAndWarnings(mockState, form, map4)).toMatchSnapshot();
  });
});