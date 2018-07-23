import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { setPost, getPost } from '../../actions';
import { ViewPostFullFrame } from './components';

class PageViewPost extends React.Component {
  componentDidMount() {
    const { location } = this.props;
    if (location.state && location.state.data) {
      this.props.setPost(location.state.data);
    } else {
      this.props.getPost(this.props.match.params.id);
    }
  }

  render() {
    const { match, isLoggedIn, data } = this.props;
    const postID = Number(match.params.id);

    if (!postID) {
      this.props.history.push('/');
    }

    return (
      <div>
        <Helmet>
          {data && data.title && <title>{data.title}</title>}
        </Helmet>
        <ViewPostFullFrame
          isLoggedIn={isLoggedIn}
          postID={postID}
          data={data}
        />
      </div>
    );
  }
}

PageViewPost.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,

  isLoggedIn: PropTypes.bool,
  data: PropTypes.object,

  setPost: PropTypes.func,
  getPost: PropTypes.func,
};

const mapStateToProps = state => ({
  isLoggedIn: Boolean(state.app.metadata.data.user),

  data: state.app.post.data,
});

const mapDispatchToProps = dispatch => ({
  setPost: payload => dispatch(setPost(payload)),
  getPost: postID => dispatch(getPost(postID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PageViewPost);
