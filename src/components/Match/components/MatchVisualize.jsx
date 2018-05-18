import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Clubs from 'fxconstants/build/clubsObj.json';

import constants from '../../constants';
// import strings from '../../../lang';
import { toTimeString, toDateString } from '../../../utils';

const MatchInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  
  //box-sizing: border-box;
  //display: flex;
  //justify-content: space-around;
  //text-align: center;
  //margin-bottom: 20px;
  
  @media only screen and (max-width: 1023px) {
    flex-basis: 100%;
    max-width: 100%;
  }
  
  .club-image {
    //width: 128px;
    //height: 128px;
    padding: 2px;
    //box-shadow: 0 0 3px ${constants.defaultPrimaryColor};
    background-color: rgba(255,255,255,0.1);
    
    img {
      width: 128px;
      @media only screen and (max-width: 660px) {
        width: 72px;
        height: 72px;
      }
    }
  }
    
  .info {
    margin: 0 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  
    @media only screen and (max-width: 400px) {
      margin: 0 10px;
    }
  
    & span {
      text-transform: uppercase;
      display: block;
    }
  
    & .duration {
      font-size: 28px;
  
      @media only screen and (max-width: 400px) {
        font-size: 24px;
      }
    }
  
    & .ended {
      font-size: ${constants.fontSizeSmall};
      color: ${constants.colorMutedLight};
      margin-top: 3px;
  
      & > div {
        display: inline-block;
      }
    }
  }
`;

const MatchVisualize = ({
  home,
  away,
  date,
}) => (
  <MatchInfo>
    <div className="club-image">
      <img src={Clubs[home] && Clubs[home].icon} alt="" />
      <div>{Clubs[home] && Clubs[home].name}</div>
    </div>
    <div className="info">
      {/* <span style={{ fontSize: constants.fontSizeMedium }}> */}
      {/* {date * 1000 < Date.now() ? strings.match_ended : strings.match_ongoing} */}
      {/* </span> */}
      <span className="duration">
        {toTimeString(date * 1000)}
      </span>
      <span className="ended">
        {toDateString(date * 1000)}
      </span>
    </div>
    <div className="club-image">
      <img src={Clubs[away] && Clubs[away].icon} alt="" />
      <div>{Clubs[away] && Clubs[away].name}</div>
    </div>
  </MatchInfo>
);

MatchVisualize.propTypes = {
  home: PropTypes.number.isRequired,
  away: PropTypes.number.isRequired,
  date: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default MatchVisualize;
