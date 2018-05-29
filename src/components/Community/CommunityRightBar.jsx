import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RightTray, SmallPaper } from '../../utils/index';
import CommunityShortView from './CommunityShortView';

const RightTrayComponent = (props) => {
  const { data } = props;

  return (
    <RightTray>
      <SmallPaper style={{ textAlign: 'center' }}>
        <CommunityShortView data={data} />
      </SmallPaper>
      <SmallPaper>
        <h5>Community Rules</h5>
      </SmallPaper>
    </RightTray>
  );
};

RightTrayComponent.propTypes = {
  data: PropTypes.object,
};

export default connect(null, null)(RightTrayComponent);
