import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RightTray, SmallPaper } from '../../utils/index';

const RightTrayComponent = (props) => {
  const { data } = props;
  return (
    <RightTray>
      <div data="page-welcome">
        <SmallPaper>
          <h1>{data.name}</h1>
        </SmallPaper>
      </div>
      <div data="ads">
        <SmallPaper>
          <h4>Rules</h4>
        </SmallPaper>
      </div>
    </RightTray>
  );
};

RightTrayComponent.propTypes = {
  data: PropTypes.object,
};

export default connect(null, null)(RightTrayComponent);
