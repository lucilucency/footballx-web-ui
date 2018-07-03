import React from 'react';
import PropTypes from 'prop-types';
import getMuiTheme from 'material-ui/styles/muiThemeable';
import RaisedButton from 'material-ui/RaisedButton';
import styled from 'styled-components';
import { SmallPaper } from '../../utils/index';
import groupsObj from '../../fxconstants/groupsObj.json';
import GroupShortViewRegistration from './components/GroupShortViewRegistration';

const Styled = styled.div`
  display: grid;
  grid-row-gap: 1em;
`;

const GroupShortView = ({
  gmData, muiTheme, cData, registerMembership, isCompact,
}) => {
  const group = groupsObj[gmData && gmData.group_id];
  const btnStyle = { border: '1px solid', borderColor: muiTheme.palette.primary2Color };
  const labelStyle = { color: muiTheme.palette.primary2Color };

  return (
    <Styled>
      {!isCompact && (
        <GroupShortViewRegistration
          registerMembership={registerMembership}
          cData={cData}
        />
      )}

      <SmallPaper>
        <div className="font-small" style={{ paddingBottom: 12 }}><b>Special Link</b></div>
        {group.fb && (
          <RaisedButton
            style={btnStyle}
            labelStyle={labelStyle}
            label="FACEBOOK"
            backgroundColor={muiTheme.paper.backgroundColor}
            fullWidth
            href={group.fb}
            target="_blank"
          />
        )}
        {group.fanpage && (
          <RaisedButton
            style={btnStyle}
            labelStyle={labelStyle}
            label="OFFICIAL WEBSITE"
            backgroundColor={muiTheme.paper.backgroundColor}
            fullWidth
            href={group.fanpage}
            target="_blank"
          />
        )}
      </SmallPaper>
    </Styled>
  );
};

GroupShortView.propTypes = {
  gmData: PropTypes.object,
  cData: PropTypes.object,
  isCompact: PropTypes.bool,
  registerMembership: PropTypes.object,
  /**/
  muiTheme: PropTypes.object,
};

export default (getMuiTheme()(GroupShortView));
