import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SmallPaper } from '../../../utils/index';
import strings from '../../../lang';
// import AboutX from '../../About/AboutX';
import AboutXFooter from '../../About/Footer';

const MatchRightBar = () => (
  <div>
    <SmallPaper>
      <p>{strings.paragraph_post_desc}</p>
    </SmallPaper>
    <div>
      <AboutXFooter />
    </div>
  </div>
);

// MatchRightBar.propTypes = {
//   user: PropTypes.object,
// };
//
// const mapStateToProps = state => ({
//   user: state.app.metadata.data.user || {},
// });

export default connect()(MatchRightBar);
