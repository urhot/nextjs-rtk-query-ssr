import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { ReactElement } from 'react';
import { wrapper } from '../store/store';
import { getRunningOperationPromises, getTodos, useGetTodosQuery, useInvalidateTagsMutation } from '../store/todos-api';

const Home: NextPage = () => {

  // API call, should come from SSR on first page load
  const { data } = useGetTodosQuery();

  // We can use this to invalidate RTK cache and force API call on frontend
  const [ invalidateTags ] = useInvalidateTagsMutation();

  return (
    <div>
      <Head>
        <title>NextJS + Redux SSR test</title>
        <meta name="description" content="NextJS + Redux SSR test" />
      </Head>

      <main>
        <h1>
          Todo
        </h1>

        <button onClick={() => { invalidateTags(true); }}>
          Refresh
        </button>
        <ul>
          {(data ?? []).map(
            (todo) => {
              return (<li key={todo.id}>
                {todo.title}
              </li>) as ReactElement;
            })
          }
        </ul>
      </main>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    store.dispatch(getTodos.initiate());
    await Promise.all(getRunningOperationPromises());

    return {
      props: {},
    };
  }
);
