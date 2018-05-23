/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

const backdrops = {
  19: '/assets/images/backdrops/mu.png',
  5: '/assets/images/backdrops/chelsea.png',
  28: '/assets/images/backdrops/real.png',
  4: '/assets/images/backdrops/liv.png',
};

const BackdropStyled = styled.div`
  width: 100%;
  max-width: 900px;
  margin: auto;
  padding-top: 56.25%;
  position: relative;
  opacity: 0.9;
  filter: alpha(opacity=50);
  -webkit-transition: background 0.5s;-moz-transition: background 0.5s;-ms-transition: background 0.5s;-o-transition: background 0.5s;transition: background 0.5s;
  ${props => css`
    background: url(${props.image}) scroll no-repeat center/cover;
  `}
`;

const FanFightView = ({
  homeVotes,
  awayVotes,
  home,
  away,
}) => (
  <BackdropStyled
    image={backdrops[homeVotes > awayVotes ? home : away]}
  />
);

FanFightView.propTypes = {
  home: PropTypes.number,
  away: PropTypes.number,
  homeVotes: PropTypes.number,
  awayVotes: PropTypes.number,
};

export default connect()(FanFightView);

