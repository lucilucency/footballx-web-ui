import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, {
// css
} from 'styled-components';
import { withRouter } from 'react-router-dom';
import Clubs from 'fxconstants/build/clubsObj.json';
import IconButton from 'material-ui/IconButton';
import constants from '../../constants';
// import strings from '../../lang';
import { toTimeString, toDateString } from '../../../utils/index';

const MatchInfo = styled.div`
  padding: 1em;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  color: ${constants.theme().textColorSecondary}
  
  @media only screen and (max-width: 1023px) {
    flex-basis: 100%;
    max-width: 100%;
  }
  .club-image {
    padding: 2px;
    background-color: rgba(255,255,255,0.1);
    
    img {
      height: 40px;
      @media only screen and (max-width: 768px) {
        //width: 72px;
        height: 32px;
      }
    }
  }
    
  .info {
    margin: 0 20px;
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

const MatchVisualizeCompact = (props) => {
  const {
    home, away, date, greaterThan, disabled = false,
  } = props;
  const styles = {};
  if (greaterThan.medium) {
    styles.iconButton = {
      style: { height: 40, width: 'auto' },
      iconStyle: { height: 32, width: 'auto' },
    };
  } else {
    styles.iconButton = {
      style: { height: 32, width: 'auto' },
      iconStyle: { height: 24, width: 'auto' },
    };
  }

  return (
    <MatchInfo pumping={props.pumping}>
      <div className="club-image">
        <IconButton
          disabled={disabled}
          tooltip={!disabled && `For ${home.name}`}
          tooltipPosition="top-center"
          style={styles.iconButton.style}
          iconStyle={styles.iconButton.iconStyle}
          touch
        >
          <img src={home.icon} alt="" />
        </IconButton>
        <div>{Clubs[home] && Clubs[home].name}</div>
      </div>
      <div className="info">
        <span className="duration">
          {toTimeString(date * 1000)}
        </span>
        <span className="ended">
          {toDateString(date * 1000)}
        </span>
      </div>
      <div className="club-image">
        <IconButton
          disabled={disabled}
          tooltip={!disabled && `For ${away.name}`}
          tooltipPosition="top-center"
          style={styles.iconButton.style}
          iconStyle={styles.iconButton.iconStyle}
          touch
        >
          <img src={away.icon} alt="" />
        </IconButton>
        <div>{Clubs[away] && Clubs[away].name}</div>
      </div>
    </MatchInfo>
  );
};

MatchVisualizeCompact.propTypes = {
  disabled: PropTypes.bool,
  home: PropTypes.object,
  away: PropTypes.object,
  date: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  pumping: PropTypes.bool,

  /**/
  // history: PropTypes.object,
  greaterThan: PropTypes.object,
};

const mapStateToProps = state => ({
  greaterThan: state.browser.greaterThan,
});

export default withRouter(connect(mapStateToProps)(MatchVisualizeCompact));
