import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PostGrid } from '../Post/components/index';
import { getWorldFeeds } from '../../actions/index';

class PopularFeedControversy extends React.Component {
  componentDidMount() {
    this.props.getWorldFeeds({
      sortby: 'controversy',
      xuser_id: this.props.loggedInUserID,
    });
  }

  render() {
    return (
      <div>
        <PostGrid
          posts={this.props.posts}
          loading={this.props.loading}
          loggedInUserID={this.props.loggedInUserID}
        />
      </div>
    );
  }
}

PopularFeedControversy.propTypes = {
  /**/
  loggedInUserID: PropTypes.number,
  posts: PropTypes.array,
  loading: PropTypes.bool,
  getWorldFeeds: PropTypes.func,
};

const mapStateToProps = state => ({
  posts: state.app.posts.data,
  loading: state.app.posts.loading,
});

const mapDispatchToProps = dispatch => ({
  getWorldFeeds: ({ sortby, xuser_id }) => dispatch(getWorldFeeds({ sortby, xuser_id })),
});

export default connect(mapStateToProps, mapDispatchToProps)(PopularFeedControversy);
