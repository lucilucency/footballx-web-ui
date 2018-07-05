import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import muiThemeable from 'material-ui/styles/muiThemeable';
import constants from '../constants';

const StyledMain = styled.main`
  position: relative;
  margin: 0 0 10px;
  ${props => css`
    background-color: transparent;
    border-bottom: 1px solid ${props.muiTheme.palette.borderColor};
    
    section {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
    
    
      & a {
        /* Tab */
        text-align: center;
        font-weight: ${constants.fontWeightLight};
        font-size: ${constants.fontSizeSmall};
        padding: 14px 12px 10px;
        max-width: 120px;
        border-bottom: 4px solid transparent;
        flex-grow: 1;
        font-weight: ${constants.fontWeightHeavy};
        color: ${props.muiTheme.palette.textColor};
        &:hover {
          color: color(${props.muiTheme.palette.textColor} lightness(85%));
        }
        
        &[disabled] {
          pointer-events: none;
          color: ${props.muiTheme.palette.textColor};
        }
    
        &[hidden] {
          display: none;
        }
    
        @media only screen and (max-width: 480px) {
          padding-left: 10px;
          padding-right: 10px;
          max-width: 100px;
        }
      }
      
      & .chosen {
        display: inline-block;
        border-color: ${props.muiTheme.palette.primary2Color};
        color: color(${props.muiTheme.palette.textColor} lightness(85%));
      }
    }
  `}
`;

const TransparentTabBar = ({
  tabs, info, match, muiTheme,
}) => (
  <StyledMain muiTheme={muiTheme}>
    <section>
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
    </section>
  </StyledMain>
);

const { string, shape, arrayOf } = PropTypes;
TransparentTabBar.propTypes = {
  tabs: arrayOf(shape({
    // name, key, content, route, hidden
  })),
  info: string,
  match: shape({}),
  muiTheme: PropTypes.object,
};

export default muiThemeable()(TransparentTabBar);
