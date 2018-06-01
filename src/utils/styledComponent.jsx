import React from 'react';
import { Dialog, Paper, Subheader } from 'material-ui';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { ValidatorForm } from './FormValidator';
import constants from '../components/constants';
import { FullScreenDialog } from './FullScreenDialog';

export { Subheader, Paper };

export const Container = styled.div`
  display: grid;
  grid-gap: 24px;
  padding: 24px;
  grid-template-columns: 1fr 300px;
  //max-width: 992px;
  //margin: auto;
  ${props => props.columns && css`
    grid-template-columns: ${props.columns};
  `}
  
  @media only screen and (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 12px 0;
  }
  
  > div {
    max-width: 100vw;
  }
`;

export const RightTray = styled.div`
  > div {
    margin-bottom: 1em;
    position: relative;
    width: 100%;
  }
  
  //> div[data='page-welcome'] {
  //  padding-top: calc(75% + 40px);
  //}
`;

export const FormWrapper = styled(ValidatorForm)`
  background-color: ${constants.theme().surfaceColorPrimary};
  padding: 1em;
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
  color: #000;
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
