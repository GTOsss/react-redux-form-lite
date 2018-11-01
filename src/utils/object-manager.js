import stringToPath from 'lodash.topath';

/**
 *
 * @param {object} state Object will be expand
 * @param {string} path Path in object
 * @param {*} value Value will be add
 * @param {number} pathIndex Not require
 * @returns {object} State
 */
export const addToObjectByPath = (state, path, value, pathIndex = 0) => {
  const pathArray = pathIndex === 0 ? stringToPath(path) : path;

  if (pathIndex >= pathArray.length) {
    return value;
  }

  const first = pathArray[pathIndex];
  const firstState = state && (Array.isArray(state) ? state[Number(first)] : state[first]);
  const next = addToObjectByPath(firstState, pathArray, value, pathIndex + 1);

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
 * @param {object} state Redux state
 * @param {string} field Path to field
 * @returns {object} State
 */
export const getIn = (state, field) => {
  if (!state) {
    return state;
  }

  const path = stringToPath(field);
  const { length } = path;
  if (!length) {
    return undefined;
  }

  let result = state;
  for (let i = 0; i < length && result; i += 1) {
    result = result[path[i]];
  }

  return result;
};

const deleteInWithPath = (state, first, ...rest) => {
  if (state === undefined || state === null || first === undefined || first === null) {
    return state;
  }

  if (rest.length) {
    if (Array.isArray(state)) {
      if (isNaN(first)) {
        throw new Error(
          `Must access array elements with a number, not "${String(first)}".`,
        );
      }
      const firstIndex = Number(first);
      if (firstIndex < state.length) {
        const result = deleteInWithPath(state && state[firstIndex], ...rest);
        if (result !== state[firstIndex]) {
          const copy = [...state];
          copy[firstIndex] = result;
          return copy;
        }
      }
      return state;
    }
    if (first in state) {
      const result = deleteInWithPath(state && state[first], ...rest);
      return state[first] === result
        ? state
        : {
          ...state,
          [first]: result,
        };
    }
    return state;
  }

  if (Array.isArray(state)) {
    if (isNaN(first)) {
      throw new Error(
        `Cannot delete non-numerical index from an array. Given: "${String(
          first,
        )}`,
      );
    }
    const firstIndex = Number(first);
    if (firstIndex < state.length) {
      const copy = [...state];
      copy.splice(firstIndex, 1);
      return copy;
    }
    return state;
  }
  if (first in state) {
    const copy = { ...state };
    delete copy[first];
    return copy;
  }
  return state;
};

/**
 * @param {object} state Redux state
 * @param {string} field Path to field
 * @returns {object} State
 */
export const deleteIn = (state, field) => {
  const path = stringToPath(field);
  return deleteInWithPath(state, ...path);
};
