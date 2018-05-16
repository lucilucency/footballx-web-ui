import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Subheader } from 'material-ui';
import CreateEditPostForm from './CreateEditPostForm';
import { Container, RightTray, SmallPaper } from '../../../utils';

const PageCreatePost = ({ callback }) => (
  <Container>
    <CreateEditPostForm callback={callback} />
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
  callback: PropTypes.func,
};

// const mapStateToProps = state => ({
//   user: state.app.metadata.user,
//   browser: state.browser,
// });

// const mapDispatchToProps = dispatch => ({
// });

export default connect()(PageCreatePost);
