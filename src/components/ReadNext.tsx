import React from 'react';

import styled from '@emotion/styled';

import { colors } from '../styles/colors';
import { inner, outer } from '../styles/shared';
import { PageContext } from '../templates/post';
import { PostCard } from './PostCard';
import { ReadNextCard } from './ReadNextCard';

interface ReadNextProps {
  tags: string[];
  currentPageSlug: string;
  relatedPosts: {
    totalCount: number;
    edges: Array<{
      node: {
        timeToRead: number;
        frontmatter: {
          date: string;
          title: string;
        };
        fields: {
          slug: string;
        };
      };
    }>;
  };
  pageContext: {
    prev: PageContext;
    next: PageContext;
  };
}

export const ReadNext = ({ relatedPosts, currentPageSlug, tags, pageContext }: ReadNextProps) => {
  const showRelatedPosts = relatedPosts.totalCount > 1;

  return (
    <ReadNextAside className="read-next" css={outer}>
      <div css={inner}>
        <ReadNextFeed className="read-next-feed">
          {showRelatedPosts && (
            <ReadNextCard
              currentPageSlug={currentPageSlug}
              tags={tags}
              relatedPosts={relatedPosts}
            />
          )}

          <ReadNextTitle>다른 글 읽기</ReadNextTitle>
          {pageContext.prev && <PostCard post={pageContext.prev} />}
          {pageContext.next && <PostCard post={pageContext.next} />}
        </ReadNextFeed>
      </div>
    </ReadNextAside>
  );
};

const ReadNextAside = styled.aside`
  border-top: 1px solid ${colors.line};

  @media (prefers-color-scheme: dark) {
    border-top-color: ${colors.darkLine};
  }
`;

const ReadNextFeed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  margin: 0 auto;
  padding: 64px 0 96px;
  max-width: 700px;
`;

const ReadNextTitle = styled.h2`
  margin: 0 0 -16px;
  color: ${colors.body};
  font-size: 2.4rem;
  font-weight: 700;

  @media (prefers-color-scheme: dark) {
    color: ${colors.darkText};
  }
`;
