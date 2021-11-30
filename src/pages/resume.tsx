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
      <title>RESUME</title>
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
              <PostFullTitle className="post-full-title">RESUME</PostFullTitle>
            </PostFullHeader>

            <img src={ require('../content/resume/img.png') } />

            <ResumeContent className="resume-content">
              <div className="post-content">
                <h4><span>Pro</span>file</h4>
                <hr></hr>
                  <p>
                  <ul>
                  <li><b>Basic Information</b>
                    <ul>
                      <li><b>Name</b> : Soohwan Kim</li>
                      <li><b>Nation</b> : Republic of Korea</li>
                      <li><b>Birth</b> : 1995.10.11</li>
                    </ul>
                  </li>
                    <li><b>Professional Information</b>
                    <ul>
                      <li><b>Job</b> : AI Engineer</li>
                      <li><b>Company</b> : TUNiB</li>
                    </ul>
                  </li>
                  <li><b>Education Information</b>
                    <ul>
                      <li><b>University</b> : Kwangwoon University</li>
                      <li><b>Degree</b> : Bachelor of Engineering</li>
                      <li><b>Major</b> : Electronics & Communication Engineering</li>
                      <li><b>Minor</b> : Data Science</li>
                    </ul>
                  </li>
                  <li><b>Social Information</b>
                    <ul>
                      <li><b>GitHub</b> : www.github.com/sooftware</li>
                      <li><b>Blog</b> : www.sooftware.io</li>
                      <li><b>Facebook</b> : www.facebook.com/sooftware95</li>
                      <li><b>Linked-In</b> : www.linkedin.com/in/Soo-hwan</li>
                      <li><b>E-mail</b> : sh951011@gmail.com</li>
                    </ul>
                  </li>
                  </ul>
                </p>

                <br></br>

                <h4><span>Pro</span>fessional Experience</h4>
                <hr></hr>
                <h5>TUNiB</h5>
                <p>
                  <i>Co-founder, AI Engineer (2021.03 ~ Present) - <span>Gangnam, Republic of Korea</span></i>
                  <ul>
                    <li>The start-up that founded in March 2021 with my former Kakao Brain team members.</li>
                    <li>Research and development of A.I. that enables human-like conversation.</li>
                    <li>Topics on Natural Language Processing
                      <ul>
                        <li>Developing Large Scale Language Model for Korean</li>
                        <li>Development of Korean Text-To-Speech model.</li>
                        <li>Development of Korean-English bilingual electra models <a href="https://github.com/tunib-ai/tunib-electra">[GitHub]</a>, <a href="https://tunib.notion.site/TECH-2021-09-18-TUNiB-Electra-3eba9f55859d4992a085a64c600dc150">[Tech Blog]</a></li>
                        <li>Establishment of Korean corpus in the tera-byte unit.</li>
                        <li>Developing Dialogue-Safety Module & Hate Speech Highlight Module.</li>
                        <li>Conversation Sentiment Classification - 2021 AI Online Competition (1st Ranked) <a href="https://www.youtube.com/watch?v=aKKDvdel5O4&t=472s">[Presentation]</a></li>
                        <li>Big Model Tuning (fine-tuning, prefix-tuning, p-tuning)</li>
                        <li>TV Character Chatbot</li>
                      </ul>
                    </li>
                    <li>Homepage: http://www.tunib.ai</li>
                  </ul>
                </p>

                <h5>Kakao Brain</h5>
                <p>
                  <i>AI Engineer (2020.11 ~ 2021.02) - <span>Pangyo, Republic of Korea</span></i>
                  <ul>
                    <li>Speech and natural language processing team.</li>
                    <li>Team Leader : <a href="https://www.linkedin.com/in/kyubyongpark/?originalSubdomain=kr">Kyubyong Park</a></li>
                    <li>Research and development the latest NLP & Speech technology.</li>
                    <li>Topics on Natural Language Processing
                      <ul>
                        <li>PORORO: Platform Of neuRal mOdels for natuRal language prOcessing <a href="https://github.com/kakaobrain/pororo">[GitHub]</a></li>
                        <li>NLP Paper Reading <a href="https://github.com/kakaobrain/nlp-paper-reading">[GitHub]</a></li>
                      </ul>
                    </li>
                    <li>Topics on Speech Processing
                      <ul>
                        <li>Multilingual Text To Speech <a href="https://pororo-tts.github.io/">[Demo]</a></li>
                        <li>Speech Recognition using Wav2vec 2.0 (English, Chinese, and Korean) <a href="https://kakaobrain.github.io/pororo/miscs/asr.html">[Docs]</a></li>
                      </ul>
                    </li>
                    <li>Homepage: https://www.kakaobrain.com</li>
                  </ul>
                </p>

                <br></br>
                <h4><span>Int</span>ernship</h4>
                <hr></hr>

                <h5>Kakao Brain</h5>
                <p>
                  <i>Research Intern (2020.08 ~ 2020.10) - <span>Pangyo, Republic of Korea</span></i>
                  <ul>
                    <li>Speech and natural language processing team.</li>
                    <li>Team Leader : <a href="https://www.linkedin.com/in/kyubyongpark/?originalSubdomain=kr">Kyubyong Park</a></li>
                    <li>Internship Project
                      <ul>
                        <li>Chinese speech recognition using Wav2vec 2.0</li>
                        <li>Korean speech recognition using Wav2vec 2.0</li>
                        <li>Experiment on English speech recognition (Listen, Attend Spell, Transformer, Wav2vec 2.0)</li>
                      </ul>
                    </li>
                    <li>Homepage: https://www.kakaobrain.com</li>
                  </ul>
                </p>

                <h5>Spoken Language Lab</h5>
                <p>
                  <i>Undergraduate Researcher (2020.04 ~ 2020.08) - <span>Mapo, Republic of Korea</span></i>
                  <ul>
                    <li>Department of Computer Science & Engineering, Sogang University</li>
                    <li>Academic Advisor : <a href="https://speech.sogang.ac.kr/speech/4240.html">Jihwan Kim</a></li>
                    <li>Topics on Speech Processing
                      <ul>
                        <li>Conduct <b>KoSpeech</b> projects with GPU supports</li>
                        <li>Conduct teaching assistant role in the <b>Samsung AI Expert Course - speech recognition</b> session.</li>
                        <li>Create 'Speech Recognition using Hidden Markov Model (HMM)' lecture materials</li>
                      </ul>
                    </li>
                  </ul>
                  <li>Homepage: https://speech.sogang.ac.kr</li>
                </p>

                <h5>Samsung Multi-Campus</h5>
                <p>
                  <i>Credit-linked short-term Internship (2018.07 ~ 2018.08) - <span>Gangnam, Republic of Korea</span></i>
                  <ul>
                    <li>Taking software development training using Java and Database.</li>
                    <li>Got the Outstanding Award among the trainees.</li>
                    <li>Project
                      <ul>
                        <li>Fast food restaurant order automatic calculation program</li>
                        <li>Java and Database (oracle)</li>
                      </ul>
                    </li>
                  </ul>
                  <li>Homepage: https://www.multicampus.com</li>
                </p>

                <br></br>
                <h4><span>Edu</span>cation</h4>
                <hr></hr>

                <h5>Kwangwoon University</h5>
                <p>
                  <i>Bachelor of Engineering - <span>Seoul, Republic of Korea</span></i>
                  <ul>
                    <li>Major in Electronics & Communication Engineering</li>
                    <li>Minor in Data Science</li>
                    <li>Major GPA : 3.90 / 4.5, Total GPA : 3.67 / 4.5</li>
                    <li>Scholarship
                      <ul>
                        <li>Samsong Scholarship (2019, 2020)</li>
                        <li>Academic Excellence Scholarship (2018-Spring, 2018-Fall, 2019-Spring)</li>
                      </ul>
                    </li>
                    <li>Honors
                      <ul>
                        <li>President's Award - 1st place (Kwangwoon Engineering Fesitival)</li>
                        <li>People's Choice Award (Kwangwoon Engineering Festival, Startup Idea Contest)</li>
                        <li>Outstanding Award (Multi-Campus)</li>
                        <li>School Representative (SKT-5G based Convergence Idea Contest)</li>
                      </ul>
                    </li>
                  </ul>
                </p>

                <br></br>
                <h4><span>Awa</span>rds</h4>
                <hr></hr>

                <h5>2021 AI Online Competition</h5>
                <p>
                  <i>1st Ranked  - <span>MSIT & NIPA</span></i>
                  <ul>
                    <li>Conversation Sentiment Classification Track</li>
                    <li>Information and Communication Industry Promotion Agency President Award</li>
                    <li>Related Articles: <a href="https://m.etnews.com/20210715000270">[article1]</a>, <a href="http://www.aitimes.com/news/articleView.html?idxno=139557">[article2]</a></li>
                    <li><a href="https://www.youtube.com/watch?v=aKKDvdel5O4&t=475s">[Presentation]</a>, <a href="https://tunib.notion.site/TECH-2021-07-12-TUNiB-ranked-1st-in-2021-AI-Online-Competition-3d615dcbb7cc4c1090f3146fe9113621">[Tech Blog]</a></li>
                  </ul>
                </p>

                <h5>2020 Kwangwoon Engineering Festival</h5>
                <p>
                  <i>1st Ranked  - <span>Kwangwoon University</span></i>
                  <ul>
                    <li>Kwangwoon University President's Award</li>
                    <li><a href="https://www.youtube.com/watch?v=APCz1BIfRLE&t=4s">[Presentation]</a></li>
                  </ul>
                </p>

                <h5>2020 AI Grand Challenge</h5>
                <p>
                  <i>3rd Ranked  - <span>MSIT & IITP</span></i>
                  <ul>
                    <li>Speech Recognition Track</li>
                  </ul>
                </p>

                <h5>2019 Naver AI Hackathon</h5>
                <p>
                  <i>12th Ranked  - <span>Naver</span></i>
                  <ul>
                    <li>Finalist - 12th Ranked (12/100)</li>
                    <li><a href="https://campaign.naver.com/aihackathon_speech/">[Homepage]</a>, <a href="https://github.com/sooftware/Naver-AI-Hackathon-Speech">[GitHub]</a></li>
                  </ul>
                </p>

                <br></br>
                <h4><span>Pre</span>sentation</h4>
                <hr></hr>

                <h5>[2021 SSDC] The development process of the TUNiB Electra model.</h5>
                <p>
                  <li>Samsung Software Developer Conference: <a href="https://www.soscon.net/ssdc2021">[link]</a></li>
                </p>

                <h5>[2021 LangCon] Korean Speech Recognition</h5>
                <p>
                  <li>Presentation video: <a href="https://www.youtube.com/watch?v=OglqDo44zpQ&t=458s">[link]</a></li>
                </p>

                <h5>[2021 Pangyo AI Camp] Know-how to win the 2021 AI online competition</h5>
                <p>
                  <li>Homepage: <a href="https://www.aiconnect.kr/main/competition/detail/198/competitionInfo">[link]</a></li>
                </p>

                <h5>[2021 AI Online Competition] Know-how to win the AI online competition</h5>
                <p>
                  <li>Presentation video: <a href="https://www.youtube.com/watch?time_continue=456&v=aKKDvdel5O4&feature=emb_logo">[link]</a></li>
                </p>

                <br></br>
                <h4><span>Pro</span>ject</h4>
                <hr></hr>

                <h5>TUNiB Electra</h5>
                <p>
                  <i>Team Leader (2021.08 ~ 2021.09) - <span>TUNiB</span></i>
                  <ul>
                    <li>Establishment of 200GB of Korean-English corpus.</li>
                    <li>Released two version of ELECTRA models
                      <ul>
                        <li>Korean-English bilingual Model (base/small)</li>
                        <li>Korean-only Model (base/small)</li>
                      </ul>
                    </li>
                    <li><a href="https://github.com/tunib-ai/tunib-electra">[GitHub]</a>, <a href="https://huggingface.co/tunib/electra-ko-en-base">[Huggingface]</a>, <a href="https://tunib.notion.site/TECH-2021-09-18-TUNiB-Electra-3eba9f55859d4992a085a64c600dc150">[Tech Blog]</a></li>
                  </ul>
                </p>

                <h5>OpenSpeech (200+ ⭐)️</h5>
                <p>
                  <i>Team Leader (2021.05 ~ Present) - <span>OpenSpeech Team</span></i>
                  <ul>
                    <li>Framework that enables easy creation of speech recognition models of various models and languages.</li>
                    <li>Dozens of models including Conformer, ContextNet, Transformer, and Listen Attend Spell, and etc.</li>
                    <li><a href="https://github.com/openspeech-team/openspeech">[GitHub]</a>, <a href="https://openspeech-team.github.io/openspeech/">[Docs]</a></li>
                  </ul>
                </p>

                <h5>Pororo (1k+ ⭐)</h5>
                <p>
                  <i>Team Member (2020.08 ~ 2021.02) - <span>Kakao Brain</span></i>
                  <ul>
                    <li>PORORO: Platform Of neuRal mOdels for natuRal language prOcessing</li>
                    <li>Library that can solve more than 30 NLP tasks in just 3-4 lines with pre-trained models.</li>
                    <li>Development automatic speech recognition, multilingual text-to-speech task.</li>
                    <li><a href="https://github.com/kakaobrain/pororo">[GitHub]</a>, <a href="https://kakaobrain.github.io/pororo/">[Docs]</a></li>
                  </ul>
                </p>

                <h5>Multilingual Text-To-Speech</h5>
                <p>
                  <i>Lead Development (2020.11 ~ 2021.02) - <span>Kakao Brain</span></i>
                  <ul>
                    <li>Development of Kakao Brain's TTS technology.</li>
                    <li>Support 11 languages, cross-lingual voice style transfer, code-switching.</li>
                    <li>Languages: English, Chinese, Korean, Japanese, French, German, Dutch, Finnish, Spanish, Russian, Jejueo.</li>
                    <li><a href="https://pororo-tts.github.io">[Demo]</a>, <a href="https://kakaobrain.github.io/pororo/miscs/tts.html">[Docs]</a></li>
                  </ul>
                </p>

                <h5>Speech Recognition using Wav2vec 2.0</h5>
                <p>
                  <i>Lead Development (2020.08 ~ 2020.11) - <span>Kakao Brain</span></i>
                  <ul>
                    <li>Development of Kakao Brain's ASR technology.</li>
                    <li>Languages: English, Chinese, Korean</li>
                    <li>Perform Wav2vec 2.0 pre-training, fine-tuning, etc.</li>
                    <li><a href="https://kakaobrain.github.io/pororo/miscs/asr.html">[Docs]</a></li>
                  </ul>
                </p>

                <h5>KoSpeech (300+ ⭐)</h5>
                <p>
                  <i>Team Leader (2020.01 ~ 2021.02) - <span>Personal</span></i>
                  <ul>
                    <li>Framework for making speech recognizers specialized in Korean easily.</li>
                    <li>Support models: Conformer, Transformer, Jasper, Listen Attend Spell, DeepSpeech2 etc.</li>
                    <li>Perform Wav2vec 2.0 pre-training, fine-tuning, etc.</li>
                    <li><a href="https://github.com/sooftware/kospeech">[GitHub]</a>, <a href="https://sooftware.github.io/kospeech/">[Docs]</a></li>
                  </ul>
                </p>

                <br></br>
                <h4><span>Ext</span>racurricular Activity</h4>
                <hr></hr>

                <h5>Speech Paper Reading</h5>
                <p>
                  <li>Weekly speech processing paper reading study</li>
                  <li>Notes: <a href="https://github.com/speech-paper-reading/speech-paper-reading">[link]</a></li>
                </p>

                <h5>NLP Paper Reading</h5>
                <p>
                  <li>Kakao Brain Natural Language Processing Team's weekly paper reading study</li>
                  <li>Notes: <a href="https://github.com/kakaobrain/nlp-paper-reading">[link]</a></li>
                </p>

                <h5>Technical Blog</h5>
                <p>
                  <li>Technical posting of deep learning, programming, signal processing, paper review etc.</li>
                  <li>Blog: <a href="https://sooftware.io">[link]</a></li>
                </p>

                <br></br>
                <h4><span>Ski</span>lls</h4>
                <hr></hr>

                <p>
                  <li><b>Programming Language</b> : Python, Jave, C, Shell-Script, SQL, Android, HTML</li>
                  <li><b>Deep Learning Framework</b> : PyTorch, PyTorch-Lightning, Tensorflow2 (with Keras)</li>
                  <li><b>NLP Library</b> : Fairseq, Transformers, Tokenizers, Pororo, NLTK, SentencePiece, re</li>
                  <li><b>Python Library</b> : Numpy, Pandas, Ray, Streamlit, Hydra, Wandb</li>
                </p>

                <br></br>
                <h4><span>Mil</span>itary Service</h4>
                <hr></hr>

                <p>
                  <li>The Republic of Korea Marine Corps (2015.09 ~ 2017.06)</li>
                  <li>The 2nd Marine Division (청룡부대)</li>
                </p>

                <br></br>
                <h4><span>Pub</span>lication</h4>
                <hr></hr>

                <p>
                  <li><b>2021</b> <a href="https://www.sciencedirect.com/science/article/pii/S2665963821000026">Open-Source Toolkit for End-to-End Korean Speech Recognition</a>, ELSEVIER, SIMPAC, Volume 7, 100054</li>
                  <li><b>2020</b> <a href="https://www.google.com/url?q=https%3A%2F%2Farxiv.org%2Fabs%2F2009.03092&sa=D&sntz=1&usg=AFQjCNGlJEZawenmY4JUjLg6sQyyy7LCug">[TECH-REPORT] KoSpeech: Open-Source Toolkit for End-to-End Korean Speech Recognition</a>, arXiv, 2009.03092</li>
                </p>

              </div>
            </ResumeContent>
          </article>
        </div>
      </main>
      <Footer />
    </Wrapper>
  </IndexLayout>
);

export default About;
