import { Link } from 'gatsby';
import React from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { colors } from '../../styles/colors';
import config from '../../website-config';
import { SubscribeModal } from '../subscribe/SubscribeModal';
import { SiteNavLogo } from './SiteNavLogo';

interface SiteNavProps {
  isHome?: boolean;
  isPost?: boolean;
  post?: any;
}

interface SiteNavState {
  showTitle: boolean;
}

class SiteNav extends React.Component<SiteNavProps, SiteNavState> {
  subscribe = React.createRef<SubscribeModal>();
  titleRef = React.createRef<HTMLSpanElement>();
  lastScrollY = 0;
  ticking = false;
  state = { showTitle: false };

  openModal = () => {
    if (this.subscribe.current) {
      this.subscribe.current.open();
    }
  };

  componentDidMount(): void {
    this.lastScrollY = window.scrollY;
    if (this.props.isPost) {
      window.addEventListener('scroll', this.onScroll, { passive: true });
    }
  }

  componentWillUnmount(): void {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    if (!this.titleRef || !this.titleRef.current) {
      return;
    }

    if (!this.ticking) {
      requestAnimationFrame(this.update);
    }

    this.ticking = true;
  };

  update = () => {
    if (!this.titleRef || !this.titleRef.current) {
      return;
    }

    this.lastScrollY = window.scrollY;

    const trigger = this.titleRef.current.getBoundingClientRect().top;
    const triggerOffset = this.titleRef.current.offsetHeight + 35;

    // show/hide post title
    if (this.lastScrollY >= trigger + triggerOffset) {
      this.setState({ showTitle: true });
    } else {
      this.setState({ showTitle: false });
    }

    this.ticking = false;
  };

  render() {
    const { isPost = false, post = {} } = this.props;
    return (
      <>
        {config.showSubscribe && <SubscribeModal ref={this.subscribe} />}
        <nav css={SiteNavStyles}>
          <SiteNavLeft className="site-nav-left">
            <SiteNavLogo />
            <SiteNavContent css={[this.state.showTitle ? HideNav : '']}>
              <ul css={NavStyles} role="menu">
                <li role="menuitem">
                  <Link to="/" activeClassName="nav-current">
                    Posts
                  </Link>
                </li>
                <li role="menuitem">
                  <Link to="/about/" activeClassName="nav-current" partiallyActive>
                    About
                  </Link>
                </li>
              </ul>
              {isPost && (
                <NavPostTitle ref={this.titleRef} className="nav-post-title">
                  {post.title}
                </NavPostTitle>
              )}
            </SiteNavContent>
          </SiteNavLeft>
          <SiteNavRight>
            <CvButton href={config.cv} download={config.cvFileName}>
              CV
            </CvButton>
            {config.showSubscribe && (
              <SubscribeButton onClick={this.openModal}>Subscribe</SubscribeButton>
            )}
          </SiteNavRight>
        </nav>
      </>
    );
  }
}

export const SiteNavMain = css`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: saturate(180%) blur(12px);
  -webkit-backdrop-filter: saturate(180%) blur(12px);

  @media (max-width: 700px) {
    padding-right: 0;
    padding-left: 0;
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(25, 27, 31, 0.92);
  }
`;

const SiteNavStyles = css`
  position: relative;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow-y: hidden;
  height: 60px;
  font-size: 1.5rem;
`;

const SiteNavLeft = styled.div`
  flex: 1 0 auto;
  display: flex;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  margin-right: 10px;
  height: 60px;
  font-weight: 500;
  white-space: nowrap;

  -ms-overflow-scrolling: touch;

  @media (max-width: 700px) {
    margin-right: 0;
    padding-left: 5vw;
  }
`;

const SiteNavContent = styled.div`
  position: relative;
  align-self: stretch;
  flex: 1 1 auto;
`;

const NavStyles = css`
  position: absolute;
  top: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  height: 60px;
  margin: 0 0 0 -10px;
  padding: 0;
  list-style: none;
  transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);

  li {
    display: block;
    margin: 0;
    padding: 0;
  }

  li a {
    display: block;
    padding: 9px 12px;
    color: ${colors.navText};
    font-weight: 600;
    border-radius: 10px;
    transition: background 0.2s ease, color 0.2s ease;
  }

  li a:hover {
    color: ${colors.text};
    background: ${colors.surface};
  }

  .nav-current {
    color: ${colors.text};
  }

  @media (prefers-color-scheme: dark) {
    li a {
      color: ${colors.darkSubtle};
    }
    li a:hover,
    .nav-current {
      color: ${colors.darkText};
    }
    li a:hover {
      background: ${colors.darkSurface};
    }
  }
`;

const SiteNavRight = styled.div`
  flex: 0 1 auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 60px;

  @media (max-width: 700px) {
    padding-right: 5vw;
  }
`;

const NavButton = css`
  display: block;
  margin: 0 0 0 8px;
  padding: 9px 14px;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
  border-radius: 10px;
  transition: background 0.2s ease;

  :hover {
    text-decoration: none;
    cursor: pointer;
  }
`;

const CvButton = styled.a`
  ${NavButton};
  color: #fff;
  background: ${colors.accent};

  :hover {
    color: #fff;
    background: ${colors.accentHover};
  }

  @media (prefers-color-scheme: dark) {
    color: #fff;
  }
`;

const SubscribeButton = styled.a`
  ${NavButton};
  color: ${colors.body};
  background: ${colors.surface};

  :hover {
    background: ${colors.line};
  }

  @media (prefers-color-scheme: dark) {
    color: ${colors.darkText};
    background: ${colors.darkSurface};
  }
`;

const NavPostTitle = styled.span`
  visibility: hidden;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  overflow: hidden;
  color: ${colors.text};
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 60px;
  text-overflow: ellipsis;
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
  transform: translateY(100%);

  @media (prefers-color-scheme: dark) {
    color: ${colors.darkText};
  }
`;

const HideNav = css`
  ul {
    visibility: hidden;
    opacity: 0;
    transform: translateY(-100%);
  }
  .nav-post-title {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }
`;

export default SiteNav;
