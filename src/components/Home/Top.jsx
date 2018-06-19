import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PostGrid } from '../Post/components/index';
import { getMeFeeds } from '../../actions/index';

class HomeTop extends React.Component {
  componentDidMount() {
    this.props.getMeFeeds({
      sortby: 'top',
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

HomeTop.propTypes = {
  /**/
  loggedInUserID: PropTypes.number,
  posts: PropTypes.array,
  loading: PropTypes.bool,
  getMeFeeds: PropTypes.func,
};

const mapStateToProps = state => ({
  posts: state.app.posts.data,
  loading: state.app.posts.loading,
});

const mapDispatchToProps = dispatch => ({
  getMeFeeds: ({ sortby, xuser_id }) => dispatch(getMeFeeds({ sortby, xuser_id })),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeTop);
