import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import getMuiTheme from 'material-ui/styles/muiThemeable';
import RaisedButton from 'material-ui/RaisedButton';
import styled from 'styled-components';
import strings from '../../lang';
import { ColorLink } from '../../utils/styledComponent';
import groupsObj from '../../fxconstants/groupsObj.json';

const Styled = styled.div`
  display: grid;
  grid-row-gap: 1em;
`;

const GroupShortView = ({
  gmData, muiTheme, cData, registerMembership,
}) => {
  const group = groupsObj[gmData && gmData.group_id];
  const btnStyle = { border: '1px solid', borderColor: muiTheme.palette.primary2Color };
  const labelStyle = { color: muiTheme.palette.primary2Color };

  return (
    <Styled>
      {/* {group.greeting && <li>{group.greeting}</li>} */}
      {(!registerMembership || !registerMembership.id) ? (
        <Link to={`/r/${cData.id}/register`} >
          <RaisedButton
            style={btnStyle}
            labelStyle={labelStyle}
            label="Register membership"
            backgroundColor={muiTheme.paper.backgroundColor}
            fullWidth
          />
        </Link>
      ) : (
        <div>
          <div className="text-large" style={{ color: muiTheme.palette.primary1Color }}>{strings.announce_registered_membership}</div>
          <div className="text-little">
            <div>Transaction ID: {registerMembership.id}</div>
            <div><ColorLink to={`/r/${cData.id}/register`} >{`${strings.label_status}: ${strings.label_waiting_purchase}`}</ColorLink></div>
          </div>
        </div>
      )}
      {group && group.fanpage && <RaisedButton
        style={btnStyle}
        labelStyle={labelStyle}
        label="Fan page"
        backgroundColor={muiTheme.paper.backgroundColor}
        fullWidth
        href={group.fanpage}
        target="_blank"
      />}
    </Styled>
  );
};

GroupShortView.propTypes = {
  gmData: PropTypes.object,
  cData: PropTypes.object,
  registerMembership: PropTypes.object,
  /**/
  muiTheme: PropTypes.object,
};

export default (getMuiTheme()(GroupShortView));
