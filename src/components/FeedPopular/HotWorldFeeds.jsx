import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import constants from '../constants';
import { SuggestedCommunities } from '../User/components';
import { Container, RightTray } from '../../utils';
import strings from '../../lang';
import { MatchGrid } from '../Match/components';
import { CreatePostButton, PostGrid } from '../Post/components';


const Paper2 = styled(Paper)`
  display: grid;
  font-size: ${constants.fontSizeSmall};
  
  padding: 10px;
`;

const NewWorldFeeds = ({ user, browser }) => (
  <div>
    <Helmet title="footballx - Posts" />
    <Container browser={browser}>
      <div>
        <MatchGrid />
        <PostGrid sorting="top" filter="world" />
      </div>
      <RightTray>
        <div data="page-welcome">
          <Paper2>
            <p>Popular</p>
            <p>{strings.paragraph_popular_desc}</p>
            {user && <CreatePostButton />}
          </Paper2>
        </div>
        {null && (
          <div data="ads">
            <Paper2>
              <Subheader>Ads</Subheader>
            </Paper2>
          </div>
        )}
        {user && (
          <div data="suggested-communities">
            <Paper2>
              <Subheader>{strings.label_suggested_community}</Subheader>
              <SuggestedCommunities />
            </Paper2>
          </div>
        )}
      </RightTray>
    </Container>
  </div>
);


NewWorldFeeds.propTypes = {
  browser: PropTypes.object,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  browser: state.browser,
  loading: state.app.posts.loading,
  user: state.app.metadata.data.user,
});

export default connect(mapStateToProps, null)(NewWorldFeeds);
