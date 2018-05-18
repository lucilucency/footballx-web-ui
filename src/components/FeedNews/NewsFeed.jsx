import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Subheader from 'material-ui/Subheader';
import { CreatePostButton, PostGrid } from '../Post/components';
import { MatchGrid } from '../Match/components';
import { SuggestedCommunities } from '../User/components';
import { Container, RightTray, SmallPaper } from '../../utils';
import strings from '../../lang';

class NewFeeds extends React.Component {
  componentDidMount() {

  }

  render() {
    return (
      <div>
        <Helmet title="News feed" />
        <Container browser={this.props.browser}>
          <div>
            <MatchGrid />
            <PostGrid />
          </div>
          <RightTray>
            {this.props.user && (
              <div data="page-welcome">
                <SmallPaper>
                  <Subheader>Home</Subheader>
                  <p>{strings.paragraph_home_desc}</p>
                  <CreatePostButton user={this.props.user} browser={this.props.browser} />
                </SmallPaper>
              </div>
            )}
            {null && (
              <div data="ads">
                <SmallPaper>
                  <Subheader>Ads</Subheader>
                </SmallPaper>
              </div>
            )}
            {this.props.user && (
              <div data="suggested-communities">
                <SmallPaper>
                  <Subheader>{strings.label_suggested_community}</Subheader>
                  <SuggestedCommunities />
                </SmallPaper>
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
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  browser: state.browser,
  loading: state.app.posts.loading,
  user: state.app.metadata.data.user || {},
});

export default connect(mapStateToProps, null)(NewFeeds);
