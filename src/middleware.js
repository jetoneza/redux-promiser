const constants = require('./constants');

const TYPE_INDEXES = {
  INIT: 0,
  SUCCESS: 1,
  FAILURE: 2,
};

function validatePromise(promise) {
  if (!promise || typeof promise.then !== 'function') {
    throw Error(`Provide a valid promise for ${constants.TYPE}.`);
  }
}

function validateTypes(types) {
  if (!types || types.length < 3) {
    throw Error(`Provide valid handler types for the action ${constants.TYPE}.`);
  }

  types.forEach((type) => {
    if (typeof type !== 'string') {
      throw Error(
        `The handler type for action ${constants.TYPE} `
        + `is expected to be a string, but found ${typeof type} instead.`,
      );
    }
  });
}

const middleware = store => next => (action) => {
  if (action.type !== constants.TYPE) {
    return next(action);
  }

  const { promise, handlerTypes, payload } = action;

  validatePromise(promise);
  validateTypes(handlerTypes);

  const startType = handlerTypes[TYPE_INDEXES.INIT];
  const successType = handlerTypes[TYPE_INDEXES.SUCCESS];
  const failureType = handlerTypes[TYPE_INDEXES.FAILURE];

  store.dispatch({
    type: startType,
    payload,
  });

  const success = (data) => {
    store.dispatch({
      type: successType,
      payload: data,
    });

    return { payload: data };
  };

  const failure = (error) => {
    store.dispatch({
      type: failureType,
      payload: error,
      error: true,
    });

    return { error: true, payload: error };
  };

  return promise.then(success).catch(failure);
};

module.exports = middleware;
