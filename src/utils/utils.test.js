import { addToObjectByPath, getIn, deleteIn } from './object-manager';

test('addToObjectByPath', () => {
  let result;
  const state = {
    testForm: {
      meta: {},
      values: {},
    },
  };

  result = addToObjectByPath(state, 'testForm.meta.testField', 'test value');
  expect(result).toEqual({
    testForm: {
      meta: { testField: 'test value' },
      values: {},
    },
  });

  result = addToObjectByPath(state, 'testForm.meta.testField', 0);
  expect(result).toEqual({
    testForm: {
      meta: { testField: 0 },
      values: {},
    },
  });

  result = addToObjectByPath(state, 'testForm.meta.testField', '');
  expect(result).toEqual({
    testForm: {
      meta: { testField: '' },
      values: {},
    },
  });

  result = addToObjectByPath(state, 'testForm.meta.testField', false);
  expect(result).toEqual({
    testForm: {
      meta: { testField: false },
      values: {},
    },
  });

  let resultWithArray = addToObjectByPath(state, 'testForm.meta.testArray[0]', 'first');
  expect(resultWithArray).toEqual({
    testForm: {
      meta: { testArray: ['first'] },
      values: {},
    },
  });

  resultWithArray = addToObjectByPath(resultWithArray, 'testForm.meta.testArray[1]', 'second');
  expect(resultWithArray).toEqual({
    testForm: {
      meta: { testArray: ['first', 'second'] },
      values: {},
    },
  });

  resultWithArray = addToObjectByPath(resultWithArray, 'testForm.meta.testArray[3]', 'fourth');
  expect(resultWithArray).toEqual({
    testForm: {
      meta: { testArray: ['first', 'second', undefined, 'fourth'] },
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

test('deleteIn', () => {
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

  expect(deleteIn(state, 'formTest')).toEqual({});

  expect(deleteIn(state, 'formTest.meta')).toEqual({
    formTest: {
      values: {
        value: [{ a: 'a' }],
      },
    },
  });

  expect(deleteIn(state, 'formTest.values.value[0]')).toEqual({
    formTest: {
      meta: {
        metaField: 'meta field',
        metaArray: [1, 2, 3],
      },
      values: {
        value: [],
      },
    },
  });

  expect(deleteIn(state, 'formTest.values.value[0].a')).toEqual({
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

  expect(deleteIn(state, 'formTest.values.value[0].b')).toEqual({
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

  expect(deleteIn(stateWithArray, 'array[1]')).toEqual({ array: [1, 3] });

  expect(deleteIn([1, 2, 3], '[1]')).toEqual([1, 3]);
});
