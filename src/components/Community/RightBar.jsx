import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RightTray, SmallPaper } from '../../utils/index';
import CommunityShortView from './CommunityShortView';
import AboutXFooter from '../About/Footer';
import GroupShortView from './GroupShortView';

const CommunityRightBar = (props) => {
  const {
    cData, gmData, loggedInUserID, registerMembership,
  } = props;

  return (
    <RightTray>
      <SmallPaper style={{ padding: 0 }}>
        <CommunityShortView data={cData} />
      </SmallPaper>
      {gmData && gmData.group_id && loggedInUserID ? (
        <GroupShortView gmData={gmData} cData={cData} registerMembership={registerMembership} />
      ) : null}
      <div>
        <AboutXFooter />
      </div>
    </RightTray>
  );
};

CommunityRightBar.propTypes = {
  cData: PropTypes.object,
  gmData: PropTypes.object,
  registerMembership: PropTypes.object,
  loggedInUserID: PropTypes.number,
};

export default connect(null, null)(CommunityRightBar);
