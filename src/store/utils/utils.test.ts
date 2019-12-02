import {updateWarnings, updateErrors, updateErrorsAndWarnings, mergeMessages} from './utils';

interface IMockTwoFieldsValues {
  testField1: string;
  testField2: string;
}

const defaultFormState = {
  errorsMap: {},
  warningsMap: {},
  hasErrors: false,
  hasWarnings: false,
  activeField: '',
  blurred: false,
  changed: false,
  focused: false,
  submitted: false,
};

const defaultFieldMetaState = {
  warning: '',
  error: '',
  active: false,
  blurred: false,
  changed: false,
  focused: false,
};

const getMockState = (): IFullReduxFormState<IMockTwoFieldsValues> => ({
  testForm: {
    form: {
      ...defaultFormState,
    },
    meta: {
      testField1: {
        ...defaultFieldMetaState,
      },
      testField2: {
        ...defaultFieldMetaState,
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
    let expectState: IFullReduxFormState<IMockTwoFieldsValues> = {
      testForm: {
        form: {
          ...defaultFormState,
          errorsMap: {testField2: 'Error2'},
          hasErrors: true,
        },
        meta: {
          testField1: {
            ...defaultFieldMetaState,
          },
          testField2: {
            ...defaultFieldMetaState,
            error: 'Error2',
          },
        },
        values: {
          testField1: '',
          testField2: '',
        },
      },
    };
    expect(resultUndefined).toEqual(expectState);

    let resultNull = updateErrors(result, form, {testField1: null});
    let resultEmptyString = updateErrors(result, form, {testField1: ''});
    expect(resultUndefined).toEqual(resultNull);
    expect(resultUndefined).toEqual(resultEmptyString);

    // remove testField2
    resultUndefined = updateErrors(resultUndefined, form, {testField2: undefined});
    result = resultUndefined;
    expectState = {
      testForm: {
        form: {
          ...defaultFormState,
        },
        meta: {
          testField1: {
            ...defaultFieldMetaState,
          },
          testField2: {
            ...defaultFieldMetaState,
          },
        },
        values: {
          testField1: '',
          testField2: '',
        },
      },
    };
    expect(resultUndefined).toEqual(expectState);

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
    let expectState: IFullReduxFormState<IMockTwoFieldsValues> = {
      testForm: {
        form: {
          ...defaultFormState,
          warningsMap: {testField2: 'Warning2'},
          hasWarnings: true,
        },
        meta: {
          testField1: {
            ...defaultFieldMetaState,
          },
          testField2: {
            ...defaultFieldMetaState,
            warning: 'Warning2',
          },
        },
        values: {
          testField1: '',
          testField2: '',
        },
      },
    };

    expect(resultUndefined).toEqual(expectState);

    let resultNull = updateWarnings(result, form, {testField1: null});
    let resultEmptyString = updateWarnings(result, form, {testField1: ''});
    expect(resultUndefined).toEqual(resultNull);
    expect(resultUndefined).toEqual(resultEmptyString);

    // remove testField2
    resultUndefined = updateWarnings(resultUndefined, form, {testField2: undefined});
    result = resultUndefined;
    expectState = {
      testForm: {
        form: {
          ...defaultFormState,
        },
        meta: {
          testField1: {
            ...defaultFieldMetaState,
          },
          testField2: {
            ...defaultFieldMetaState,
          },
        },
        values: {
          testField1: '',
          testField2: '',
        },
      },
    };
    expect(resultUndefined).toEqual(expectState);

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

    const map = {
      errors: {testField1: 'Error for field 1'},
    };
    expect(updateErrorsAndWarnings(mockState, form, map)).toMatchSnapshot();
  });

  test('updateErrorsAndWarnings field1(warning)', () => {
    const form = 'testForm';
    const mockState = getMockState();

    const map = {
      warnings: {testField1: 'Warning for field 1'},
    };
    expect(updateErrorsAndWarnings(mockState, form, map)).toMatchSnapshot();
  });

  test('updateErrorsAndWarnings field1(error), field1(warning)', () => {
    const form = 'testForm';
    const mockState = getMockState();

    const map3 = {
      errors: {testField1: 'Error for field 1'},
      warnings: {testField1: 'Warning for field 1'},
    };
    expect(updateErrorsAndWarnings(mockState, form, map3)).toMatchSnapshot();
  });

  test('updateErrorsAndWarnings field1(error, warning) field2(error, warning)', () => {
    const form = 'testForm';
    const mockState = getMockState();

    const map4 = {
      errors: {testField1: 'Error for field 1', testField2: 'Error for field 2'},
      warnings: {testField1: 'Warning for field 2', testField2: 'Warning for field 2'},
    };
    expect(updateErrorsAndWarnings(mockState, form, map4)).toMatchSnapshot();
  });

  test('updateWarnings field1 and then field2', () => {
    const form = 'testForm';
    let mockState = getMockState();

    const map1 = {testField1: 'Warning for field 1'};
    const map2 = {testField2: 'Warning for field 2'};
    mockState = updateWarnings(mockState, form, map1);
    // tslint:disable-next-line:no-console
    console.log(mockState);
    expect(updateWarnings(mockState, form, map2)).toMatchSnapshot();
  });

  test('updateWarnings field1 and then field2 = undefined', () => {
    const form = 'testForm';
    let mockState = getMockState();

    const map1 = {testField1: 'Warning for field 1'};
    const map2 = {testField2: undefined};
    mockState = updateWarnings(mockState, form, map1);
    // tslint:disable-next-line:no-console
    console.log(mockState);
    expect(updateWarnings(mockState, form, map2)).toMatchSnapshot();
  });

  test('mergeMessages 1', () => {
    const objectA = {
      field1: '1',
      field2: '2',
    };

    const objectB = {
      field1: undefined,
    };

    expect(mergeMessages(objectA, objectB)).toStrictEqual({field1: '1', field2: '2'});
    expect(mergeMessages(objectB, objectA)).toStrictEqual({field1: '1', field2: '2'});
  });

  test('mergeMessages 2', () => {
    const objectA = {
      field1: '1',
      field2: '2',
    };

    const objectB = {
      field1: undefined,
      field3: '3',
    };

    const result = {...objectA};

    expect(mergeMessages(objectA, objectB)).toStrictEqual({field1: '1', field2: '2', field3: '3'});
    expect(mergeMessages(objectB, objectA)).toStrictEqual({field1: '1', field2: '2', field3: '3'});
  });
});