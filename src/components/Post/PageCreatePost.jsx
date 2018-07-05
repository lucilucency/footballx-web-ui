import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import { CreateEditPostFrame } from './components';

class PageCreatePost extends React.Component {
  componentDidMount() {
    const { user } = this.props;
    if (!user || !user.id) {
      this.props.history.push({
        pathname: '/sign_in',
        state: {
          from: {
            pathname: '/submit',
          },
        },
      });
    }
  }

  render() {
    return (
      <div>
        <Helmet title="Up your thought" />
        <CreateEditPostFrame user={this.props.user} />
      </div>
    );
  }
}

PageCreatePost.propTypes = {
  user: PropTypes.object,
  history: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
});

// const mapDispatchToProps = dispatch => ({
// });

export default withRouter(connect(mapStateToProps, null)(PageCreatePost));
