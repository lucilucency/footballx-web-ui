import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import strings from '../../lang/index';
import firebase from '../../firebase';
import { getOrdinal } from '../../utils';
import Table, { /* TableLink */ } from '../Table';
import Container from '../Container';

const tableEventsColumns = (browser) => [
  browser.greaterThan.medium &&
  { displayName: '#', displayFn: (row, col, field, index) => (index > -1 ? index + 1 : getOrdinal(index + 1)) },
  {
    displayName: 'nickname', field: 'name',
  },
  {
    displayName: 'time', field: 'time',
  },
  {
    displayName: 'point', field: 'score',
  },
].filter(Boolean);


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
      window.abc = data;
      if (this.props.user) {
        const userFame = data.find(el => el.id === this.props.user.id);
        if (userFame) {
          this.setState({
            userFame,
          });
        }
      }
    });
  }

  render() {
    const { browser } = this.props;

    return (
      <Container
        loading={false}
        error={false}
        title="Hall of Fame"
      >
        <Table
          columns={tableEventsColumns(browser)}
          data={this.state.hallOfFame}
          loading={false}
          error={false}
          paginatedBottom
          pageLength={10}
        />
      </Container>
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
