import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Amplitude from 'react-amplitude';
import { getLeagueLastSeasons, localLoadingReducer, ajaxGet } from '../../../actions';
import leagues from '../../../fxconstants/leaguesObj.json';
import StandingGrid from './StandingGrid';

class LeagueStanding extends React.Component {
  constructor(props) {
    super(props);
    this.standings = [];

    this.getData = (props) => {
      const self = this;
      const { leagueID } = props;
      Amplitude.logEvent(`View league ${leagues[leagueID] && leagues[leagueID].name}`);
      /* get data here */
      props.getLeagueLastSeasons(leagueID, (seasons) => {
        if (seasons && seasons.length) {
          seasons.forEach((season) => {
            ajaxGet({
              auth: true,
              path: `season/${season.id}/standing`,
            }, (resp) => {
              try {
                const respObj = JSON.parse(resp);
                if (respObj.standing && respObj.standing.length) {
                  self.standings = [...self.standings, ...respObj.standing];
                  self.forceUpdate();
                }
              } catch (err) {
                console.error(err);
              }
            });
          });
        }
      });
    };
  }


  componentDidMount() {
    this.getData(this.props, this);
  }

  componentWillReceiveProps(props) {
    if (props.leagueID !== this.props.leagueID) {
      this.getData(props, this);
    }
  }

  render() {
    const { seasons, leagueID } = this.props;

    return (
      <div>
        <StandingGrid leagueID={leagueID} standings={this.standings} seasons={seasons} browser={this.props.browser} />
      </div>
    );
  }
}

LeagueStanding.propTypes = {
  leagueID: PropTypes.number.isRequired,
  seasons: PropTypes.array,
  // history: PropTypes.object,
  getLeagueLastSeasons: PropTypes.func,
  browser: PropTypes.object,
};

const mapStateToProps = state => ({
  seasons: state.app.seasons.data,
  browser: state.browser,
});

const mapDispatchToProps = dispatch => ({
  getLeagueLastSeasons: (leagueID, callback) => {
    dispatch(localLoadingReducer('seasons', []));
    return dispatch(getLeagueLastSeasons(leagueID, callback));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LeagueStanding);
