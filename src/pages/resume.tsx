import React from 'react';
import { Helmet } from 'react-helmet';

import { css } from '@emotion/react';

import { Footer } from '../components/Footer';
import SiteNav from '../components/header/SiteNav';
import { ResumeContent } from '../components/ResumeContent';
import { Wrapper } from '../components/Wrapper';
import IndexLayout from '../layouts';
import {
  inner,
  outer,
  SiteArchiveHeader,
  SiteHeader,
  SiteMain,
  SiteNavMain,
} from '../styles/shared';
import { NoImage, PostFull, PostFullHeader, PostFullTitle } from '../templates/post';
import { colors } from '../styles/colors';

const PageTemplate = css`
  .site-main {
    margin-top: 64px;
    padding-bottom: 4vw;
    background: #fff;
  }

  @media (prefers-color-scheme: dark) {
    .site-main {
      /* background: var(--darkmode); */
      background: ${colors.darkmode};
    }
  }
`;

const About: React.FC = () => (
  <IndexLayout>
    <Helmet>
      <title>Résumé</title>
    </Helmet>

    <Wrapper css={PageTemplate}>
      <header className="site-archive-header no-image" css={[SiteHeader, SiteArchiveHeader]}>
        <div css={[outer, SiteNavMain]}>
          <div css={inner}>
            <SiteNav isHome={false} />
          </div>
        </div>
      </header>
      <main id="site-main" className="site-main" css={[SiteMain, outer]}>
        <div css={inner}>
          <article className="post page" css={[PostFull, NoImage]}>
            <PostFullHeader className="post-full-header">
              <PostFullTitle className="post-full-title">Résumé</PostFullTitle>
            </PostFullHeader>

            <div>
              <img src="https://user-images.githubusercontent.com/42150335/144174320-59bb3102-6adb-4b9c-a055-8f7d6ee614a2.png" />
            </div>
            <div>
              <img src="https://user-images.githubusercontent.com/42150335/144174328-b16fdd77-90ba-457b-b085-c4c010bb2221.png" />
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </Wrapper>
  </IndexLayout>
);

export default About;
