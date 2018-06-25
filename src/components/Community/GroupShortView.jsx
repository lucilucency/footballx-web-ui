import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import getMuiTheme from 'material-ui/styles/muiThemeable';
import RaisedButton from 'material-ui/RaisedButton';
import styled from 'styled-components';
import groupsObj from '../../fxconstants/groupsObj.json';

const Styled = styled.div`
  display: grid;
  grid-row-gap: 1em;
`;

const GroupShortView = ({ gmData, muiTheme, cData }) => {
  const group = groupsObj[gmData && gmData.group_id];
  const btnStyle = { border: '1px solid', borderColor: muiTheme.palette.primary2Color };
  const labelStyle = { color: muiTheme.palette.primary2Color };

  return (
    <Styled>
      {/* {group.greeting && <li>{group.greeting}</li>} */}
      {group && group.fanpage && <RaisedButton
        style={btnStyle}
        labelStyle={labelStyle}
        label="Fan page"
        backgroundColor={muiTheme.palette.canvasColor}
        fullWidth
        href={group.fanpage}
        target="_blank"
      />}
      <Link to={`/r/${cData.id}/register`} >
        <RaisedButton
          style={btnStyle}
          labelStyle={labelStyle}
          label="Register membership"
          backgroundColor={muiTheme.palette.canvasColor}
          fullWidth
        />
      </Link>
    </Styled>
  );
};

GroupShortView.propTypes = {
  gmData: PropTypes.object,
  cData: PropTypes.object,
  /**/
  muiTheme: PropTypes.object,
};

export default (getMuiTheme()(GroupShortView));
