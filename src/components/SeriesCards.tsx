import { Link } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import React from 'react';
import styled from '@emotion/styled';

import { colors } from '../styles/colors';
import { SectionTitle } from '../styles/shared';
import config from '../website-config';

export interface SeriesCard {
  slug: string;
  count: number;
  coverSlug: string;
}

interface SeriesCardsProps {
  title: string;
  cards: SeriesCard[];
  /** cover images keyed by post slug */
  covers: Record<string, any>;
}

export const SeriesCards: React.FC<SeriesCardsProps> = ({ title, cards, covers }) => {
  const row = React.useRef<HTMLDivElement>(null);
  const scroll = (direction: number) =>
    row.current?.scrollBy({ left: direction * row.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <>
      <Header>
        <SectionTitle>{title}</SectionTitle>
        <Arrows>
          <button type="button" aria-label="이전 시리즈" onClick={() => scroll(-1)}>
            &#8249;
          </button>
          <button type="button" aria-label="다음 시리즈" onClick={() => scroll(1)}>
            &#8250;
          </button>
        </Arrows>
      </Header>
      <Row ref={row}>
    {config.series.map(series => {
      const card = cards.find(item => item.slug === series.slug);
      if (!card || card.count === 0) {
        return null;
      }

      const cover = covers[card.coverSlug];
      return (
        <Card key={series.slug} to={`/series/${series.slug}/`}>
          <Cover>{cover && <GatsbyImage image={getImage(cover)!} alt={series.name} />}</Cover>
          <Title>{series.name}</Title>
          <Description>{series.description}</Description>
          <Count>글 {card.count}개</Count>
        </Card>
      );
    })}
      </Row>
    </>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Arrows = styled.div`
  display: flex;
  gap: 8px;

  button {
    width: 40px;
    height: 40px;
    color: ${colors.body};
    font-size: 2.4rem;
    line-height: 1;
    background: ${colors.surface};
    border-radius: 50%;
    transition: background 0.2s ease;
  }

  button:hover {
    background: ${colors.line};
  }

  @media (max-width: 650px) {
    display: none;
  }

  @media (prefers-color-scheme: dark) {
    button {
      color: ${colors.darkText};
      background: ${colors.darkSurface};
    }
  }
`;

// horizontal scroller: about four cards visible on desktop, swipe for the rest
const Row = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 236px;
  gap: 20px;
  overflow-x: auto;
  margin: 28px -5vw 0;
  padding: 0 5vw 8px;
  scroll-snap-type: x mandatory;
  scroll-padding: 0 5vw;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 1150px) {
    margin-right: 0;
    margin-left: 0;
    padding-right: 0;
    padding-left: 0;
    scroll-padding: 0;
  }

  @media (max-width: 650px) {
    grid-auto-columns: 200px;
    gap: 12px;
  }
`;

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: ${colors.surface};
  border-radius: 20px;
  scroll-snap-align: start;
  transition: background 0.2s ease;

  :hover {
    background: ${colors.line};
  }

  :hover img {
    transform: scale(1.04);
  }

  @media (prefers-color-scheme: dark) {
    background: ${colors.darkSurface};

    :hover {
      background: #2d3037;
    }
  }
`;

const Cover = styled.div`
  overflow: hidden;
  aspect-ratio: 1 / 1;
  background: ${colors.line};
  border-radius: 14px;
  transform: translateZ(0);

  .gatsby-image-wrapper {
    width: 100%;
    height: 100%;
  }

  img {
    transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1) !important;
  }
`;

const Title = styled.h3`
  margin: 20px 0 0;
  color: ${colors.text};
  font-size: 1.9rem;
  line-height: 1.4;
  font-weight: 700;

  @media (prefers-color-scheme: dark) {
    color: ${colors.darkText};
  }
`;

const Description = styled.p`
  flex: 1 0 auto;
  margin: 6px 0 20px;
  color: ${colors.subtle};
  font-size: 1.5rem;
  line-height: 1.55;

  @media (prefers-color-scheme: dark) {
    color: ${colors.darkSubtle};
  }
`;

const Count = styled.span`
  align-self: flex-start;
  padding: 6px 12px;
  color: ${colors.subtle};
  font-size: 1.3rem;
  font-weight: 600;
  background: #fff;
  border-radius: 999px;

  @media (prefers-color-scheme: dark) {
    color: ${colors.darkSubtle};
    background: ${colors.darkmode};
  }
`;
