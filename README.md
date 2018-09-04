# Redux Promiser

A simple redux middleware for handling promises.

The middleware receives a `redux-promiser` action and dispatches a set of simplified [*Flux Standard Action*](https://github.com/acdlite/flux-standard-action).

## Installation
```
$ npm install redux-promiser --save
```
### Setup the middleware
```js
import { createStore, applyMiddleware } from 'redux';
import { middleware as reduxPromiserMiddleware } from 'redux-promiser';
import thunk from 'redux-thunk';
import rootReducer from './reducer';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk, reduxPackMiddleware),
);
```
A simple example:
```js
import Api from 'services/myApi';

import { HANDLE_SIMPLE_PROMISE } from 'redux-promiser';

const GET_USERS = 'GET_USERS';
const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';
const GET_USERS_FAILED = 'GET_USERS_FAILED';

export function getUsers(params) {
  return {
    type: HANDLE_SIMPLE_PROMISE,
    promise: Api.getUsers(params),
    handlerTypes: [
      GET_USERS,
      GET_USERS_SUCCESS,
      GET_USERS_FAILED,
    ],
  };
}

const initialState = {
  loading: false,
  users: [],
  error: null,
};

export function usersReducer(state = initialState, action) {
  const { type, payload } = action;

  switch(type) {
    case GET_USERS:
      return {
        ...state,
        loading: true,
      };
    case GET_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
      };
    case GET_USERS_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
```

## redux-promiser action

The action must be an object containing the properties `type`, `promise`, `handlerTypes`, and an optional `payload`.

* `type` - A *String* constant defined and exported by `redux-promiser` (`HANDLE_SIMPLE_PROMISE`) must be used as the `type` property for the action. This `type` allows the middleware to know if the current action should be handling a promise.
* `promise` - The promise returned by an async function or API call.
* `handlerTypes` - An array of *String* containing the three different types of [*Flux Standard Action*](https://github.com/acdlite/flux-standard-action) known as the *request*, *success*, and *failure* actions.
**Note:** The types must be in order, first for the *request* action, second for the *success* action, and third for the *failure* action. e.g.`(['START', 'SUCCESS', 'FAILED'])`
* `payload` - An optional payload property. This will be used as a payload when the action *request* in the promise lifecycle is dispatched.

The following is a simple redux-promiser action:

```js
import Api from 'services/myApi';
import { HANDLE_SIMPLE_PROMISE } from 'redux-promiser'; // constant for '@redux-promiser/HANDLE_SIMPLE_PROMISE'

export function getUsers(params) {
  return {
    type: HANDLE_SIMPLE_PROMISE,
	promise: Api.getUsers(params),
	handlerTypes: ['START', 'SUCCESS', 'FAILED'], // You can specify any type you want.
  };
}
```

When the action is dispatched, `redux-promiser` middleware will:
1. Check the type of the action and handle it if it is a `HANDLE_SIMPLE_PROMISE` type.
2. Dispatch the an action with the first type specified in the `handlerTypes` property.
```js
{
	type: 'START',
	payload, // The optional payload
}
```
3. Handles the promise specified in the `promise` property.
4. If the promise is successful, an action using the second type will be dispatched with the promise's `data` as the `payload`.
```js
{
	type: 'SUCCESS'.
	payload: data,
}
```
5. If the promise returned an error, it will dispatch the third type.
```js
{
	type: 'FAILED',
	payload: error,
	error: true,
}
```
