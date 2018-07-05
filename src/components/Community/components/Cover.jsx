import React from 'react';
import styled, { css } from 'styled-components';
import ui from '../../../theme/index';

const Styled = styled.div`
  width: 100%;
  height: 350px;
  position: relative;
  ${props => props.bg && css`
    background-image: url(${props.bg});
    background-repeat: no-repeat;
    -webkit-background-size: cover;background-size: cover;
    background-position: top center;
  `}
  
  .name {
    position: absolute;
    color: ${ui.alternateTextColor};
    bottom: 0;
    left: 1em;
  }
  
  @media only screen and (max-width: 768px) {
    height: 150px;
  }
`;

const Cover = propsVar => (
  <Styled bg={propsVar.bg}>
    <div className="name text-big">{!propsVar.isCompact && propsVar.name}</div>
  </Styled>
);

export default Cover;
