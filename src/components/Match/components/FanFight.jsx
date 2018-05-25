/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { css, keyframes } from 'styled-components';

const shining = keyframes`
  0% {transform:translateX(-100%);}
	100% {transform:translateX(100%);}
`;

const nhapnhay = color => keyframes`
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
  padding: 1em 1em;
  display: flex;
`;

const Fan = styled.div`
  -webkit-border-radius: 2em;-moz-border-radius: 2em;border-radius: 2em;
  margin: 0 2px;
  padding: 2px 1em;
  color: #FFFFFF;
  
  -webkit-transition: flex-grow 0.35s;-moz-transition: flex-grow 0.35s;-ms-transition: flex-grow 0.35s;-o-transition: flex-grow 0.35s;transition: flex-grow 0.35s;
  
  :after {
    content:'';
    top:0;
    transform:translateX(100%);
    width:100%;
    height:100%;
    position: absolute;
    z-index:1;
    animation: ${shining} 1s infinite;
     
    /* 
    CSS Gradient - complete browser support from http://www.colorzilla.com/gradient-editor/ 
    */
    background: -moz-linear-gradient(left, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(128,186,232,0) 99%, rgba(125,185,232,0) 100%); /* FF3.6+ */
    background: -webkit-gradient(linear, left top, right top, color-stop(0%,rgba(255,255,255,0)), color-stop(50%,rgba(255,255,255,0.8)), color-stop(99%,rgba(128,186,232,0)), color-stop(100%,rgba(125,185,232,0))); /* Chrome,Safari4+ */
    background: -webkit-linear-gradient(left, rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50%,rgba(128,186,232,0) 99%,rgba(125,185,232,0) 100%); /* Chrome10+,Safari5.1+ */
    background: -o-linear-gradient(left, rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50%,rgba(128,186,232,0) 99%,rgba(125,185,232,0) 100%); /* Opera 11.10+ */
    background: -ms-linear-gradient(left, rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50%,rgba(128,186,232,0) 99%,rgba(125,185,232,0) 100%); /* IE10+ */
    background: linear-gradient(to right, rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50%,rgba(128,186,232,0) 99%,rgba(125,185,232,0) 100%); /* W3C */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00ffffff', endColorstr='#007db9e8',GradientType=1 ); /* IE6-9 */
  }
  
  ${props => props.color && css`
    background-color: ${props.color};
    animation: ${nhapnhay(props.color)} 2s ease-in-out 0s infinite;
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

