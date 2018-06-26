import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RightTray, SmallPaper } from '../../utils/index';
import CommunityShortView from './CommunityShortView';
import AboutXFooter from '../About/Footer';
import GroupShortView from './GroupShortView';

const RightTrayComponent = (props) => {
  const { cData, gmData, loggedInUserID } = props;

  return (
    <RightTray>
      <SmallPaper>
        <CommunityShortView data={cData} />
      </SmallPaper>
      {gmData && gmData.group_id && loggedInUserID ? (
        <SmallPaper>
          <GroupShortView gmData={gmData} cData={cData} />
        </SmallPaper>
      ) : null}
      <div>
        <AboutXFooter />
      </div>
    </RightTray>
  );
};

RightTrayComponent.propTypes = {
  cData: PropTypes.object,
  gmData: PropTypes.object,
  loggedInUserID: PropTypes.number,
};

export default connect(null, null)(RightTrayComponent);
