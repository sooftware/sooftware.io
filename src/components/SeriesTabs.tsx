import { Link } from 'gatsby';
import React from 'react';
import styled from '@emotion/styled';

import { colors } from '../styles/colors';
import config from '../website-config';

interface SeriesTabsProps {
  /** name of the active series; undefined means "전체" */
  active?: string;
}

export const SeriesTabs: React.FC<SeriesTabsProps> = ({ active }) => (
  <Tabs>
    <Link to="/" className={active ? '' : 'active'}>
      전체
    </Link>
    {config.series.map(series => (
      <Link
        key={series.slug}
        to={`/series/${series.slug}/`}
        className={active === series.name ? 'active' : ''}
      >
        {series.name}
      </Link>
    ))}
  </Tabs>
);

const Tabs = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;

  a {
    padding: 8px 14px;
    color: ${colors.subtle};
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.4;
    background: ${colors.surface};
    border-radius: 10px;
    transition: background 0.2s ease, color 0.2s ease;
  }

  a:hover {
    color: ${colors.text};
    background: ${colors.line};
  }

  a.active {
    color: #fff;
    background: ${colors.text};
  }

  @media (prefers-color-scheme: dark) {
    a {
      color: ${colors.darkSubtle};
      background: ${colors.darkSurface};
    }

    a:hover {
      color: ${colors.darkText};
    }

    a.active {
      color: ${colors.darkmode};
      background: ${colors.darkText};
    }
  }
`;
