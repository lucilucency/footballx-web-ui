import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { keyframes, css } from 'styled-components';
import { withRouter } from 'react-router-dom';
import Clubs from 'fxconstants/build/clubsObj.json';
import IconButton from 'material-ui/IconButton';
import { hitVote } from '../../../actions';
import constants from '../../constants';
// import strings from '../../../lang';
import { toTimeString, toDateString } from '../../../utils';

const beatHeart = keyframes`
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1);
  }
  40% {
    transform: scale(1.05);
  }
  60% {
    transform: scale(1.085);
  }
  100% {
    transform: scale(1.02);
  }
`;

const MatchInfo = styled.div`
  padding: 1em;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  
  @media only screen and (max-width: 1023px) {
    flex-basis: 100%;
    max-width: 100%;
  }
  .club-image {
    padding: 2px;
    background-color: rgba(255,255,255,0.1);
    ${props => props.pumping && css`
      animation: .85s infinite ${beatHeart};
    `}
    img {
      width: 128px;
      @media only screen and (max-width: 768px) {
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

class MatchVisualize extends React.Component {
  hitVoteHome = (home, away, homeVotes, awayVotes) => {
    if (this.props.isLoggedIn) {
      this.props.hitVote(this.props.matchID, home, {
        votes: {
          [home]: homeVotes + 1,
          [away]: awayVotes,
        },
      });
    } else {
      this.props.history.push({
        pathname: '/sign_in',
        state: {
          from: {
            pathname: `/m/${this.props.matchID}`,
          },
        },
      });
    }
  };

  hitVoteAway = (home, away, homeVotes, awayVotes) => {
    if (this.props.isLoggedIn) {
      this.props.hitVote(this.props.matchID, away, {
        votes: {
          [home]: homeVotes,
          [away]: awayVotes + 1,
        },
      });
    } else {
      this.props.history.push({
        pathname: '/sign_in',
        state: {
          from: {
            pathname: `/m/${this.props.matchID}`,
          },
        },
      });
    }
  };

  render() {
    const {
      home, away, homeVotes, awayVotes, date, greaterThan,
    } = this.props;
    const styles = {};
    if (greaterThan.medium) {
      styles.iconButton = {
        style: { width: 128, height: 128 },
        iconStyle: { width: 108, height: 108 },
      };
    } else {
      styles.iconButton = {
        style: { width: 96, height: 96 },
        iconStyle: { width: 72, height: 72 },
      };
    }

    return (
      <MatchInfo pumping={this.props.pumping}>
        <div className="club-image">
          <IconButton
            tooltip={`For ${home.name}`}
            tooltipPosition="top-center"
            onClick={() => this.hitVoteHome(home.id, away.id, homeVotes, awayVotes)}
            style={styles.iconButton.style}
            iconStyle={styles.iconButton.iconStyle}
            touch
          >
            <img src={home.icon} alt="" />
          </IconButton>
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
          <IconButton
            tooltip={`For ${away.name}`}
            tooltipPosition="top-center"
            onClick={() => this.hitVoteAway(home.id, away.id, homeVotes, awayVotes)}
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
  }
}

MatchVisualize.propTypes = {
  matchID: PropTypes.number,
  home: PropTypes.object,
  away: PropTypes.object,
  homeVotes: PropTypes.number,
  awayVotes: PropTypes.number,
  date: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  pumping: PropTypes.bool,
  isLoggedIn: PropTypes.bool,

  /**/
  hitVote: PropTypes.func,
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
