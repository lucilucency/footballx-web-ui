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
import { hitVote, getMatchComments } from '../../../actions';
import strings from '../../../lang';
import { bindAll, getCookie } from '../../../utils';
import constants from '../../constants';
import MatchVisualize from './MatchVisualize';
import FanFight from './FanFight';
import ButtonShare from './ButtonShare';
import Backdrop from './Backdrop';
import CreateComment from './CreateEditMatchComment';
import ViewComments from './MatchComments';

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

  componentDidMount() {
    this.props.getMatchComments(this.props.matchID || this.props.data.id, 'hot', getCookie('user_id'));
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
      <div>
        <Card
          key={data.id}
          style={{
            // maxWidth: 900,
          }}
        >
          <CardHeader
            title={strings.paragraph_match_title}
            style={{ textAlign: 'center' }}
            textStyle={{
              padding: 0,
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
                  pumping
                />
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  padding: 20,
                }}
              >
                <div>ĐÔ</div>
                <div>hay..</div>
                <div>LA</div>
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
        {this.props.isLoggedIn && <CreateComment post={this.props.data} />}
        <ViewComments comments={this.props.comments} isLoggedIn={this.props.isLoggedIn} />
      </div>
    );
  }
}

ViewMatchCompactFull.propTypes = {
  data: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool,
  matchID: PropTypes.number,

  /**/
  // user: PropTypes.object,
  comments: PropTypes.array,
  getMatchComments: PropTypes.func,
};

const mapStateToProps = state => ({
  // user: state.app.metadata.data.user,
  browser: state.browser,
  comments: state.app.comments.data,
});

const mapDispatchToProps = dispatch => ({
  hitVote: (matchID, teamID, payload) => dispatch(hitVote(matchID, teamID, payload)),
  getMatchComments: (postID, sortby, xuser_id) => dispatch(getMatchComments(postID, sortby, xuser_id)),
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ViewMatchCompactFull));
