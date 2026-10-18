import { graphql, Link, StaticQuery } from 'gatsby';
import React from 'react';
import { css } from '@emotion/react';
import { getSrc } from 'gatsby-plugin-image';

import { colors } from '../../styles/colors';
import config from '../../website-config';

interface SiteNavLogoProps {
  logo?: any;
}

export const SiteNavLogo = () => (
  <StaticQuery
    query={graphql`query HeadingQuery {
  logo: file(relativePath: {eq: "img/ghost-logo.png"}) {
    childImageSharp {
      gatsbyImageData(quality: 100, width: 500, layout: FIXED)
    }
  }
}
`}
    render={(data: SiteNavLogoProps) => (
      <Link className="site-nav-logo" css={SiteNavLogoStyles} to="/">
        {data.logo ? (
          <img src={getSrc(data.logo)} alt={config.title} />
        ) : (
          config.title
        )}
      </Link>
    )}
  />
);

const SiteNavLogoStyles = css`
  position: relative;
  z-index: 100;
  flex-shrink: 0;
  display: inline-block;
  margin-right: 28px;
  padding: 8px 0;
  color: ${colors.text};
  font-size: 1.6rem;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.02em;

  img {
    display: block;
    width: auto;
    height: 21px;
  }

  @media (prefers-color-scheme: dark) {
    color: ${colors.darkText};
  }
`;
