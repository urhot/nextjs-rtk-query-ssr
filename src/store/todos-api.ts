import { createApi } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { Todo } from '../interfaces/todo.interface';
import { axiosBaseQuery, AxiosBaseQueryArgs } from './axios-base-query';

export const todosApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com/',

    prepareHeaders: ({ extra: ctx }): { [key: string]: string } => {
      // helper function for detecting SSR
      const windowAvailable = () => !!(
        typeof window !== 'undefined' &&
          window.document &&
          window.document.createElement
      );

      if (windowAvailable()) { // not SSR?
        console.log('running on browser, skipping header manipulation');
        return {};
      }

      // find any cookies in the request
      let cookies: { [key: string]: string } = {};
      if ('req' in ctx &&
          ctx.req &&
          'cookies' in ctx.req &&
          ctx.req.cookies) {
        cookies = ctx.req.cookies;
      }

      // Build a cookie string from object
      const cookieValue = Object.entries(cookies)
        // .filter(([k]) => k === 'JSESSIONID') // only include relevant cookies
        .map(([k, v]) => `${k}=${v}`) // rfc6265
        .join('; ');
      console.log('figured out cookie value: ' + cookieValue);

      return { 'Cookie': cookieValue };
    },
  }),

  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },

  tagTypes: ['Todos'],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: (): AxiosBaseQueryArgs => ({ url: 'todos/', method: 'get' }),
      providesTags: ['Todos'],
    }),

    // NO-OP just to demonstrate fetching in frontend by invalidating cache
    invalidateTags: builder.mutation<boolean, boolean>({
      queryFn: () => {
        return { data: true };
      },
      invalidatesTags: ['Todos'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetTodosQuery,
  useInvalidateTagsMutation,
  util: { getRunningOperationPromises },
} = todosApi;

// export endpoints for use in SSR
export const { getTodos, invalidateTags } = todosApi.endpoints;
