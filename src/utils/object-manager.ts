import stringToPath from 'lodash.topath';

/**
 *
 * @param {object} state Object will be expand
 * @param {string} path Path in object
 * @param {*} value Value will be add
 * @param {number} pathIndex Not require
 * @returns {object} State
 */
export const setIn = (state, path, value, pathIndex = 0) => {
  const pathArray = pathIndex === 0 ? stringToPath(path) : path;

  if (pathIndex >= pathArray.length) {
    return value;
  }

  const first = pathArray[pathIndex];
  const firstState = state && (Array.isArray(state) ? state[Number(first)] : state[first]);
  const next = setIn(firstState, pathArray, value, pathIndex + 1);

  if (!state) {
    if (isNaN(first)) {
      return { [first]: next };
    }
    const initialized = [];
    // @ts-ignore
    initialized[parseInt(first, 10)] = next;
    return initialized;
  }

  if (Array.isArray(state)) {
    // @ts-ignore
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
 * @param {*?} defaultValue
 * @returns {object} State
 */
export const getIn = (state, field, defaultValue?) => {
  if (!state) {
    return defaultValue;
  }

  const path = stringToPath(field);
  const { length } = path;
  if (!length) {
    return defaultValue;
  }

  let result = state;
  for (let i = 0; i < length && result; i += 1) {
    result = result[path[i]];
  }

  if (!result) {
    return defaultValue;
  }

  return result;
};

/**
 * @param {object} state Redux state
 * @param path
 * @param removeEmpty
 * @param index
 * @returns {object} State
 */
const deleteInMessagesByPath = (state, path: Array<string>, removeEmpty: boolean = false, index: number = 0) => {
  const currentKey = path[index];

  if (!state && (state !== 0)) {
    return state;
  }

  const isEndPoint = (path.length - 1) === index;
  const isArray = Array.isArray(state);
  const isObject = !isArray && (typeof state === 'object');
  const newState = isArray ? [...state] : {...state};

  if (isObject) {
    if (isEndPoint) {
      // tslint:disable-next-line:no-dynamic-delete
      delete newState[currentKey];
      return newState;
    } else {
      const result = deleteInMessagesByPath(newState[currentKey], path, removeEmpty, index + 1);
      const isRemoveEmpty = !result || (removeEmpty && (!result || !Object.keys(result).length));
      if (isRemoveEmpty) {
        // tslint:disable-next-line:no-dynamic-delete
        delete newState[currentKey];
      } else {
        newState[currentKey] = result;
      }
      return newState;
    }
  } else if (isArray) {
    if (isEndPoint) {
      return newState.map((el, i) => Number(currentKey) !== i ? el : undefined);
    } else {
      const result = deleteInMessagesByPath(newState[currentKey], path, removeEmpty, index + 1);
      const isRemoveEmpty = !result || (removeEmpty && (!result || !Object.keys(result).length));

      if (isRemoveEmpty) {
        let countEmpty = 0;
        let isAllEmpty = false;
        const filteredArray = [];
        newState.forEach((el, i, array) => {
          const isTargetElement = i === Number(currentKey);
          if (!el || isTargetElement) {
            countEmpty += 1;
            // @ts-ignore
            filteredArray.push(undefined);
          } else {
            // @ts-ignore
            filteredArray.push(el);
          }

          isAllEmpty = countEmpty === array.length;
        });
        return isAllEmpty ? [] : filteredArray;
      } else {
        newState[currentKey] = result;
      }
      return newState;
    }
  }
};

export const deleteInMessages = (state, field, removeEmpty: boolean = false) => {
  const path = stringToPath(field);
  return deleteInMessagesByPath(state, path, removeEmpty);
};

const checkIsObject = (item: object): boolean =>
  item && (typeof item === 'object') && !Array.isArray(item);

/**
 * Deep merge two objects.
 * @param target
 * @param sources
 */
export const mergeDeep = (target, ...sources) => {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();

  if (checkIsObject(target) && checkIsObject(source)) {
    Object.keys(source).forEach((key) => {
      if (checkIsObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    });
  }

  return mergeDeep(target, ...sources);
};
