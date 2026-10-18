import { graphql } from 'gatsby';
import React from 'react';
import { Helmet } from 'react-helmet';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { Footer } from '../components/Footer';
import SiteNav from '../components/header/SiteNav';
import Pagination from '../components/Pagination';
import { PostCard } from '../components/PostCard';
import { SeriesTabs } from '../components/SeriesTabs';
import { Wrapper } from '../components/Wrapper';
import IndexLayout from '../layouts';
import { colors } from '../styles/colors';
import { inner, outer, PostFeed, SectionTitle, SiteMain, SiteNavMain } from '../styles/shared';
import config from '../website-config';
import { PageContext } from './post';

interface SeriesTemplateProps {
  location: Location;
  pageContext: {
    series: string;
    slug: string;
    currentPage: number;
    numPages: number;
  };
  data: {
    allMarkdownRemark: {
      totalCount: number;
      edges: Array<{
        node: PageContext;
      }>;
    };
  };
}

const Series = ({ pageContext, data, location }: SeriesTemplateProps) => {
  const { series, slug, currentPage, numPages } = pageContext;
  const description = config.series.find(item => item.slug === slug)?.description;

  return (
    <IndexLayout>
      <Helmet>
        <html lang={config.lang} />
        <title>
          {series} - {config.title}
        </title>
        <meta property="og:site_name" content={config.title} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${series} - ${config.title}`} />
        <meta property="og:url" content={config.siteUrl + location.pathname} />
      </Helmet>
      <Wrapper>
        <header css={[outer, SiteNavMain]}>
          <div css={inner}>
            <SiteNav />
          </div>
        </header>
        <main id="site-main" css={[SiteMain, outer]}>
          <div css={[inner, ListTop]}>
            <SectionTitle>{series}</SectionTitle>
            {description && (
              <SeriesDescription>
                {description} · 글 {data.allMarkdownRemark.totalCount}개
              </SeriesDescription>
            )}
            <SeriesTabs active={series} />
            <div css={PostFeed}>
              {data.allMarkdownRemark.edges.map(({ node }) => (
                <PostCard key={node.fields.slug} post={node} />
              ))}
            </div>
            {numPages > 1 && (
              <Pagination
                currentPage={currentPage}
                numPages={numPages}
                basePath={`/series/${slug}`}
              />
            )}
          </div>
        </main>
        <Footer />
      </Wrapper>
    </IndexLayout>
  );
};

const SeriesDescription = styled.p`
  margin: 8px 0 0;
  color: ${colors.subtle};
  font-size: 1.7rem;

  @media (prefers-color-scheme: dark) {
    color: ${colors.darkSubtle};
  }
`;

export const ListTop = css`
  padding-top: 120px;

  @media (max-width: 650px) {
    padding-top: 96px;
  }
`;

export default Series;

export const pageQuery = graphql`
  query ($series: String, $skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { series: { eq: $series }, draft: { ne: true } } }
      limit: $limit
      skip: $skip
    ) {
      totalCount
      edges {
        node {
          ...PostCardFields
        }
      }
    }
  }
`;
