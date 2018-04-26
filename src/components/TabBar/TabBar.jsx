import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import constants from '../constants';

const StyledMain = styled.main`
  position: relative;
  margin: 10px 0 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.19);
`;
const StyledSection = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;

  & a {
    /* Tab */
    text-align: center;
    font-weight: ${constants.fontWeightLight};
    font-size: 14px;
    color: ${constants.theme().textColorPrimary};
    padding: 10px 12px 16px;
    border-bottom: 2px solid transparent;
    flex-grow: 1;

    &:hover {
      color: ${constants.colorMutedLight};
    }

    &[disabled] {
      pointer-events: none;
      color: ${constants.colorMuted};
    }

    &[hidden] {
      display: none;
    }

    @media only screen and (max-width: 768px) {
      padding-left: 10px;
      padding-right: 10px;
    }
  }

  & .chosen {
    display: inline-block;
    border-color: ${constants.theme().linkColorPrimary};
    color: color(${constants.colorMuted} lightness(85%));
  }
`;

const TabBar = ({ tabs, info, match }) => (
  <StyledMain>
    <StyledSection>
      {tabs.map(tab => (
        <Link
          key={`${tab.name}_${tab.route}_${tab.key}`}
          className={tab.key === info ? 'chosen' : ''}
          to={tab.route + window.location.search}
          disabled={tab.disabled}
          hidden={tab.hidden && tab.hidden(match)}
        >
          {tab.name}
        </Link>
      ))}
    </StyledSection>
  </StyledMain>
);

const { string, shape, arrayOf } = PropTypes;
TabBar.propTypes = {
  tabs: arrayOf(shape({})),
  info: string,
  match: shape({}),
};

export default TabBar;
