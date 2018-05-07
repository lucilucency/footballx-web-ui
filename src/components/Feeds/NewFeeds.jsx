/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import styled, { css } from 'styled-components';
import Paper from 'material-ui/Paper';
import constants from '../constants';
import { getMeFeeds } from '../../actions/index';
import { CreatePostButton, PostGrid } from '../Post/components';
import { SuggestedCommunities } from '../User/components';

const Container = styled.div`
  display: grid;
  grid-gap: 2em;
  ${props => (props.browser.greaterThan.small ? css`
    grid-template-columns: 2fr 1fr;  
  ` : css`
    grid-template-columns: 1fr;
  `)}
`;

const RightTray = styled.div`
  > div {
    margin-bottom: 1em;
    position: relative;
    width: 100%;
  }
  
  > div[data='page-welcome'] {
    //padding-top: calc(75% + 40px);
  }
`;

const Paper2 = styled(Paper)`
  display: grid;
  font-size: ${constants.fontSizeSmall};
  
  //position: absolute;
  //top: 0;
  //left: 0;
  //bottom: 0;
  //right: 0;
  padding: 10px;
`;

class NewFeeds extends React.Component {
  componentDidMount() {
    console.log('calling getMeFeeds');
    if (this.props.user.id) {
      console.log('get posts');
      this.props.dispatchPosts('new', this.props.user.id);
    } else {
      console.log('wating 2000');
      setTimeout(() => this.props.dispatchPosts('new', this.props.user.id), 2000);
    }
  }

  render() {
    // if (!this.props.user) {
    //   this.props.history.push('/');
    // }

    return (
      <div>
        <Helmet title="footballx - Posts" />
        <Container browser={this.props.browser}>
          <PostGrid />
          <RightTray>
            {this.props.user && (
              <div data="page-welcome">
                <Paper2>
                  <p>Home</p>
                  <p>Your personal FootballX frontpage. Come here to check in with your favorite communities.</p>
                  <CreatePostButton />
                </Paper2>
              </div>
            )}
            <div data="ads">
              <Paper2>
                <p>Ads</p>
              </Paper2>
            </div>
            {this.props.user && (
              <div data="suggested-communities">
                <Paper2>
                  <p>Suggested communities</p>
                  <SuggestedCommunities />
                </Paper2>
              </div>
            )}
          </RightTray>
        </Container>
      </div>
    );
  }
}

NewFeeds.propTypes = {
  browser: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  user: PropTypes.object,
  dispatchPosts: PropTypes.func,
};

const mapStateToProps = state => ({
  browser: state.browser,
  loading: state.app.posts.loading,
  user: state.app.metadata.data.user || {},
});

const mapDispatchToProps = dispatch => ({
  dispatchPosts: (sortby, userID) => dispatch(getMeFeeds(sortby, userID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewFeeds);
