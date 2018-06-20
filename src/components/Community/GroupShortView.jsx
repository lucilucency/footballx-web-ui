import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import groupsObj from '../../fxconstants/groupsObj.json';

class GroupShortView extends React.Component {
  constructor(props) {
    super(props);
    this.group = groupsObj[props.groupID];
  }

  componentDidMount() {
    // console.log(this.group);
  }

  render() {
    return (
      <div>
        {JSON.stringify(this.group)}
      </div>
    );
  }
}

GroupShortView.propTypes = {
  /**/
  groupID: PropTypes.number,
};

export default connect()(GroupShortView);
