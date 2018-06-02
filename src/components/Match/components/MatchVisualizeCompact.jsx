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

const Styled = styled.div`
  padding: 1em;
  color: ${constants.theme().textColorPrimary}
`;
const Date = styled.div`
  text-align: left;
  font-size: ${constants.fontSizeSmall};
  margin-top: 3px;
  & > div {
    display: inline-block;
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
    
    img {
      //border: 1px solid ${constants.theme().borderColor};
      //background-color: rgba(255,255,255,0.1);
      //padding: 8px;
      //height: 40px;
      //@media only screen and (max-width: 768px) {
        width: 72px;
        //height: 32px;
      //}
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
      font-size: 24px;
      @media only screen and (max-width: 662px) {
        font-size: 18px;
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
      <Date>
        {toDateString(date * 1000)}
      </Date>
      <MatchInfo pumping={props.pumping}>
        <div className="club-image left">
          <div>{home.name}</div>
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
        </div>
        <div className="info">
          <span className="duration">
            {toTimeString(date * 1000)}
          </span>
        </div>
        <div className="club-image right">
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
          <div>{away.name}</div>
        </div>
      </MatchInfo>
    </Styled>
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
