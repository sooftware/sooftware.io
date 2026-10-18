import { Link } from 'gatsby';
import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

import { colors } from '../styles/colors';
import { outer, inner } from '../styles/shared';
import config from '../website-config';

export const Footer: React.FC = () => (
  <footer css={[outer, SiteFooter]}>
    <div css={[inner, SiteFooterContent]}>
      <section className="copyright">
        &copy; {new Date().getFullYear()} <Link to="/">{config.title}</Link>
      </section>
      <SiteFooterNav>
        {config.github && (
          <a href={config.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        )}
        {config.linkedin && (
          <a href={config.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        )}
        {config.facebook && (
          <a href={config.facebook} target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
        )}
        <a href="/rss.xml">RSS</a>
      </SiteFooterNav>
    </div>
  </footer>
);

const SiteFooter = css`
  position: relative;
  padding-top: 40px;
  padding-bottom: 64px;
  border-top: 1px solid ${colors.line};

  @media (prefers-color-scheme: dark) {
    border-top-color: ${colors.darkLine};
  }
`;

const SiteFooterContent = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  color: ${colors.faint};
  font-size: 1.4rem;

  a {
    color: ${colors.subtle};
  }

  a:hover {
    color: ${colors.text};
  }

  @media (prefers-color-scheme: dark) {
    color: ${colors.darkSubtle};

    a {
      color: ${colors.darkSubtle};
    }

    a:hover {
      color: ${colors.darkText};
    }
  }
`;

const SiteFooterNav = styled.nav`
  display: flex;
  gap: 20px;
`;
