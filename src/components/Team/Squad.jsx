import React from 'react';
// import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class Squad extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {

  }

  render() {
    return (
      <div>
        SQUAD HERE
      </div>
    );
  }
}

Squad.propTypes = {
  /**/
  // user: PropTypes.object,
};

const mapStateToProps = state => ({
  // user: state.app.metadata.data.user,
  browser: state.browser,
  comments: state.app.comments.data,
});

export default withRouter(connect(mapStateToProps)(Squad));
