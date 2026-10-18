import { lighten } from 'polished';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { colors } from './colors';

export const outer = css`
  position: relative;
  padding: 0 5vw;
`;

// Centered content container blocks
export const inner = css`
  margin: 0 auto;
  max-width: 1040px;
  width: 100%;
`;

export const SiteNavMain = css`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: saturate(180%) blur(12px);
  -webkit-backdrop-filter: saturate(180%) blur(12px);

  @media (prefers-color-scheme: dark) {
    background: rgba(25, 27, 31, 0.92);
  }
`;

export const SiteMain = css`
  flex-grow: 1;

  @media (prefers-color-scheme: dark) {
    background: ${colors.darkmode};
  }
`;

export const SiteTitle = styled.h1`
  z-index: 10;
  margin: 0;
  padding: 0;
  font-size: 4.4rem;
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.04em;

  @media (max-width: 500px) {
    font-size: 3.2rem;
  }
`;

export const SiteDescription = styled.h2`
  z-index: 10;
  margin: 0;
  padding: 10px 0 0;
  color: ${colors.subtle};
  font-size: 1.8rem;
  line-height: 1.5;
  font-weight: 400;
  letter-spacing: -0.01em;

  @media (max-width: 500px) {
    font-size: 1.6rem;
  }

  @media (prefers-color-scheme: dark) {
    color: ${colors.darkSubtle};
  }
`;

export const Posts = css`
  overflow-x: hidden;
`;

export const PostFeed = css`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 56px;
  padding: 48px 0 120px;

  @media (max-width: 650px) {
    gap: 48px;
    padding: 32px 0 80px;
  }
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${colors.body};
  font-size: 3.2rem;
  line-height: 1.4;
  font-weight: 700;

  @media (max-width: 650px) {
    font-size: 2.6rem;
  }

  @media (prefers-color-scheme: dark) {
    color: ${colors.darkText};
  }
`;

export const SocialLink = css`
  display: inline-flex;
  align-items: center;
  margin: 0;
  padding: 8px;
  color: ${colors.subtle};
  transition: color 0.2s ease;

  :hover {
    color: ${colors.text};
  }

  svg {
    height: 1.6rem;
    fill: currentColor;
  }

  @media (prefers-color-scheme: dark) {
    color: ${colors.darkSubtle};

    :hover {
      color: ${colors.darkText};
    }
  }
`;

export const SocialLinkFb = css``;
export const SocialLinkGithub = css``;

export const SiteHeader = css``;

export const SiteHeaderContent = styled.div`
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 140px 0 32px;
`;

export const SiteHeaderStyles = css`
  position: relative;
  border-bottom: 1px solid ${colors.line};

  @media (prefers-color-scheme: dark) {
    border-bottom-color: ${colors.darkLine};
  }
`;

export const AuthorProfileImage = css`
  flex: 0 0 60px;
  margin: 0;
  width: 60px;
  height: 60px;
  border: none;

  @media (prefers-color-scheme: dark) {
    box-shadow: 0 0 0 6px hsla(0, 0%, 100%, 0.04);
    background: ${colors.darkmode};
  }
`;

// tag and author post lists
export const SiteArchiveHeader = css`
  .site-header-content {
    position: relative;
    align-items: stretch;
    padding: 12vw 0 20px;
    min-height: 200px;
    max-height: 600px;
  }
`;

export const SiteHeaderBackground = css`
  margin-top: 64px;
`;

