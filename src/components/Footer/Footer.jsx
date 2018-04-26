import React from 'react';
import styled from 'styled-components';
import strings from '../../lang';
import AppLogo from '../App/AppLogo';
import PageLinks from './PageLinks';
// import Cheese from './Cheese';
import SocialLinks from './SocialLinks';
import { IconSteam } from '../Icons';
import constants from '../constants';

const StyledFooter = styled.footer`
  & main {
    padding: 0px 50px 15px;
    background-color: ${constants.theme().colorPrimary};
    color: ${constants.theme().textColorPrimary};
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    & p {
      padding: 2px 0 5px;
      margin: 0;
      font-size: ${constants.fontSizeMedium};
    }

    & .links,
    & .cheese {
      width: 50%;
    }

    & .mobile {
      & img {
        &:hover {
        opacity: 0.6;
        }
      }
    }

    & .links {
      & .logoNsocial {
        display: flex;
        flex-direction: row;
        align-items: baseline;
        position: relative;

        & a {
          cursor: pointer;

          &[data-hint-position="top"] {
            &::before {
              margin-left: 18px;
            }
          }
        }
      }

      & svg {
        height: 18px;
        margin-left: 15px;
        vertical-align: text-top;
        fill: ${constants.theme().textColorPrimary};
        transition: ${constants.normalTransition};

        &:hover {
          opacity: 0.6;
        }
      }

      & small {
        color: ${constants.colorMutedLight};
        font-size: ${constants.fontSizeSmall};

        & svg {
          height: 13px;
          margin-left: 8px;
          vertical-align: sub;
          transition: ${constants.normalTransition};
        }
      }

      & .pages {
        font-size: ${constants.fontSizeMedium};
        margin-bottom: 4px;

        & a {
          display: inline-block;

          &::after {
            content: "•";
            margin: 0 8px;
            opacity: 0.6;
            color: ${constants.theme().textColorPrimary};
          }

          &:last-child {
            &::after {
              content: "";
              margin: 0;
            }
          }
        }
      }
    }

    & .cheese {
      display: flex;
      flex-direction: row;
      align-items: center;

      & > div:first-of-type {
        margin-right: 20px;
      }
    }

    & .SocialLinks a {
      position: relative;

      &[data-hint] {
        cursor: pointer;

        &::before {
          margin-left: 16px;
        }
      }
    }

    @media only screen and (max-width: 960px) {
      padding: 20px 25px 15px;
      flex-direction: column;

      & .links,
      & .cheese {
        width: 100%;
      }

      & .cheese {
        margin-top: 20px;
      }
    }
  }
`;

const StyledHr = styled.hr`
  border: 0;
  height: 1px;
  opacity: 0.1;
  margin: 10px 0;
  background: linear-gradient(to right, ${constants.theme().textColorPrimary}, rgba(0, 0, 0, 0));
`;

export default () => (
  <StyledFooter>
    <main>
      <div className="links">
        <div className="logoNsocial">
          <AppLogo />
          <SocialLinks />
          <div className="mobile">
            <a
              href=""
              style={{ position: 'relative', left: '13px', top: '12px' }}
            >
              <img src="/assets/images/google_play_store.png" alt="" height="46px" />
            </a>
            <a
              href=""
              style={{ position: 'relative', left: '20px', top: '5px' }}
            >
              <img src="/assets/images/apple_app_store.png" alt="" height="31px" />
            </a>
          </div>
        </div>
        <small className="about">
          {strings.app_description}
          {' - '}
          {strings.app_powered_by}
          <a href="http://steampowered.com" target="_blank" rel="noopener noreferrer">
            <IconSteam />
          </a>
        </small>
        <StyledHr />
        <div className="pages">
          <PageLinks />
        </div>
      </div>
      {/* <Cheese /> */}
    </main>
  </StyledFooter>
);
