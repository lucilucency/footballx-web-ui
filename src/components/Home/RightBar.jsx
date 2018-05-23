import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Subheader from 'material-ui/Subheader';
import { CreatePostButton } from '../Post/components/index';
import { SuggestedCommunities } from '../User/components/index';
import { RightTray, SmallPaper } from '../../utils/index';
import strings from '../../lang/index';

const HomeRightBar = (props) => {
  const { user } = props;
  return (
    <RightTray>
      {user && (
        <div data="page-welcome">
          <SmallPaper>
            <Subheader>Home</Subheader>
            <p>{strings.paragraph_home_desc}</p>
            <CreatePostButton />
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
      {user && (
        <div data="suggested-communities">
          <SmallPaper>
            <Subheader>{strings.label_suggested_community}</Subheader>
            <SuggestedCommunities />
          </SmallPaper>
        </div>
      )}
    </RightTray>
  );
};

HomeRightBar.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user || {},
});

export default connect(mapStateToProps, null)(HomeRightBar);
