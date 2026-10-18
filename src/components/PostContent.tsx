import React from 'react';
import styled from '@emotion/styled';
import RehypeReact from 'rehype-react';

import { colors, monoStack } from '../styles/colors';

const renderAst = new RehypeReact({
  createElement: React.createElement,
  components: {},
}).Compiler;

const Ast = ({ ast, ...props }: any) => {
  ast.properties = props;
  return renderAst(ast);
};

export interface PostContentProps {
  htmlAst: any;
}

const PostContent: React.FC<PostContentProps> = ({ htmlAst }) => (
  <PostFullContent className="post-full-content">
    <Ast className="post-content" ast={htmlAst} />
  </PostFullContent>
);

export const PostFullContent = styled.section`
  position: relative;
  margin: 0 auto;
  max-width: 700px;
  min-height: 230px;
  color: ${colors.body};
  font-size: 1.7rem;
  line-height: 1.75;
  letter-spacing: -0.01em;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  ul,
  ol,
  dl,
  pre,
  blockquote,
  .post-full-comments,
  .footnotes {
    margin: 0 0 1.4em 0;
    min-width: 100%;
  }

  li {
    margin: 0 0 0.6em;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }

  li p {
    margin: 0;
  }

  a {
    color: ${colors.text};
    text-decoration: underline;
    text-decoration-color: rgba(3, 18, 40, 0.25);
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
    overflow-wrap: anywhere;
    transition: text-decoration-color 0.2s ease;
  }

  a:hover {
    text-decoration-color: ${colors.text};
  }

  strong {
    color: ${colors.text};
    font-weight: 700;
  }

  em {
    color: ${colors.text};
  }

  small {
    display: inline-block;
    line-height: 1.6em;
  }

  img,
  video {
    display: block;
    margin: 2em auto;
    max-width: 100%;
    height: auto;
    border-radius: 12px;
  }

  .gatsby-resp-image-wrapper {
    margin: 2em auto;
    overflow: hidden;
    border-radius: 12px;
  }

  .gatsby-resp-image-wrapper img {
    margin: 0;
    border-radius: 0;
  }

  /* images on one line in markdown → side by side (gatsby-remark-image-layout) */
  .image-row {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 12px;
    margin: 2em 0;
  }

  .image-row-item {
    flex: 1 1 0;
    min-width: 0;
  }

  .image-sized {
    margin: 2em auto;
    max-width: 100%;
  }

  .image-row-item img,
  .image-row-item .gatsby-resp-image-wrapper,
  .image-sized img,
  .image-sized .gatsby-resp-image-wrapper {
    margin: 0 !important;
    width: 100%;
  }

  img + br + small {
    display: block;
    margin-top: -1.6em;
    margin-bottom: 1.6em;
    color: ${colors.subtle};
    text-align: center;
  }

  iframe {
    margin: 0 auto !important;
  }

  blockquote {
    margin: 0 0 1.6em;
    padding: 16px 20px;
    color: ${colors.body};
    background: ${colors.surface};
    border-radius: 12px;
  }

  blockquote p {
    margin: 0 0 1em 0;
    color: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  blockquote p:last-child {
    margin-bottom: 0;
  }

  code {
    padding: 0.15em 0.4em;
    color: ${colors.body};
    font-family: ${monoStack};
    font-size: 0.9em;
    font-weight: 400 !important;
    background: rgba(2, 32, 71, 0.05);
    border-radius: 3px;
  }

  p code {
    word-break: break-all;
  }

  pre {
    overflow-x: auto;
    padding: 20px;
    max-width: 100%;
    color: ${colors.whitegrey};
    font-size: 1.4rem;
    line-height: 1.6;
    border-radius: 10px;
  }

  pre code {
    padding: 0;
    font-size: inherit;
    line-height: inherit;
    background: transparent;
  }

  pre code :not(span) {
    color: inherit;
  }

  .fluid-width-video-wrapper {
    margin: 1.5em 0 3em;
  }

  hr {
    margin: 3.2em auto;
    width: 64px;
    border-top: 1px solid ${colors.line};
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${colors.text};
    font-weight: 700;
    letter-spacing: -0.03em;
  }

  h1 {
    margin: 2em 0 0.6em;
    font-size: 3.2rem;
    line-height: 1.45;
  }

  h2 {
    margin: 2em 0 0.6em;
    font-size: 2.8rem;
    line-height: 1.5;
  }

  h3 {
    margin: 1.6em 0 0.5em;
    font-size: 2.2rem;
    line-height: 1.55;
  }

  h4,
  h5,
  h6 {
    margin: 1.6em 0 0.5em;
    font-size: 1.8rem;
    line-height: 1.5;
  }

  h1:first-child,
  h2:first-child,
  h3:first-child {
    margin-top: 0;
  }

  @media (max-width: 500px) {
    h1 {
      font-size: 2.5rem;
    }
    h2 {
      font-size: 2.2rem;
    }
    h3 {
      font-size: 1.9rem;
    }
  }

  table {
    display: block;
    overflow-x: auto;
    margin: 0.5em 0 2.5em;
    max-width: 100%;
    width: max-content;
    border-spacing: 0;
    border-collapse: collapse;
    font-size: 1.5rem;
    line-height: 1.6;
    -webkit-overflow-scrolling: touch;
  }

  table th {
    color: ${colors.text};
    font-weight: 600;
    text-align: left;
    background: ${colors.surface};
  }

  table th,
  table td {
    padding: 8px 14px;
    border: 1px solid ${colors.line};
  }

  @media (prefers-color-scheme: dark) {
    color: ${colors.darkBody};

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    strong,
    em {
      color: ${colors.darkText};
    }

    blockquote {
      color: ${colors.darkBody};
      background: ${colors.darkSurface};
    }

    a {
      color: ${colors.darkText};
      text-decoration-color: rgba(255, 255, 255, 0.3);
    }

    a:hover {
      text-decoration-color: ${colors.darkText};
    }

    code {
      color: ${colors.darkText};
      background: ${colors.darkSurface};
    }

    hr {
      border-top-color: ${colors.darkLine};
    }

    figcaption {
      color: ${colors.darkSubtle};
    }

    table th {
      color: ${colors.darkText};
      background: ${colors.darkSurface};
    }

    table th,
    table td {
      border-color: ${colors.darkLine};
    }
  }

  /* Start Syntax Highlighting */
  /* Taken from overreacted https://github.com/gaearon/overreacted.io/blob/942b41555f5e5ccbb5f93f6c26142cd90b314236/src/utils/global.css#L68 */
  code[class*='language-'],
  pre[class*='language-'] {
    color: white;
    background: none;
    font-family: ${monoStack};
    font-feature-settings: normal;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;
    margin-bottom: 0;

    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;

    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
  }

  /* Code blocks */
  pre[class*='language-'] {
    overflow: auto;
  }

  pre[class*='language-']::-moz-selection {
    /* Firefox */
    background: hsl(207, 4%, 16%);
  }

  pre[class*='language-']::selection {
    /* Safari */
    background: hsl(207, 4%, 16%);
  }

  /* Text Selection colour */
  pre[class*='language-']::-moz-selection,
  pre[class*='language-'] ::-moz-selection {
    text-shadow: none;
    background: hsla(0, 0%, 100%, 0.15);
  }

  pre[class*='language-']::selection,
  pre[class*='language-'] ::selection {
    text-shadow: none;
    background: hsla(0, 0%, 100%, 0.15);
  }

  /* Inline code */
  *:not(pre) > code[class*='language-'] {
    padding: 0.15em 0.4em;
    color: ${colors.body};
    font-size: 0.9em;
    white-space: normal;
    background: rgba(2, 32, 71, 0.05);
    border-radius: 3px;

    @media (prefers-color-scheme: dark) {
      color: ${colors.darkText};
      background: ${colors.darkSurface};
    }
  }

  .token.attr-name {
    color: rgb(173, 219, 103);
    font-style: italic;
  }

  .token.comment {
    color: rgb(128, 147, 147);
  }

  .token.string,
  .token.url {
    color: rgb(173, 219, 103);
  }

  .token.variable {
    color: rgb(214, 222, 235);
  }

  .token.number {
    color: rgb(247, 140, 108);
  }

  .token.builtin,
  .token.char,
  .token.constant,
  .token.function {
    color: rgb(130, 170, 255);
  }

  .token.punctuation {
    color: rgb(199, 146, 234);
  }

  .token.selector,
  .token.doctype {
    color: rgb(199, 146, 234);
    font-style: 'italic';
  }

  .token.class-name {
    color: rgb(255, 203, 139);
  }

  .token.tag,
  .token.operator,
  .token.keyword {
    color: #ffa7c4;
  }

  .token.boolean {
    color: rgb(255, 88, 116);
  }

  .token.property {
    color: rgb(128, 203, 196);
  }

  .token.namespace {
    color: rgb(178, 204, 214);
  }

  pre[data-line] {
    padding: 1em 0 1em 3em;
    position: relative;
  }

  .gatsby-highlight-code-line {
    background-color: hsla(207, 95%, 15%, 1);
    display: block;
    margin-right: -1.3125rem;
    margin-left: -1.3125rem;
    padding-right: 1em;
    padding-left: 1.25em;
    border-left: 0.25em solid #ffa7c4;
  }

  .gatsby-highlight {
    margin-bottom: 1.6em;
    border-radius: 10px;
    background: #011627;
    -webkit-overflow-scrolling: touch;
    overflow: auto;
  }

  .gatsby-highlight pre[class*='language-'] {
    float: left;
    min-width: 100%;
  }
  /* End Syntax Highlighting */
`;

export default PostContent;
