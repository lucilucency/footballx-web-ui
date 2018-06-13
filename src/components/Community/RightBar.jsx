import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RightTray, SmallPaper } from '../../utils/index';
import CommunityShortView from './CommunityShortView';
import AboutXFooter from '../About/Footer';

const RightTrayComponent = (props) => {
  const { data } = props;

  return (
    <RightTray>
      <SmallPaper style={{ textAlign: 'center' }}>
        <CommunityShortView data={data} />
      </SmallPaper>
      <SmallPaper>
        <h4>Community Rules</h4>
      </SmallPaper>
      <div>
        <AboutXFooter />
      </div>
    </RightTray>
  );
};

RightTrayComponent.propTypes = {
  data: PropTypes.object,
};

export default connect(null, null)(RightTrayComponent);
