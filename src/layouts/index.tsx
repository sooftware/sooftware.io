import React from 'react';
import { Helmet } from 'react-helmet';
import { Global, css } from '@emotion/react';

import favicon from '../../src/favicon.ico';
import { colors, fontStack } from '../styles/colors';

interface IndexProps {
  className?: string;
}

const IndexLayout: React.FC<IndexProps> = props => (
  <div className={props.className}>
    <Helmet>
      <link rel="icon" href={favicon} type="image/x-icon" />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
      />
    </Helmet>
    <Global
      styles={css`
          html,
          body,
          div,
          span,
          applet,
          object,
          iframe,
          h1,
          h2,
          h3,
          h4,
          h5,
          h6,
          p,
          blockquote,
          pre,
          a,
          abbr,
          acronym,
          address,
          big,
          cite,
          code,
          del,
          dfn,
          em,
          img,
          ins,
          kbd,
          q,
          s,
          samp,
          small,
          strike,
          strong,
          sub,
          sup,
          tt,
          var,
          dl,
          dt,
          dd,
          ol,
          ul,
          li,
          fieldset,
          form,
          label,
          legend,
          table,
          caption,
          tbody,
          tfoot,
          thead,
          tr,
          th,
          td,
          article,
          aside,
          canvas,
          details,
          embed,
          figure,
          figcaption,
          footer,
          header,
          hgroup,
          menu,
          nav,
          output,
          ruby,
          section,
          summary,
          time,
          mark,
          audio,
          video {
            margin: 0;
            padding: 0;
            border: 0;
            font: inherit;
            font-size: 100%;
            vertical-align: baseline;
          }
          body {
            line-height: 1;
          }
          ol,
          ul {
            list-style: none;
          }
          blockquote,
          q {
            quotes: none;
          }
          blockquote:before,
          blockquote:after,
          q:before,
          q:after {
            content: '';
            content: none;
          }
          table {
            border-spacing: 0;
            border-collapse: collapse;
          }
          img {
            max-width: 100%;
          }
          html {
            box-sizing: border-box;
            font-family: sans-serif;

            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
          }
          *,
          *:before,
          *:after {
            box-sizing: inherit;
          }
          a {
            background-color: transparent;
          }
          a:active,
          a:hover {
            outline: 0;
          }
          b,
          strong {
            font-weight: bold;
          }
          i,
          em,
          dfn {
            font-style: italic;
          }
          h1 {
            margin: 0.67em 0;
            font-size: 2em;
          }
          small {
            font-size: 80%;
          }
          sub,
          sup {
            position: relative;
            font-size: 75%;
            line-height: 0;
            vertical-align: baseline;
          }
          sup {
            top: -0.5em;
          }
          sub {
            bottom: -0.25em;
          }
          img {
            border: 0;
          }
          svg:not(:root) {
            overflow: hidden;
          }
          mark {
            background-color: #fdffb6;
          }
          code,
          kbd,
          pre,
          samp {
            font-family: monospace, monospace;
            font-size: 1em;
          }
          button,
          input,
          optgroup,
          select,
          textarea {
            margin: 0;
            color: inherit;
            font: inherit;
          }
          button {
            overflow: visible;
            border: none;
          }
          button,
          select {
            text-transform: none;
          }
          button,
          html input[type='button'],
          input[type='reset'],
          input[type='submit'] {
            cursor: pointer;

            -webkit-appearance: button;
          }
          button[disabled],
          html input[disabled] {
            cursor: default;
          }
          button::-moz-focus-inner,
          input::-moz-focus-inner {
            padding: 0;
            border: 0;
          }
          input {
            line-height: normal;
          }
          input:focus {
            outline: none;
          }
          input[type='checkbox'],
          input[type='radio'] {
            box-sizing: border-box;
            padding: 0;
          }
          input[type='number']::-webkit-inner-spin-button,
          input[type='number']::-webkit-outer-spin-button {
            height: auto;
          }
          input[type='search'] {
            box-sizing: content-box;

            -webkit-appearance: textfield;
          }
          input[type='search']::-webkit-search-cancel-button,
          input[type='search']::-webkit-search-decoration {
            -webkit-appearance: none;
          }
          legend {
            padding: 0;
            border: 0;
          }
          textarea {
            overflow: auto;
          }
          table {
            border-spacing: 0;
            border-collapse: collapse;
          }
          td,
          th {
            padding: 0;
          }

          html {
            overflow-x: hidden;
            overflow-y: scroll;
            font-size: 62.5%;

            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          }
          body {
            overflow-x: hidden;
            color: ${colors.body};
            font-family: ${fontStack};
            font-size: 1.6rem;
            line-height: 1.7;
            font-weight: 400;
            font-style: normal;
            letter-spacing: -0.01em;
            word-break: keep-all;
            overflow-wrap: break-word;
            text-rendering: optimizeLegibility;
            background: #fff;

            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          ::selection {
            text-shadow: none;
            background: #e8e8e8;
          }

          hr {
            position: relative;
            display: block;
            width: 100%;
            margin: 2.5em 0 3.5em;
            padding: 0;
            height: 1px;
            border: 0;
            border-top: 1px solid ${colors.line};
          }

          audio,
          canvas,
          iframe,
          img,
          svg,
          video {
            vertical-align: middle;
          }

          textarea {
            resize: vertical;
          }

          p,
          ul,
          ol,
          dl,
          blockquote {
            margin: 0 0 1.5em 0;
          }

          ol,
          ul {
            padding-left: 1.3em;
            padding-right: 1.5em;
          }

          ol ol,
          ul ul,
          ul ol,
          ol ul {
            margin: 0.5em 0 1em;
          }

          ul {
            list-style: disc;
          }

          ol {
            list-style: decimal;
          }

          ul,
          ol {
            max-width: 100%;
          }

          li {
            margin: 0.4em 0;
            padding-left: 0.3em;
          }

          dt {
            float: left;
            margin: 0 20px 0 0;
            width: 120px;
            color: ${colors.text};
            font-weight: 500;
            text-align: right;
          }

          dd {
            margin: 0 0 5px 0;
            text-align: left;
          }

          blockquote {
            margin: 1.5em 0;
            padding: 0 1.6em;
            border-left: ${colors.line} 3px solid;
          }

          a {
            color: ${colors.text};
            text-decoration: none;
          }

          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            margin-top: 0;
            color: ${colors.text};
            line-height: 1.3;
            font-weight: 700;
            letter-spacing: -0.025em;
            text-rendering: optimizeLegibility;
          }

          h1 {
            margin: 0 0 0.5em 0;
            font-size: 4.4rem;
          }
          @media (max-width: 500px) {
            h1 {
              font-size: 2.8rem;
            }
          }

          h2 {
            margin: 1.5em 0 0.5em 0;
            font-size: 2.4rem;
          }
          @media (max-width: 500px) {
            h2 {
              font-size: 2rem;
            }
          }

          h3 {
            margin: 1.5em 0 0.5em 0;
            font-size: 1.9rem;
            font-weight: 600;
          }

          h4,
          h5,
          h6 {
            margin: 1.5em 0 0.5em 0;
            font-size: 1.6rem;
            font-weight: 600;
          }

          @media (prefers-color-scheme: dark) {
            body {
              color: ${colors.darkBody};
              background: ${colors.darkmode};
            }
            h1,
            h2,
            h3,
            h4,
            h5,
            h6,
            a {
              color: ${colors.darkText};
            }
            hr {
              border-top-color: ${colors.darkLine};
            }
            ::selection {
              background: rgba(255, 255, 255, 0.2);
            }
            img {
              opacity: 0.92;
            }
          }
        `}
    />
    {props.children}
  </div>
);

export default IndexLayout;
