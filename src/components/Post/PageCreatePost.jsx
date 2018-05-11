import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Subheader } from 'material-ui';
import { CreateEditPost } from './components';
import { Container, RightTray, SmallPaper } from '../../utils';

class PageCreatePost extends React.Component {
  componentDidMount() {
    console.warn('done mount');
  }

  render() {
    return (
      <div>
        <Helmet title="Up your thought" />
        <Container browser={this.props.browser}>
          <SmallPaper>
            <CreateEditPost popup />
          </SmallPaper>
          <RightTray>
            {this.props.user && (
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
            {this.props.user && (
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

PageCreatePost.propTypes = {
  match: PropTypes.object,
  user: PropTypes.object,
  browser: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.app.metadata.user,
  browser: state.browser,
});

// const mapDispatchToProps = dispatch => ({
// });

export default connect(mapStateToProps, null)(PageCreatePost);
