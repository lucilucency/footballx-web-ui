import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Subheader from 'material-ui/Subheader';
import { CreatePostButton } from '../Post/components/index';
import { SuggestedCommunities } from '../User/components/index';
import { RightTray, SmallPaper } from '../../utils/index';
import strings from '../../lang/index';

const PopularRightBar = (props) => {
  const { user } = props;
  return (
    <RightTray>
      <SmallPaper>
        <p>Popular</p>
        <p>{strings.paragraph_popular_desc}</p>
        {user && <CreatePostButton />}
      </SmallPaper>
      {user && (
        <SmallPaper>
          <Subheader>{strings.label_suggested_community}</Subheader>
          <SuggestedCommunities />
        </SmallPaper>
      )}
    </RightTray>
  );
};

PopularRightBar.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user || {},
});

export default connect(mapStateToProps, null)(PopularRightBar);
