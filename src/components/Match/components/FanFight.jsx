/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { css, keyframes } from 'styled-components';

const keyFrameExampleOne =
    color => keyframes`
  0% {
    filter: drop-shadow(0 0 2px ${color});
  }
  50% {
    filter: drop-shadow(0 0 2px white);
  }
  100% {
    filter: drop-shadow(0 0 2px ${color});
  }
`;
const FanFightStyled = styled.div`
  padding: 0 1em;
  display: flex;
`;

const Fan = styled.div`
  -webkit-border-radius: 2em;-moz-border-radius: 2em;border-radius: 2em;
  margin: 0 2px;
  padding: 2px 1em;
  color: #FFFFFF;
  
  -webkit-transition: flex-grow 0.35s;-moz-transition: flex-grow 0.35s;-ms-transition: flex-grow 0.35s;-o-transition: flex-grow 0.35s;transition: flex-grow 0.35s;
  
  ${props => props.color && css`
    background-color: ${props.color};
    animation: ${keyFrameExampleOne(props.color)} 2s ease-in-out 0s infinite;
  `}
  
  ${props => props.text && css`
    text-align: ${props.text};
  `}
  
  ${props => props.weight && css`
    flex-grow: ${props.weight};
  `}
`;

const FanFightView = ({
  homeFan,
  awayFan,
  homeColor,
  awayColor,
}) => (
  <FanFightStyled>
    <Fan color={homeColor} text="right" weight={homeFan}>
      {homeFan}
    </Fan>
    <Fan color={awayColor} text="left" weight={awayFan}>
      {awayFan}
    </Fan>
  </FanFightStyled>
);

FanFightView.propTypes = {
  homeColor: PropTypes.string,
  awayColor: PropTypes.string,
  homeFan: PropTypes.number,
  awayFan: PropTypes.number,
};

export default connect()(FanFightView);

