import React from 'react';
import PropTypes from 'prop-types';
import styled, {
// css
} from 'styled-components';
import constants from '../../constants';
import { toTimeString } from '../../../utils/index';
import clubs from '../../../fxconstants/clubsObj.json';

const Styled = styled.div`
  padding: 8px;
  position: relative;
  font-size: ${constants.fontSizeSmall};
  color: ${constants.theme().textColorPrimary}
  
  & .status {
    position: absolute;
    line-height: 32px;
    
    @media only screen and (max-width: 768px) {
      line-height: 24px;
    }
  }
`;
const MatchInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 100px 1fr;
  
  @media only screen and (max-width: 1023px) {
    flex-basis: 100%;
    max-width: 100%;
  }
  .club-image {
    padding: 2px;
    display: table;
    -webkit-border-horizontal-spacing: 1em;
    
    &.left { justify-self: end; }
    &.right { justify-self: start; }
    > * { display: table-cell; vertical-align: middle; }
  }
    
  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 1;
  
    @media only screen and (max-width: 400px) {
      margin: 0 10px;
    }
    & span {
      text-transform: uppercase;
      display: block;
      font-size: 24px;
      @media only screen and (max-width: 662px) {
        font-size: 18px;
      }
    }
  }
`;

const MatchVisualizeCompact = (props) => {
  const {
    greaterThan, data,
  } = props;
  const { date } = data;
  const home = clubs[data.home] || {};
  const away = clubs[data.away] || {};

  const styles = {};
  if (greaterThan.medium) {
    styles.iconButton = {
      style: { height: 40, width: 'auto', padding: 0 },
      iconStyle: { height: 32, width: 'auto' },
    };
  } else {
    styles.iconButton = {
      style: { height: 32, width: 'auto', padding: 0 },
      iconStyle: { height: 24, width: 'auto' },
    };
  }

  return (
    <Styled>
      <div className="status">{data.status}</div>
      <MatchInfo>
        <div className="club-image left">
          <span>{home.name}</span>
          <img src={home.icon} alt="" style={styles.iconButton.iconStyle} />
        </div>
        <div className="info" style={{ backgroundColor: date * 1000 < Date.now() && constants.theme().positiveColorVariant1 }}>
          {date * 1000 > Date.now() ? (
            <span>
              {toTimeString(date * 1000)}
            </span>
          ) : (
            <span>
              {data.homeGoal} : {data.awayGoal}
            </span>
          )}
        </div>
        <div className="club-image right">
          <img src={away.icon} alt="" style={styles.iconButton.iconStyle} />
          <span>{away.name}</span>
        </div>
      </MatchInfo>
    </Styled>
  );
};

MatchVisualizeCompact.propTypes = {
  data: PropTypes.object,
  greaterThan: PropTypes.object,
  // isCompact: PropTypes.bool,
  // isHot: PropTypes.bool,
  /**/
};

export default MatchVisualizeCompact;
