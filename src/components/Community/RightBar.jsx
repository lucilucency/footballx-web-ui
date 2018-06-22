import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RightTray, SmallPaper } from '../../utils/index';
import CommunityShortView from './CommunityShortView';
import AboutXFooter from '../About/Footer';
import GroupShortView from './GroupShortView';

const RightTrayComponent = (props) => {
  const { data, loggedInUserID } = props;

  return (
    <RightTray>
      <SmallPaper>
        <CommunityShortView data={data} />
      </SmallPaper>
      {data.group_id && loggedInUserID ? (
        <SmallPaper>
          <GroupShortView groupID={data.group_id} community={data} />
        </SmallPaper>
      ) : null}
      <div>
        <AboutXFooter />
      </div>
    </RightTray>
  );
};

RightTrayComponent.propTypes = {
  data: PropTypes.object,
  loggedInUserID: PropTypes.number,
};

export default connect(null, null)(RightTrayComponent);
