import React from 'react';
import PropTypes from 'prop-types';
import { Subheader } from 'material-ui';
import ViewPostFull from './ViewPostFull';
import { Container, RightTray, SmallPaper } from '../../../utils';

const PageCreatePost = ({ isLoggedIn }) => (
  <Container>
    <ViewPostFull
      isLoggedIn={isLoggedIn}
    />
    <RightTray>
      <div data="page-welcome">
        <SmallPaper>
          <p>Posting to FootballX</p>
          <p>
            The best posts on Footballx for you, pulled from the most active communities on Reddit.
            Check here to see the most shared, upvoted, and commented content on the internet.
          </p>
        </SmallPaper>
      </div>
      {null && (
        <div data="ads">
          <SmallPaper>
            <Subheader>Ads</Subheader>
          </SmallPaper>
        </div>
      )}
    </RightTray>
  </Container>
);

PageCreatePost.propTypes = {
  // user: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool,
};

export default PageCreatePost;
