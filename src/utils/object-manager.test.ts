import { setIn, getIn, deleteInMessages, mergeDeep } from './object-manager';

describe('object-manager', () => {
  test('setIn', () => {
    let result;
    const state = {
      testForm: {
        meta: {},
        values: {},
      },
    };

    result = setIn(state, 'testForm.meta.testField', 'test value');
    expect(result).toEqual({
      testForm: {
        meta: { testField: 'test value' },
        values: {},
      },
    });

    result = setIn(state, 'testForm.meta.testField', 0);
    expect(result).toEqual({
      testForm: {
        meta: { testField: 0 },
        values: {},
      },
    });

    result = setIn(state, 'testForm.meta.testField', '');
    expect(result).toEqual({
      testForm: {
        meta: { testField: '' },
        values: {},
      },
    });

    result = setIn(state, 'testForm.meta.testField', false);
    expect(result).toEqual({
      testForm: {
        meta: { testField: false },
        values: {},
      },
    });

    let resultWithArray = setIn(state, 'testForm.meta.testArray[0]', 'first');
    expect(resultWithArray).toEqual({
      testForm: {
        meta: { testArray: ['first'] },
        values: {},
      },
    });

    resultWithArray = setIn(resultWithArray, 'testForm.meta.testArray[1]', 'second');
    expect(resultWithArray).toEqual({
      testForm: {
        meta: { testArray: ['first', 'second'] },
        values: {},
      },
    });

    resultWithArray = setIn(resultWithArray, 'testForm.meta.testArray[3]', 'fourth');
    expect(resultWithArray).toEqual({
      testForm: {
        meta: { testArray: ['first', 'second', undefined, 'fourth'] },
        values: {},
      },
    });

    resultWithArray = setIn(state, 'testForm.meta.testArray.0', 'first');
    expect(resultWithArray).toEqual({
      testForm: {
        meta: { testArray: ['first'] },
        values: {},
      },
    });
  });

  test('getIn', () => {
    const state = {
      formTest: {
        meta: {
          metaField: 'meta field',
          metaArray: [1, 2, 3],
        },
        values: {
          value: [{ a: 'a' }],
        },
      },
    };

    expect(getIn(state, 'formTest')).toEqual({
      meta: {
        metaField: 'meta field',
        metaArray: [1, 2, 3],
      },
      values: {
        value: [{ a: 'a' }],
      },
    });

    expect(getIn(state, 'formTest.meta')).toEqual({
      metaField: 'meta field',
      metaArray: [1, 2, 3],
    });

    expect(getIn(state, 'formTest.meta.metaField')).toEqual('meta field');

    expect(getIn(state, 'formTest.meta.metaArray')).toEqual([1, 2, 3]);

    expect(getIn(state, 'formTest.meta.metaArray[0]')).toEqual(1);

    expect(getIn(state, 'formTest.meta.metaArray[2]')).toEqual(3);

    expect(getIn(state, 'formTest.values.value[0]')).toEqual({ a: 'a' });

    expect(getIn(state, 'formTest.values.value[0].a')).toEqual('a');

    expect(getIn(state, 'formTest.values.value[1]')).toBeUndefined();

    expect(getIn(state, 'formTest.values.value[0].b')).toBeUndefined();

    expect(getIn(state, 'formTest.none', 'test')).toEqual('test');
  });

  test('deleteInMessages', () => {
    const state = {
      formTest: {
        meta: {
          metaField: 'meta field',
          metaArray: [1, 2, 3],
        },
        values: {
          value: [{ a: 'a' }],
        },
      },
    };

    const copy = {
      formTest: {
        meta: {
          metaField: 'meta field',
          metaArray: [1, 2, 3],
        },
        values: {
          value: [{ a: 'a' }],
        },
      },
    };

    expect(deleteInMessages({}, 'a.b')).toEqual({});

    expect(deleteInMessages({a: {b: undefined}}, 'a.b')).toEqual({a: {}});

    expect(deleteInMessages({a: {b: undefined}}, 'a.b.c')).toEqual({a: {}});

    expect(deleteInMessages({a: {b: undefined}}, 'a.b.c', true)).toEqual({});

    expect(deleteInMessages({a: [[[undefined]]]}, 'a[0][0][0][0]', true)).toEqual({});

    expect(deleteInMessages({a: [[[undefined]], 1]}, 'a[0][0][0][0]', true))
      .toEqual({a: [undefined, 1]});

    expect(deleteInMessages({a: [[[undefined]], 1]}, 'a[0][0][0][0]')).toEqual({a: [[[]], 1]});

    expect(deleteInMessages({array: [{id: '0'}, {id: '1'}]}, 'array[0].id', true))
      .toEqual({array: [undefined, {id: '1'}]});

    expect(deleteInMessages(state, 'formTest')).toEqual({});

    expect(deleteInMessages(state, 'formTest.meta')).toEqual({
      formTest: {
        values: {
          value: [{ a: 'a' }],
        },
      },
    });

    expect(deleteInMessages({a: {b: {c: 'c'}}}, 'a.b.c', true)).toEqual({});

    expect(deleteInMessages({a: {b: {c: 'c'}}}, 'a.b.c')).toEqual({a: {b: {}}});

    expect(deleteInMessages(state, 'formTest.values.value[0]')).toEqual({
      formTest: {
        meta: {
          metaField: 'meta field',
          metaArray: [1, 2, 3],
        },
        values: {
          value: [undefined],
        },
      },
    });

    expect(deleteInMessages(state, 'formTest.values.value[0].a')).toEqual({
      formTest: {
        meta: {
          metaField: 'meta field',
          metaArray: [1, 2, 3],
        },
        values: {
          value: [{}],
        },
      },
    });

    expect(deleteInMessages(state, 'formTest.values.value[0].a', true)).toEqual({
      formTest: {
        meta: {
          metaField: 'meta field',
          metaArray: [1, 2, 3],
        },
      },
    });

    expect(deleteInMessages(state, 'formTest.values.value[0].b')).toEqual({
      formTest: {
        meta: {
          metaField: 'meta field',
          metaArray: [1, 2, 3],
        },
        values: {
          value: [{ a: 'a' }],
        },
      },
    });

    const stateWithArray = { array: [1, 2, 3] };

    expect(deleteInMessages(stateWithArray, 'array[1]')).toEqual({ array: [1, undefined, 3] });

    expect(deleteInMessages([1, 2, 3], '[1]')).toEqual([1, undefined, 3]);

    expect(state).toEqual(copy);
  });

  test('mergeDeep', () => {
    expect(mergeDeep({a: 'a', b: 'b'}, {c: 'c'})).toEqual({a: 'a', b: 'b', c: 'c'});

    expect(mergeDeep({a: 'a', b: 'b', c: 'cccc'}, {c: 'c'})).toEqual({a: 'a', b: 'b', c: 'c'});

    expect(mergeDeep({a: {b: 'bbbb'}}, {a: {b: 'b', c: 'c'}})).toEqual({a: {b: 'b', c: 'c'}});
  });
});
