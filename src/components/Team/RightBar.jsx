import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SmallPaper } from '../../utils/index';
import strings from '../../lang';
import AboutXFooter from '../About/Footer';

const TeamRightBar = () => (
  <div>
    <SmallPaper>
      <p>{strings.paragraph_post_desc}</p>
    </SmallPaper>
    <div>
      <AboutXFooter />
    </div>
  </div>
);

TeamRightBar.propTypes = {
  // isLoggedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
  isLoggedIn: Boolean(state.app.metadata.data.user),
});

export default connect(mapStateToProps, null)(TeamRightBar);
