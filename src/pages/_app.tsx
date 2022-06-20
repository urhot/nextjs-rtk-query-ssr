import '../../styles/globals.css';
import type { AppProps } from 'next/app';
import { FC } from 'react';
import { wrapper } from '../store/store';

const MyApp: FC<AppProps> = ({ Component, pageProps }) =>
  <Component {...pageProps} />;

export default wrapper.withRedux(MyApp);
