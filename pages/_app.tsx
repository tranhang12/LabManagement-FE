import React, { Suspense } from "react";
import { Provider } from "react-redux";
import store from "src/store/index";
import "../styles/custom.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { NotificationSubscriber } from "../components/Notification";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Suspense fallback={<div>Loading...</div>}>
      <Provider store={store}>
      <ToastContainer />
        <NotificationSubscriber />
        <Component {...pageProps} />
      </Provider>
      </Suspense>
    </>
  );
}
export default MyApp;
