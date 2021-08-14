import React from 'react';
import Document, {DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript} from 'next/document';
import {ServerStyleSheets} from '@material-ui/core/styles';
import {RenderPageResult} from 'next/dist/shared/lib/utils';


export default class MyDocument extends Document {

  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
        </Head>
        <body>
        <Main/>
        <NextScript/>
        </body>
      </Html>
    );
  }
}
MyDocument.getInitialProps = async (ctx: DocumentContext): Promise<DocumentInitialProps> => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage: RenderPageResult | Promise<RenderPageResult> = ctx.renderPage();
  const initialProps = await Document.getInitialProps(ctx);

  ctx.renderPage = () => {
    // @ts-ignore
    return originalRenderPage({
      enhanceApp: (App: any) => (props: any) => sheets.collect(<App {...props}/>)
    });
  };


  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement()
    ]
  };
};
//as RenderPageResult