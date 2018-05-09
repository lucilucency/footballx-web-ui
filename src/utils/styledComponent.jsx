import React from 'react';
import { Dialog } from 'material-ui';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { ValidatorForm } from './FormValidator';
import constants from '../components/constants';
import { FullScreenDialog } from './FullScreenDialog';

export const FormWrapper = styled(ValidatorForm)`
  margin: 20px;
  transition: max-height 1s;
  box-sizing: border-box;
  ${props => ((props['data-display']) ? css`
      max-height: 10000px;
  ` : css`
      max-height: 0;
  `)}

  ${props => (props['data-toggle'] && css`
    overflow: hidden;
    padding: 0 15px;
 `)}

  .actions {
    text-align: right;
    ${props => (props['data-popup'] && css`
      margin: 24px -24px -24px -24px;
      padding: 8px;
   `)}
  }
`;

export const ActiveLink = styled(Link)`
  :hover {
    text-decoration: underline;
  }
`;

export const MutedLink = styled(Link)`
  color: ${constants.colorMutedLight};
  
  :hover {
    text-decoration: underline;
  }
`;

export function renderDialog({
  view = <h1>Welcome!</h1>,
  fullScreen = false,
  title,
  actions = [],
  contentStyle = {},
  modal,
  autoScrollBodyContent = true,
} = {}, open, onRequestClose = () => {
  console.warn('Request close dialog');
}) {
  if (fullScreen) {
    return (
      <FullScreenDialog
        title={title}
        actions={actions}
        open={open}
        onRequestClose={onRequestClose}
        modal={modal}
        contentStyle={contentStyle}
        autoScrollBodyContent={autoScrollBodyContent}
      >
        {view}
      </FullScreenDialog>
    );
  }
  return (
    <Dialog
      title={title}
      actions={actions}
      open={open}
      onRequestClose={onRequestClose}
      modal={modal}
      contentStyle={contentStyle}
      autoScrollBodyContent={autoScrollBodyContent}
    >
      {view}
    </Dialog>
  );
}
