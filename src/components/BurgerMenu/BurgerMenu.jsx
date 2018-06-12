import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import { setTray, getSuggestedCommunities } from '../../actions/index';
import FeedMenu from './FeedMenu';
import MatchMenu from './MatchMenu';

function disableTray(text) {
  // const patt = new RegExp('/sign_in/|/match|/m/');
  const patt = new RegExp('/sign_in|/game');
  return patt.test(text);
}

function openMatchTray(text) {
  const patt = new RegExp('/match|/m/|/l/|/t/');
  return patt.test(text);
}

class BurgerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    // this.props.setTray({ state: false });
    if (disableTray(this.props.location.pathname) || !this.props.greaterThanSmall) {
      this.props.setTray({ state: false });
    } else {
      this.props.setTray({ state: true });
    }
  }

  componentWillReceiveProps(props) {
    if (props.location.pathname !== this.props.location.pathname || props.greaterThanSmall !== this.props.greaterThanSmall) {
      if (!props.greaterThanSmall) {
        this.props.setTray({ state: false });
      } else if (disableTray(props.location.pathname)) {
        this.props.setTray({ state: false });
      } else {
        this.props.setTray({ state: true });
      }
    }
  }

  handleToggle() {
    this.props.setTray();
  }

  render() {
    const { tray } = this.props;

    return (
      <Drawer
        docked={this.props.greaterThanSmall}
        width={tray.width}
        open={tray.show}
        onRequestChange={open => !this.props.greaterThanSmall && this.props.setTray({ state: open })}
        containerStyle={{
          height: 'calc(100vh - 56px)',
          top: 56,
          boxShadow: 'none',
          overflowX: 'hidden',
          zIndex: 1300,
        }}
        overlayStyle={{
          opacity: 0,
        }}
      >
        {openMatchTray(this.props.location.pathname) ? <MatchMenu /> : <FeedMenu /> }
      </Drawer>
    );
  }
}

BurgerMenu.propTypes = {
  greaterThanSmall: PropTypes.bool,
  location: PropTypes.object,
  tray: PropTypes.object,
  setTray: PropTypes.func,
};

const mapStateToProps = state => ({
  greaterThanSmall: state.browser.greaterThan.small,
  tray: state.app.tray,
  communities: state.app.metadata.data.following ? (state.app.metadata.data.following.communities || []) : [],
  user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  setTray: props => dispatch(setTray(props)),
  getSuggestedCommunities: () => dispatch(getSuggestedCommunities()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BurgerMenu));
