import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import strings from '../../lang/index';
import firebase from '../../firebaseGame';
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

class HallOfFame extends React.Component {
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

    const adding = [{
      name: 'ducnguyen102',
      score: 1090,
      time: 117,
    }, {
      name: 'DragonX',
      score: 1000,
      time: 52,
    }, {
      name: 'Lê Huy',
      score: 985,
      time: 116,
    }, {
      name: 'Lương Ngọc Tuyên',
      score: 940,
      time: 237,
    }];

    let hallOfFameAdding = hallOfFame.concat(adding);
    hallOfFameAdding = hallOfFameAdding.sort((a, b) => {
      if (a.score > b.score) return -1;
      else if (a.score < b.score) return 1;
      return 0;
    });

    console.log(JSON.stringify(hallOfFameAdding));

    return (
      <div>
        <div>
          {hallOfFameAdding && hallOfFameAdding.length ? (
            <div>
              <King data={hallOfFameAdding[0]} />
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

HallOfFame.propTypes = {
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

export default connect(mapStateToProps)(HallOfFame);
