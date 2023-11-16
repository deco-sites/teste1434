import { asset, Head } from "$fresh/runtime.ts";

function GlobalTags() {
  return (
    <Head>
      {/* Enable View Transitions API */}
      <meta name="view-transition" content="same-origin" />

      {/* Tailwind v3 CSS file */}
      <link href={asset("/styles.css")} rel="stylesheet" />

      {/* Web Manifest */}
      <link rel="manifest" href={asset("/site.webmanifest")} />

      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      {/* @ts-ignore */}
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />

      {/* Fonts Load */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @font-face {
            font-family: 'TT Norms';
            src: url(${asset("/fonts/TTNorms-BoldItalic.woff2")}) format('woff2'),
                url(${asset("/fonts/TTNorms-BoldItalic.woff")}) format('woff');
            font-weight: bold;
            font-style: italic;
            font-display: swap;
        }
        
        @font-face {
            font-family: 'TT Norms';
            src: url(${asset("/fonts/TTNorms-Bold.woff2")}) format('woff2'),
                url(${asset("/fonts/TTNorms-Bold.woff")}) format('woff');
            font-weight: bold;
            font-style: normal;
            font-display: swap;
        }
        
        @font-face {
            font-family: 'TT Norms';
            src: url(${asset("/fonts/TTNorms-Light.woff2")}) format('woff2'),
                url(${asset("/fonts/TTNorms-Light.woff")}) format('woff');
            font-weight: 300;
            font-style: normal;
            font-display: swap;
        }
        
        @font-face {
            font-family: 'TT Norms';
            src: url(${asset("/fonts/TTNorms-Regular.woff2")}) format('woff2'),
                url(${asset("/fonts/TTNorms-Regular.woff")}) format('woff');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }

        @font-face {
            font-family: 'TT Norms';
            src: url(${asset("/fonts/TTNorms-Medium.otf")}) format("opentype"),
                url(${asset("/fonts/TTNorms-Medium.otf")}) format("opentype");
            font-weight: 500;
            font-style: normal;
            font-display: swap;
        }
        
        @font-face {
            font-family: 'TT Norms';
            src: url(${asset("/fonts/TTNorms-Black.woff2")}) format('woff2'),
                url(${asset("/fonts/TTNorms-Black.woff")}) format('woff');
            font-weight: 900;
            font-style: normal;
            font-display: swap;
        }
        
        @font-face {
            font-family: 'TT Norms';
            src: url(${asset("/fonts/TTNorms-BlackItalic.woff2")}) format('woff2'),
                url(${asset("/fonts/TTNorms-BlackItalic.woff")}) format('woff');
            font-weight: 900;
            font-style: italic;
            font-display: swap;
        }
        
        @font-face {
            font-family: 'TT Norms';
            src: url(${asset("/fonts/TTNorms-Italic.woff2")}) format('woff2'),
                url(${asset("/fonts/TTNorms-Italic.woff")}) format('woff');
            font-weight: normal;
            font-style: italic;
            font-display: swap;
        }
        
        
      `,
        }}
      ></style>
    </Head>
  );
}

export default GlobalTags;
