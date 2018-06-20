import React from 'react';
import styled, { css } from 'styled-components';
import ui from '../../theme';

const Styled = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
  ${props => props.bg && css`
    background-image: url(${props.bg});
    background-repeat: no-repeat;
    -webkit-background-size: cover;background-size: cover;
  `}
  
  .name {
    position: absolute;
    color: ${ui.alternateTextColor};
    bottom: 0;
    left: 1em;
  }
`;

const Cover = propsVar => (
  <Styled bg={propsVar.bg}>
    <div className="name text-big">{propsVar.name}</div>
  </Styled>
);

export default Cover;
