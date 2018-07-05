import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Subheader } from 'material-ui';
import CreateEditPostForm from './CreateEditPostForm';
import { Container, RightTray, SmallPaper } from '../../../utils';
import strings from '../../../lang';

const PageCreatePost = ({ callback }) => (
  <Container>
    <CreateEditPostForm callback={callback} />
    <RightTray>
      <div data="page-welcome">
        <SmallPaper>
          <p>Posting to FootballX</p>
          <p>
            {strings.paragraph_post_desc}
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

// const mapDispatchToProps = dispatch => ({
// });

export default connect()(PageCreatePost);
