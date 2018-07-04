import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import getMuiTheme from 'material-ui/styles/muiThemeable';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import styled from 'styled-components';
import constants from '../../constants';
import { SmallPaper, format } from '../../../utils/index';
import strings from '../../../lang';

const Styled = styled.div`
  display: grid;
  grid-row-gap: 1em;
`;

const GroupShortViewRegistration = ({
  muiTheme, cData, registerMembership, group_memberships,
}) => {
  const userGroupMembership = registerMembership &&
    group_memberships &&
    group_memberships.length &&
    group_memberships.find(el => el.group_membership_id === registerMembership.group_membership_id);

  return (
    <Styled>
      <SmallPaper style={{ backgroundColor: muiTheme.palette.primary1Color, color: muiTheme.palette.alternateTextColor }}>
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
              {!registerMembership.is_complete ? (
                <p>
                  {strings.label_became_membership_code}: <span className="font-normal"><b>{registerMembership.id}</b></span>
                  <br />
                  {strings.label_status}: {registerMembership.is_complete ? strings.label_purchased : strings.label_waiting_purchase}
                </p>
              ) : (
                <p>{strings.label_membership_code}: <span className="font-normal"><b>{userGroupMembership && userGroupMembership.code}</b></span></p>
              )}
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
    </Styled>
  );
};

GroupShortViewRegistration.propTypes = {
  cData: PropTypes.object,
  registerMembership: PropTypes.object,
  /**/
  muiTheme: PropTypes.object,
  group_memberships: PropTypes.array,
};

const mapStateToProps = state => ({
  group_memberships: state.app.metadata.data.group_memberships,
});

export default connect(mapStateToProps)(getMuiTheme()(GroupShortViewRegistration));
