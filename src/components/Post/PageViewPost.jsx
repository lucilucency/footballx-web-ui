import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { setPost } from '../../actions';
import { Container, RightTray, SmallPaper, Subheader } from '../../utils';
import { ViewPostFull } from './components';

class PageViewPost extends React.Component {
  componentDidMount() {
    const { location } = this.props;
    if (location.state && location.state.data) {
      this.props.setPost(location.state.data);
    }
  }

  render() {
    const { match, data, isLoggedIn } = this.props;
    const postID = Number(match.params.id);

    if (!postID) {
      this.props.history.push('/');
    }

    return (
      <div>
        <Helmet title="Post" />
        <Container browser={this.props.browser}>
          <SmallPaper>
            <ViewPostFull {...{ postID, data, isLoggedIn }} />
          </SmallPaper>
          <RightTray>
            {isLoggedIn && (
              <div data="page-welcome">
                <SmallPaper>
                  <Subheader>Popular</Subheader>
                  <p>
                    The best posts on Footballx for you, pulled from the most active communities on Reddit.
                    Check here to see the most shared, upvoted, and commented content on the internet.
                  </p>
                </SmallPaper>
              </div>
            )}
            <div data="ads">
              <SmallPaper>
                <Subheader>Ads</Subheader>
              </SmallPaper>
            </div>
            {isLoggedIn && (
              <div data="suggested-communities">
                <SmallPaper>
                  <Subheader>Suggested communities</Subheader>
                </SmallPaper>
              </div>
            )}
          </RightTray>
        </Container>
      </div>
    );
  }
}

PageViewPost.propTypes = {
  match: PropTypes.object,
  user: PropTypes.object,
  isLoggedIn: PropTypes.bool,
  browser: PropTypes.object,
  data: PropTypes.object,
  location: PropTypes.object,
  setPost: PropTypes.func,
  history: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.app.metadata.user,
  isLoggedIn: Boolean(state.app.metadata.data.user),
  data: state.app.post.data,
  browser: state.browser,
});

const mapDispatchToProps = dispatch => ({
  setPost: payload => dispatch(setPost(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PageViewPost);
