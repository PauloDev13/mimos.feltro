import React from 'react';
import Document, {DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript} from 'next/document';
import {ServerStyleSheets} from '@material-ui/core/styles';
import {RenderPageResult} from 'next/dist/shared/lib/utils';

export default class MyDocument extends Document {

  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head/>
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
  const initialProps = await Document.getInitialProps(ctx);
  const originalRenderPage = ctx.renderPage();

  //return await Document.getInitialProps(ctx);
  ctx.renderPage = (): RenderPageResult | Promise<RenderPageResult> => {
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
  } as RenderPageResult;
};