import React from 'react';
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
  muiTheme, cData, registerMembership,
}) => (
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
            <p>{strings.label_became_membership_code}: <span className="font-normal"><b>{registerMembership.id}</b></span></p>
            <p>{strings.label_status}: {registerMembership.is_complete ? strings.label_purchased : strings.label_waiting_purchase}</p>
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

GroupShortViewRegistration.propTypes = {
  cData: PropTypes.object,
  registerMembership: PropTypes.object,
  /**/
  muiTheme: PropTypes.object,
};

export default (getMuiTheme()(GroupShortViewRegistration));
