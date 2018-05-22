import React from 'react';
import PropTypes from 'prop-types';
import { Subheader } from 'material-ui';
import ViewPostFull from './PostViewFull';
import { Container, RightTray, SmallPaper } from '../../../utils';

const ViewPostFullFrame = ({ isLoggedIn, postID, data }) => (
  <Container>
    <ViewPostFull
      isLoggedIn={isLoggedIn}
      postID={postID}
      data={data}
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

ViewPostFullFrame.propTypes = {
  // user: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  postID: PropTypes.number,
  data: PropTypes.object,
};

export default ViewPostFullFrame;
