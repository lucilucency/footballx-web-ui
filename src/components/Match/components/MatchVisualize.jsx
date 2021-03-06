import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import IconButton from 'material-ui/IconButton';
import { hitVote } from '../../../actions/index';
import ui from '../../../theme';
import strings from '../../../lang';
import { toTimeString, toDateString } from '../../../utils/index';

const MatchInfo = styled.div`
  padding: 1em;
  display: grid;
  grid-template-columns: [full-start] minmax(0, 1fr) [main-start] minmax(0, 1fr) [main-end] minmax(0, 1fr) [full-end];
  color: ${ui.textColorVariant1}
  
  @media only screen and (max-width: 1023px) {
    flex-basis: 100%;
    max-width: 100%;
  }
  .club-image {
    padding: 2px;
    font-size: ${ui.fontSizeSmall};
    
    img {
      height: 128px;
      @media only screen and (max-width: 768px) {
        //width: 72px;
        height: 72px;
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
      margin: 0 0px;
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
      font-size: ${ui.fontSizeSmall};
      color: ${ui.disabledColorVariant1};
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
  greaterThan,
  disabled = false,
  history,
}) => {
  const styles = {};
  if (greaterThan.medium) {
    styles.iconButton = {
      style: { height: 128, width: 'auto' },
      iconStyle: { height: 108, width: 'auto' },
    };
  } else {
    styles.iconButton = {
      style: { height: 80, width: 'auto' },
      iconStyle: { height: 64, width: 'auto' },
    };
  }

  return (
    <MatchInfo>
      <div className="club-image">
        <IconButton
          disabled={disabled}
          tooltip={strings.hint_click_to_view_team}
          tooltipPosition="top-center"
          onClick={() => history.push(`/t/${home.id}`)}
          style={styles.iconButton.style}
          iconStyle={styles.iconButton.iconStyle}
          touch
        >
          <img src={home.icon} alt="" />
        </IconButton>
        <div>{home.name}</div>
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
          tooltip={strings.hint_click_to_view_team}
          tooltipPosition="top-center"
          onClick={() => history.push(`/t/${away.id}`)}
          style={styles.iconButton.style}
          iconStyle={styles.iconButton.iconStyle}
          touch
        >
          <img src={away.icon} alt="" />
        </IconButton>
        <div>{away.name}</div>
      </div>
    </MatchInfo>
  );
};

MatchVisualize.propTypes = {
  disabled: PropTypes.bool,
  home: PropTypes.object,
  away: PropTypes.object,
  date: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  /**/
  history: PropTypes.object,
  greaterThan: PropTypes.object,
};

const mapStateToProps = state => ({
  greaterThan: state.browser.greaterThan,
});

const mapDispatchToProps = dispatch => ({
  hitVote: (matchID, teamID, payload) => dispatch(hitVote(matchID, teamID, payload)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MatchVisualize));
