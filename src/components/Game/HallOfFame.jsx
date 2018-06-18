import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import strings from '../../lang/index';
import firebase from '../../firebase';
import { getOrdinal, formatSeconds } from '../../utils';
import Table, { /* TableLink */ } from '../Table';
import King from './HallOfFameKing';

const tableEventsColumns = browser => [
  browser.greaterThan.medium &&
  { displayName: '#', displayFn: (row, col, field, index) => (index > -1 ? index + 1 : getOrdinal(index + 1)) },
  {
    displayName: strings.label_nickname, field: 'name',
  },
  {
    displayName: 'score', field: 'score',
  },
  {
    displayName: 'time', field: 'time', displayFn: (row, col, field) => formatSeconds(field),
  },
].filter(Boolean);

const getHighlightFn = user => row => user && user.id && row.id === user.id;

class GamePort extends React.Component {
  state = {
    hallOfFame: [],
    userFame: null,
  };

  componentDidMount() {
    this.firebaseRef = firebase.database().ref('/');
    this.firebaseCallback = this.firebaseRef.on('value', (snap) => {
      const data = snap.val();
      this.setState({ hallOfFame: data });
      if (this.props.user) {
        const userFame = data.findIndex(el => el.id === this.props.user.id);
        if (userFame) {
          this.setState({ userFame: { ...data[userFame], rank: userFame + 1 } });
        }
      }
    });
  }

  render() {
    const { userFame, hallOfFame } = this.state;
    const { browser, user } = this.props;


    return (
      <div>
        <div>
          {hallOfFame && hallOfFame.length ? (
            <div>
              <King data={hallOfFame[0]} />
            </div>
          ) : null}
          {user && userFame ? (
            <p style={{ textAlign: 'center' }}>
              Your rank: <b>{userFame.rank}</b>
            </p>
          ) : null}
        </div>
        <Table
          columns={tableEventsColumns(browser)}
          data={this.state.hallOfFame}
          loading={false}
          error={false}
          paginatedBottom
          pageLength={10}
          highlightFn={getHighlightFn(user)}
        />
      </div>
    );
  }
}

GamePort.propTypes = {
  user: PropTypes.object,
  browser: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
  browser: state.browser,
});

// const mapDispatchToProps = dispatch => ({
//   toggleTray: props => dispatch(toggleTray(props)),
// });

export default connect(mapStateToProps)(GamePort);
