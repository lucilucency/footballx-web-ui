import React from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import RaisedButton from 'material-ui/RaisedButton';
import styled from 'styled-components';
import groupsObj from '../../fxconstants/groupsObj.json';

const Styled = styled.div`
  display: grid;
  grid-row-gap: 1em;
`;

class GroupShortView extends React.Component {
  constructor(props) {
    super(props);
    this.group = groupsObj[props.groupID];
  }

  componentDidMount() {
    // console.log(this.group);
  }

  render() {
    const { group } = this;
    const { muiTheme } = this.props;
    const btnStyle = { border: '1px solid', borderColor: muiTheme.palette.primary2Color };
    const labelStyle = { color: muiTheme.palette.primary2Color };

    return (
      <Styled>
        {/* {group.greeting && <li>{group.greeting}</li>} */}
        {group.fanpage && <RaisedButton
          style={btnStyle}
          labelStyle={labelStyle}
          label="Fan page"
          backgroundColor={muiTheme.palette.canvasColor}
          fullWidth
          href={group.fanpage}
          target="_blank"
        />}
        <RaisedButton
          target="_blank"
          label="sample"
          onClick={this.popupCreatePost}
          fullWidth
          primary
        />
        <RaisedButton
          style={btnStyle}
          labelStyle={labelStyle}
          label="Register membership"
          backgroundColor={muiTheme.palette.canvasColor}
          fullWidth
        />
      </Styled>
    );
  }
}

GroupShortView.propTypes = {
  /**/
  groupID: PropTypes.number,
  muiTheme: PropTypes.object,
};

export default (muiThemeable()(GroupShortView));
