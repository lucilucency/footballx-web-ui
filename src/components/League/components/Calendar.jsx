import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CreatePostButton } from '../../Post/components/index';
import { RightTray, SmallPaper } from '../../../utils/index';
import strings from '../../../lang/index';

const MatchRightBar = (props) => {
  const { user } = props;
  return (
    <RightTray>
      <SmallPaper>
        <p>Popular</p>
        <p>{strings.paragraph_popular_desc}</p>
        {user && <CreatePostButton />}
      </SmallPaper>
    </RightTray>
  );
};

MatchRightBar.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user || {},
});

export default connect(mapStateToProps, null)(MatchRightBar);
