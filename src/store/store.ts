import { Context, createWrapper } from 'next-redux-wrapper';
import { configureStore, ImmutableStateInvariantMiddlewareOptions, SerializableStateInvariantMiddlewareOptions } from '@reduxjs/toolkit';
import { todosApi } from './todos-api';

// ThunkOptions not exported in getDefaultMiddleware, so we have a copy here
interface MyThunkOptions<E> {
    extraArgument: E;
}

// GetDefaultMiddlewareOptions in getDefaultMiddleware does not allow
// providing type for ThunkOptions, so here is our custom version
// https://redux-toolkit.js.org/api/getDefaultMiddleware#api-reference
interface MyDefaultMiddlewareOptions {
    thunk?: boolean | MyThunkOptions<Context>;
    immutableCheck?: boolean | ImmutableStateInvariantMiddlewareOptions;
    serializableCheck?: boolean | SerializableStateInvariantMiddlewareOptions;
}

export const makeStore = (ctx: Context) => {
  return configureStore({
    reducer: {
      [todosApi.reducerPath]: todosApi.reducer,
    },
    middleware: (gDM) =>
      gDM<MyDefaultMiddlewareOptions>({
        thunk: {
          // https://github.com/reduxjs/redux-toolkit/issues/2228#issuecomment-1095409011
          extraArgument: ctx
        }
      })
      .concat(todosApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const wrapper = createWrapper<AppStore>(makeStore, { debug: true });
