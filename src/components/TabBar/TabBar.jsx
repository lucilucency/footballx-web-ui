import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ui from '../../theme';

const StyledMain = styled.main`
  position: relative;
  margin: 0 0 10px;
  background-color: ${ui.surfaceColorPrimary};
  border-bottom: 1px solid ${ui.borderColor};
`;
const StyledSection = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;


  & a {
    /* Tab */
    text-align: center;
    font-weight: ${ui.fontWeightLight};
    font-size: ${ui.fontSizeSmall};
    color: ${ui.textColorPrimary};
    padding: 14px 12px 10px;
    border-bottom: 4px solid transparent;
    flex-grow: 1;
    font-weight: ${ui.fontWeightHeavy};

    &:hover {
      color: color(${ui.textColorPrimary} lightness(85%));
    }

    &[disabled] {
      pointer-events: none;
      color: ${ui.disabledColor};
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
    border-color: ${ui.positive2Color};
    color: color(${ui.textColorPrimary} lightness(85%));
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
