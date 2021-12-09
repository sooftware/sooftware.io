import React from 'react';
import { Helmet } from 'react-helmet';

import { css } from '@emotion/react';

import { Footer } from '../components/Footer';
import SiteNav from '../components/header/SiteNav';
import { NewsContent } from '../components/NewsContent';
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
      <title>NEWS</title>
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
              <PostFullTitle className="post-full-title">NEWS</PostFullTitle>
            </PostFullHeader>

            <NewsContent className="news-content">
              <div className="post-content">
                <p>
                  <li><b>2021.12</b> I got a IITP President's Award. (AI Grand Challenge)</li>
                  <li><b>2021.11</b> I ranked 3rd place in the 2021 AI Grand Challenge - Speech Recognition Track</li>
                  <li><b>2021.11</b> TUNiB has raised a seed investment! <a href="https://platum.kr/archives/175048">[link]</a></li>
                  <li><b>2021.10</b> I attended <a href="https://www.soscon.net/">2021 SSDC (Samsung Software Developer Conference)</a> as a presenter and presented about TUNiB-Electa. <a href="https://www.youtube.com/watch?v=OglqDo44zpQ&t=467s">[link]</a></li>
                  <li><b>2021.09</b> We released <a href="https://github.com/tunib-ai/tunib-electra">TUNiB Electra</a> model.</li>
                  <li><b>2021.08</b> I attended <a href="https://github.com/songys/2021Langcon">2021 LangCon</a> as a presenter and presented about Korean speech recognition. <a href="https://www.youtube.com/watch?v=OglqDo44zpQ&t=467s">[link]</a></li>
                  <li><b>2021.07</b> I presented the know-how of winning the 2021 AI online competition. <a href="https://www.youtube.com/watch?v=aKKDvdel5O4&t=382s">[link]</a></li>
                  <li><b>2021.07</b> I won <b>1st place</b> in the <a href="https://www.aiconnect.kr/main/competition/detail/194/competitionInfo">2021 AI Online Competition</a> - Conversation Sentiment Classification Track.</li>
                  <li><b>2021.06</b> I released a speech recognition open-source named <a href="https://github.com/openspeech-team/openspeech">openspeech</a>.</li>
                  <li><b>2021.03</b> My colleagues and I founded new startup named <a href="http://tunib.ai">TUNiB</a>.</li>
                  <li><b>2021.02</b> I finally graduated from university!</li>
                  <li><b>2021.02</b> I left <a href="https://www.kakaobrain.com/">Kakao Brain</a>.</li>
                  <li><b>2021.02</b> Our project, <a href="https://github.com/kakaobrain/pororo">PORORO: Platform Of neuRal mOdels for natuRal language prOcessing</a> is released to GitHub.</li>
                  <li><b>2021.02</b> Our paper, <a href="https://www.sciencedirect.com/science/article/pii/S2665963821000026">Open-source toolkit for end-to-end Korean speech recognition</a> is published to <a href="https://www.elsevier.com/journals/software-impacts/2665-9638/guide-for-authors">ELSEVIER, SIMPAC</a>.</li>
                  <li><b>2020.11</b> I was converted to a full-time employee of <a href="https://www.kakaobrain.com/">Kakao Brain</a>.</li>
                  <li><b>2020.11</b> I got a <b>president's award (1st place)</b> at Kwangwoon Engineering Festival.</li>
                  <li><b>2020.08</b> I joined <a href="https://www.kakaobrain.com/">Kakao Brain</a>'s natural language processing team as an intern.</li>
                  <li><b>2020.08</b> I left <a href="https://speech.sogang.ac.kr/">spoken language lab of Sogang University</a>.</li>
                  <li><b>2020.04</b> I joined the <a href="https://speech.sogang.ac.kr/">spoken language lab of Sogang University</a> as an undergraduate researcher.</li>
                  <li><b>2020.03</b> I released a Korean speech recognition open-source named <a href="https://github.com/sooftware/kospeech">KoSpeech</a>.</li>
                  <li><b>2020.02</b> I received a samsong scholarship!</li>
                  <li><b>2019.10</b> I ranked 12th out of 100 people in <a href="https://campaign.naver.com/aihackathon_speech/">Naver AI Hackathon.</a></li>
                  <li><b>2019.05</b> I have a girlfriend!</li>
                  <li><b>2019.03</b> I received an excellent academic scholarship!</li>
                  <li><b>2019.02</b> I received a samsong scholarship at university!</li>
                  <li><b>2018.09</b> I received an excellent academic scholarship at university!</li>
                  <li><b>2018.03</b> I received an excellent academic scholarship at university!</li>
                  <li><b>2017.06</b> I was discharged from the <a href="http://www.rokmc.mil.kr/">Republic of Korean Marine Corps.</a></li>
                  <li><b>2016.12</b> We placed <b>2nd</b> in the 2016 2nd Marine Division Communications Contest!</li>
                  <li><b>2015.12</b> We won <b>1st place</b> in the 2015 2nd Marine Division Communication Contest!</li>
                  <li><b>2015.09</b> I joined the <a href="http://www.rokmc.mil.kr/">Republic of Korean Marine Corps.</a></li>
                  <li><b>2014.03</b> I entered <a href="https://www.kw.ac.kr/">Kwangwoon University</a>!</li>
                </p>
              </div>
            </NewsContent>
          </article>
        </div>
      </main>
      <Footer />
    </Wrapper>
  </IndexLayout>
);

export default About;
