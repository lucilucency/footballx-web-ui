import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import getMuiTheme from 'material-ui/styles/muiThemeable';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import styled from 'styled-components';
import constants from '../constants';
import { SmallPaper, format } from '../../utils/index';
import strings from '../../lang';
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
      <SmallPaper style={{ backgroundColor: muiTheme.palette.primary1Color, color: muiTheme.palette.alternateTextColor, fontWeight: constants.fontWeightHeavy }}>
        {(!registerMembership || !registerMembership.id) ? (
          <div>
            <div className="text-little" style={{ fontWeight: constants.fontWeightMedium }}>Tham gia cộng đồng hơn 10 000 fan MUSVN và nhận nhiều phần quà hấp dẫn!</div>
            <Link to={`/r/${cData.id}/register`} >
              <RaisedButton
                label="REGISTER MEMBERSHIP"
                backgroundColor={muiTheme.paper.backgroundColor}
                fullWidth
              />
            </Link>
          </div>
        ) : (
          <div>
            <div className="text-small" style={{ WebkitMarginAfter: '0', WebkitMarginBefore: '0' }}>{format(strings.label_registered_membership, cData.name)}</div>
            <Divider />
            <div className="text-little">
              <div>Transaction Code: {registerMembership.id}</div>
              <div>{strings.label_status}: {registerMembership.is_complete ? strings.label_purchased : strings.label_waiting_purchase}</div>
            </div>
            {!registerMembership.is_complete && (
              <Link to={`/r/${cData.id}/register`} >
                <RaisedButton
                  label="COMPLETE REGISTRATION"
                  backgroundColor={muiTheme.paper.backgroundColor}
                  fullWidth
                />
              </Link>
            )}
          </div>
        )}
      </SmallPaper>

      <SmallPaper>
        <div className="font-small" style={{ paddingBottom: 12 }}><b>Special Link</b></div>
        {group && group.fb && (
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
        {group && group.fanpage && (
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
  registerMembership: PropTypes.object,
  /**/
  muiTheme: PropTypes.object,
};

export default (getMuiTheme()(GroupShortView));
