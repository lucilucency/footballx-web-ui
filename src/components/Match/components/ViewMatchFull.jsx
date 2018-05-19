/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Card,
  CardHeader,
  CardActions,
  CardMedia,
} from 'material-ui';
import FlatButton from 'material-ui/FlatButton';
import styled from 'styled-components';
import clubs from 'fxconstants/build/clubsObj.json';
import { hitVote } from '../../../actions';
// import strings from '../../../lang';
import { bindAll } from '../../../utils';
import constants from '../../constants';
import MatchVisualize from './MatchVisualize';
import FanFight from './FanFight';
import ButtonShare from './ButtonShare';
import Backdrop from './Backdrop';

const ActionModule = styled.div`
  display: grid; 
  grid-template-columns: 1fr 1fr 1fr;  
`;

class ViewMatchCompactFull extends React.Component {
  static initialState = {
    dialogConstruct: {},
    leagues: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      ...ViewMatchCompactFull.initialState,
    };

    bindAll([], this);
  }

  render() {
    const { data } = this.props;

    const { home: homeID, away: awayID } = data;
    const homeVotes = data.votes && data.votes[data.home];
    const awayVotes = data.votes && data.votes[data.away];
    const home = clubs[homeID] || {};
    const away = clubs[awayID] || {};
    const homeColor = home.home_color || constants.redA200;
    const awayColor = away.home_color || constants.blueA200;
    return (
      <Card
        key={data.id}
        style={{
          // maxWidth: 900,
        }}
      >
        <CardHeader
          title="Thắng làm vua, thua ngậm mồm"
          // subtitle={<LinkCoverStyled>{strings.post_by} {userLink} - {postLink}</LinkCoverStyled>}
          // avatar={data.community_icon}
          // style={{ padding: '1em 1em 0.5em 1em' }}
          textStyle={{
            textTransform: 'uppercase',
          }}
        />
        <CardMedia
          style={{
            textAlign: 'center',
          }}
        >
          <div>
            <div>
              <FanFight
                homeColor={homeColor}
                awayColor={awayColor}
                homeFan={homeVotes}
                awayFan={awayVotes}
              />
              <MatchVisualize
                matchID={this.props.data.id}
                home={home}
                away={away}
                homeVotes={homeVotes}
                awayVotes={awayVotes}
                date={data.date}
                isLoggedIn={this.props.isLoggedIn}
              />
            </div>
            <Backdrop
              home={homeID}
              homeVotes={homeVotes}
              away={awayID}
              awayVotes={awayVotes}
            />
          </div>
        </CardMedia>
        <CardActions
          style={{
            padding: '0 8px',
            display: 'flex',
            flexDirection: 'row',
            borderTop: `1px solid ${constants.grey50}`,
            fontWeight: constants.fontWeightHeavy,
          }}
        >
          <ActionModule>
            <FlatButton
              target="_blank"
              label={data.c_comments ? `${data.c_comments} comments` : 'Comment'}
              style={{
                marginTop: 6,
                lineHeight: '32px',
                height: 34,
                minWidth: 60,
              }}
              labelStyle={{
                fontSize: constants.fontSizeSmall,
                paddingLeft: 5,
                paddingRight: 5,
                fontWeight: constants.fontWeightHeavy,
              }}
            />
          </ActionModule>
          <ActionModule>
            <ButtonShare clipboard={`${window.location.host}/p/${data.id}`} />
          </ActionModule>
        </CardActions>
      </Card>
    );
  }
}

ViewMatchCompactFull.propTypes = {
  data: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool,

  /**/
  // user: PropTypes.object,
  // history: PropTypes.object,
  // hitVote: PropTypes.func,
};

const mapStateToProps = state => ({
  // user: state.app.metadata.data.user,
  browser: state.browser,
});

const mapDispatchToProps = dispatch => ({
  hitVote: (matchID, teamID, payload) => dispatch(hitVote(matchID, teamID, payload)),
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ViewMatchCompactFull));
