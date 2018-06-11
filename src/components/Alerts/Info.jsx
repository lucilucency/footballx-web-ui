import React from 'react';
import PropTypes from 'prop-types';
import ActionInfo from 'material-ui/svg-icons/action/info';
import styled from 'styled-components';
import ui from '../../theme';

const StyledDiv = styled.div`
  & a {
    color: ${ui.disabledColorVariant1};
    font-size: ${ui.fontSizeSmall};
  }

  & svg {
    vertical-align: sub;
    margin-right: 5px;
    width: 15px !important;
    height: 15px !important;
    fill: ${ui.linkColor} !important;
  }
`;

const Info = ({ children, className, msg }) => (
  <StyledDiv className={`${className}`}>
    <ActionInfo />
    <span>
      {!children && msg}
      {!msg && children}
    </span>
  </StyledDiv>
);

Info.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  msg: PropTypes.string,
};

export default Info;
