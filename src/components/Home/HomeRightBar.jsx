import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Subheader from 'material-ui/Subheader';
import { SuggestedCommunities } from '../User/components/index';
import { RightTray, SmallPaper } from '../../utils/index';
import strings from '../../lang/index';
import AboutX from '../About/Hero';
import AboutXFooter from '../About/Footer';

const HomeRightBar = (props) => {
  const { isLoggedIn } = props;
  return (
    <RightTray>
      <SmallPaper style={{ padding: 0 }}>
        <AboutX isLoggedIn={isLoggedIn} />
      </SmallPaper>

      {isLoggedIn && (
        <SmallPaper>
          <Subheader>{strings.label_suggested_community}</Subheader>
          <SuggestedCommunities />
        </SmallPaper>
      )}

      <div>
        <AboutXFooter />
      </div>
    </RightTray>
  );
};

HomeRightBar.propTypes = {
  isLoggedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
  isLoggedIn: Boolean(state.app.metadata.data.user),
});

export default connect(mapStateToProps, null)(HomeRightBar);
