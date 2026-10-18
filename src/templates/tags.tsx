import { graphql } from 'gatsby';
import React from 'react';
import { Helmet } from 'react-helmet';

import styled from '@emotion/styled';

import { Footer } from '../components/Footer';
import SiteNav from '../components/header/SiteNav';
import { PostCard } from '../components/PostCard';
import { Wrapper } from '../components/Wrapper';
import IndexLayout from '../layouts';
import { colors } from '../styles/colors';
import { inner, outer, PostFeed, SectionTitle, SiteMain, SiteNavMain } from '../styles/shared';
import config from '../website-config';
import { PageContext } from './post';
import { ListTop } from './series';

interface TagTemplateProps {
  location: Location;
  pageContext: {
    tag: string;
  };
  data: {
    allTagYaml: {
      edges: Array<{
        node: {
          id: string;
          description: string;
        };
      }>;
    };
    allMarkdownRemark: {
      totalCount: number;
      edges: Array<{
        node: PageContext;
      }>;
    };
  };
}

const Tags = ({ pageContext, data, location }: TagTemplateProps) => {
  const tag = pageContext.tag ? pageContext.tag : '';
  const { edges, totalCount } = data.allMarkdownRemark;
  const tagData = data.allTagYaml.edges.find(n => n.node.id.toLowerCase() === tag.toLowerCase());

  return (
    <IndexLayout>
      <Helmet>
        <html lang={config.lang} />
        <title>
          {tag} - {config.title}
        </title>
        <meta name="description" content={tagData?.node ? tagData.node.description : ''} />
        <meta property="og:site_name" content={config.title} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${tag} - ${config.title}`} />
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
            <SectionTitle>#{tag}</SectionTitle>
            <TagDescription>
              {tagData?.node.description || `${totalCount}개의 글`}
            </TagDescription>
            <div css={PostFeed}>
              {edges.map(({ node }) => (
                <PostCard key={node.fields.slug} post={node} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </Wrapper>
    </IndexLayout>
  );
};

const TagDescription = styled.p`
  margin: 8px 0 0;
  color: ${colors.subtle};
  font-size: 1.7rem;

  @media (prefers-color-scheme: dark) {
    color: ${colors.darkSubtle};
  }
`;

export default Tags;

export const pageQuery = graphql`
  query ($tag: String) {
    allTagYaml {
      edges {
        node {
          id
          description
        }
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] }, draft: { ne: true } } }
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
