import { Link } from 'gatsby';
import React from 'react';
import { css } from '@emotion/react';

import { colors } from '../styles/colors';

export interface PaginationProps {
  currentPage: number;
  numPages: number;
  /** path prefix of the paginated list, e.g. '/series/dev' ('' for home) */
  basePath?: string;
}

const Pagination: React.FunctionComponent<PaginationProps> = ({
  currentPage,
  numPages,
  basePath = '',
}) => {
  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;
  const pagePath = (page: number) => (page === 1 ? `${basePath}/` : `${basePath}/${page}/`);
  const prevPage = pagePath(currentPage - 1);
  const nextPage = pagePath(currentPage + 1);

  return (
    <nav css={navCss}>
      <div>
        {!isFirst && (
          <Link to={prevPage} rel="prev">
            {/* << symbol */}
            {String.fromCharCode(171)}
          </Link>
        )}

        {Array.from({ length: numPages }, (_, i) => (
          <Link
            key={`pagination-number${i + 1}`}
            className={i + 1 === currentPage ? 'active' : ''}
            to={pagePath(i + 1)}
          >
            {i + 1}
          </Link>
        ))}

        {!isLast && (
          <Link to={nextPage} rel="next">
            {/* >> symbol */}
            {String.fromCharCode(187)}
          </Link>
        )}
      </div>
    </nav>
  );
};

const navCss = css`
  padding-bottom: 96px;

  div {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;
  }

  a {
    min-width: 40px;
    text-align: center;
    padding: 8px 12px;
    color: ${colors.subtle};
    font-weight: 600;
    border-radius: 10px;
    transition: background 0.2s ease;

    &.active {
      color: ${colors.text};
      background: ${colors.surface};
    }

    &:hover {
      background: ${colors.surface};
    }
  }
`;

export default Pagination;
