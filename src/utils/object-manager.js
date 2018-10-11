/*eslint-disable */
const charCodeOfDot = '.'.charCodeAt(0);
const reEscapeChar = /\\(\\)?/g;
const rePropName = RegExp(
  // Match anything that isn't a dot or bracket.
  '[^.[\\]]+' + '|' +
  // Or match property names within brackets.
  '\\[(?:' +
  // Match a non-string expression.
  '([^"\'].*)' + '|' +
  // Or match strings (supports escaping characters).
  '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
  ')\\]' + '|' +
  // Or match "" as the space between consecutive dots or empty brackets.
  '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))'
  , 'g',
);

const stringToPath = (string) => {
  const result = [];
  if (typeof string !== 'string') {
    console.error(`ReduxForm: Invalid name for Field: '${string}'. Perhaps form does not contain any Fields.`);
    return result;
  }

  if (string.charCodeAt(0) === charCodeOfDot) {
    result.push('');
  }
  string.replace(rePropName, (match, expression, quote, subString) => {
    let key = match;
    if (quote) {
      key = subString.replace(reEscapeChar, '$1');
    } else if (expression) {
      key = expression.trim();
    }
    result.push(key);
  });
  return result;
};

/**
 *
 * @param {object} state Object will be expand
 * @param {any} value Value will be add
 * @param {string} path Path in object
 * @param {number} pathIndex Not require
 * @returns {object} State
 */
export const addToObjectByPath = (state, value, path, pathIndex = 0) => {
  if (pathIndex === 0) {
    path = stringToPath(path);
  }

  if (pathIndex >= path.length) {
    return value;
  }

  const first = path[pathIndex];
  const firstState =
    state && (Array.isArray(state) ? state[Number(first)] : state[first]);
  const next = addToObjectByPath(firstState, value, path, pathIndex + 1);

  if (!state) {
    if (isNaN(first)) {
      return { [first]: next };
    }
    const initialized = [];
    initialized[parseInt(first, 10)] = next;
    return initialized;
  }

  if (Array.isArray(state)) {
    const copy = [].concat(state);
    copy[parseInt(first, 10)] = next;
    return copy;
  }

  return {
    ...state,
    [first]: next,
  };
};

/**
 *
 * @param {object} state
 * @param {string} field Path to field
 * @returns {object} State
 */
export const getIn = (state, field) => {
  if (!state) {
    return state
  }

  const path = stringToPath(field);
  const length = path.length;
  if (!length) {
    return undefined
  }

  let result = state;
  for (let i = 0; i < length && result; ++i) {
    result = result[path[i]]
  }

  return result
};

const deleteInWithPath = (state, first, ...rest) => {
  if (state === undefined || state === null || first === undefined || first === null) {
    return state
  }

  if (rest.length) {
    if (Array.isArray(state)) {
      if (isNaN(first)) {
        throw new Error(
          `Must access array elements with a number, not "${String(first)}".`
        )
      }
      const firstIndex = Number(first);
      if (firstIndex < state.length) {
        const result = deleteInWithPath(state && state[firstIndex], ...rest);
        if (result !== state[firstIndex]) {
          const copy = [...state];
          copy[firstIndex] = result;
          return copy
        }
      }
      return state
    }
    if (first in state) {
      const result = deleteInWithPath(state && state[first], ...rest);
      return state[first] === result
        ? state
        : {
          ...state,
          [first]: result
        }
    }
    return state
  }

  if (Array.isArray(state)) {
    if (isNaN(first)) {
      throw new Error(
        `Cannot delete non-numerical index from an array. Given: "${String(
          first
        )}`
      )
    }
    const firstIndex = Number(first);
    if (firstIndex < state.length) {
      const copy = [...state];
      copy.splice(firstIndex, 1);
      return copy
    }
    return state
  }
  if (first in state) {
    const copy = { ...state };
    delete copy[first];
    return copy
  }
  return state
};

/**
 * @param {object} state
 * @param {string} field Path to field
 * @returns {object} State
 */
export const deleteIn = (state, field) => {
  const path = stringToPath(field);
  return deleteInWithPath(state, ...path);
};