export const ResponsiveHeaderBackground = styled.div<{ backgroundImage?: string }>`
  ${p =>
    p.backgroundImage
    && `
    position: relative;
    margin-top: 64px;
    padding-bottom: 12px;
    color: #fff;
    background-size: cover;
    /* background: color(var(--darkgrey) l(-5%)) no-repeat center center; */
    background: #090a0b no-repeat 50%;
    background-image: url(${p.backgroundImage});

    :before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 10;
      display: block;
      background: rgba(0, 0, 0, 0.18);
    }

    :after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: auto;
      left: 0;
      z-index: 10;
      display: block;
      height: 140px;
      background: linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0));
    }

    @media (prefers-color-scheme: dark) {
      &:before {
        background: rgba(0, 0, 0, 0.6);
      }
    }
  `}

  ${p =>
    !p.backgroundImage
    && `

    padding-top: 0;
    padding-bottom: 0;
    /* color: var(--darkgrey); */
    color: ${colors.darkgrey};
    background: #fff;
    opacity: 1;


  .site-description {
    /* color: var(--midgrey); */
    color: ${colors.midgrey};
    opacity: 1;
  }

  .site-header-content {
    padding: 5vw 0 10px;
    /* border-bottom: 1px solid color(var(--lightgrey) l(+12%)); */
    border-bottom: 1px solid ${lighten('0.12', colors.lightgrey)};
  }

  .author-bio {
    /* color: var(--midgrey); */
    color: ${colors.midgrey};
    opacity: 1;
  }

  .author-meta {
    /* color: var(--midgrey); */
    color: ${colors.midgrey};
    opacity: 1;
  }

  .author-social-link a {
    /* color: var(--darkgrey); */
    color: ${colors.darkgrey};
  }

  .author-social-link a:before {
    /* color: var(--midgrey); */
    color: ${colors.midgrey};
  }

  .author-location + .author-stats:before,
  .author-stats + .author-social-link:before,
  .author-social-link + .author-social-link:before {
    /* color: var(--midgrey); */
    color: ${colors.midgrey};
  }

  .author-header {
    padding-bottom: 20px;
  }

  @media (max-width: 500px) {
    .site-header-content {
      flex-direction: column;
      align-items: center;
      min-height: unset;
    }

    .site-title {
      font-size: 4.2rem;
      text-align: center;
    }

    .site-header-content {
      padding: 12vw 0 20px;
    }

    .author-header {
      padding-bottom: 10px;
    }
  }
  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.9);
    /* background: var(--darkmode); */
    background: ${colors.darkmode};

    .site-header-content {
      /* border-bottom-color: color(var(--darkmode) l(+15%)); */
      /* border-bottom-color: ${lighten('0.15', colors.darkmode)}; */
      border-bottom-color: #272a30;
    }

    .author-social-link a {
      color: rgba(255, 255, 255, 0.75);
    }
  }
  `}
`;

export const NoImage = css`
  .no-image {
    padding-top: 0;
    padding-bottom: 0;
    /* color: var(--darkgrey); */
    color: ${colors.darkgrey};
    background: #fff;
    opacity: 1;
  }

  .no-image .site-description {
    /* color: var(--midgrey); */
    color: ${colors.midgrey};
    opacity: 1;
  }

  .no-image .site-header-content {
    padding: 5vw 0 10px;
    /* border-bottom: 1px solid color(var(--lightgrey) l(+12%)); */
    border-bottom: 1px solid ${lighten('0.12', colors.lightgrey)};
  }

  .no-image .author-bio {
    /* color: var(--midgrey); */
    color: ${colors.midgrey};
    opacity: 1;
  }

  .no-image .author-meta {
    /* color: var(--midgrey); */
    color: ${colors.midgrey};
    opacity: 1;
  }

  .no-image .author-social-link a {
    /* color: var(--darkgrey); */
    color: ${colors.darkgrey};
  }

  .no-image .author-social-link a:before {
    /* color: var(--midgrey); */
    color: ${colors.midgrey};
  }

  .no-image .author-location + .author-stats:before,
  .no-image .author-stats + .author-social-link:before,
  .no-image .author-social-link + .author-social-link:before {
    /* color: var(--midgrey); */
    color: ${colors.midgrey};
  }

  @media (max-width: 500px) {
    .site-header-content {
      flex-direction: column;
      align-items: center;
      min-height: unset;
    }

    .site-title {
      font-size: 4.2rem;
      text-align: center;
    }

    .no-image .site-header-content {
      padding: 12vw 0 20px;
    }
  }
  @media (prefers-color-scheme: dark) {
    .no-image {
      color: rgba(255, 255, 255, 0.9);
      /* background: var(--darkmode); */
      background: ${colors.darkmode};
    }

    .no-image .site-header-content {
      /* border-bottom-color: color(var(--darkmode) l(+15%)); */
      border-bottom-color: ${lighten('0.15', colors.darkmode)};
    }

    .no-image .author-social-link a {
      color: rgba(255, 255, 255, 0.75);
    }
  }
`;
