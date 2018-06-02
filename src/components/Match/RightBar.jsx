import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RightTray, SmallPaper } from '../../utils/index';
import strings from '../../lang/index';

const MatchRightBar = () => (
  <RightTray>
    <SmallPaper>
      <p>Popular</p>
      <p>{strings.paragraph_popular_desc}</p>
    </SmallPaper>
  </RightTray>
);

MatchRightBar.propTypes = {
  // user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user || {},
});

export default connect(mapStateToProps, null)(MatchRightBar);
