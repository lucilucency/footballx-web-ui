import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Amplitude from 'react-amplitude';
import strings from '../../lang';
import TeamVisualize from './components/TeamVisualize';
import { Container } from '../../utils';
import TabBar from '../TabBar';
import Squad from './Squad';
import teamSquadObj from '../../fxconstants/teamSquadObj.json';
import teams from '../../fxconstants/clubsObj.json';
import RightBar from './RightBar';

const tabs = teamID => [
  {
    name: strings.label_squad,
    key: 'squad',
    content: propsVar => <Squad data={propsVar.data} isLoggedIn={propsVar.isLoggedIn} />,
    route: `/t/${teamID}/squad`,
    rightBar: <RightBar />,
  },
].filter(Boolean);

class ViewTeam extends React.Component {
  componentDidMount() {
    const { match } = this.props;
    const teamID = Number(match.params.id);
    const info = match.params.info || 'squad';
    const tab = tabs(teamID).find(_tab => _tab.key === info);
    const data = teamSquadObj[teamID];
    if (!teamID || !tab) {
      this.props.history.push('/');
    }

    this.teamID = teamID;
    this.info = info;
    this.tab = tab;
    this.data = data;

    Amplitude.logEvent('View team detail');
  }

  render() {
    const {
      teamID, info, tab, data,
    } = this;

    return (
      <div>
        <Helmet title="Team" />
        <Container
          columns={tab && tab.rightBar ? '[full-start] minmax(0, 1fr) [main-start] minmax(10em, 300px) [main-end] minmax(0, 0) [full-end]' : '1fr'}
          style={{
            maxWidth: 992,
            margin: 'auto',
          }}
        >
          <div>
            <TeamVisualize
              teamID={teamID}
              data={teams[teamID]}
            />
            <TabBar
              info={info}
              tabs={tabs(teamID)}
            />
            {tab && tab.content({ data })}
          </div>
          {tab && tab.rightBar}
        </Container>
      </div>
    );
  }
}

ViewTeam.propTypes = {
  /**/
  match: PropTypes.object,
  history: PropTypes.object,
  // isLoggedIn: PropTypes.bool,
};

// const mapStateToProps = state => ({
//   isLoggedIn: Boolean(state.app.metadata.data.user),
// });

export default connect()(ViewTeam);
