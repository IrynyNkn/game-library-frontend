import { Html, Head, Main, NextScript } from 'next/document';
import Modal from 'react-modal';

Modal.setAppElement('#modals');

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <div id="modals" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
