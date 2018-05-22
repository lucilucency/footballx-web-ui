import styled, { css } from 'styled-components';
import constants from '../../constants';

export const LinkCoverStyled = styled.span`
  color: ${constants.colorMutedLight};
  font-size: ${constants.fontSizeSmall};
`;

export const LinkPreview = styled.div`
  display: grid;
  grid-gap: 1em;
  > img {
    float: left;
  }
  ${props => (props.hasImage ? css`grid-template-columns: 1fr 200px;` : css`grid-template-columns: 1fr;`)}
  @media only screen and (max-width: 660px) {
    grid-template-columns: 1fr;
  }
`;

export const ImageWrapper = styled.div`
  text-align: center;
  width: 100%;
`;

export const Image = styled.img`
  vertical-align: middle;
  width: 100%;
`;

export const ImageCompact = styled.img`
  vertical-align: middle;
  max-width: 100%;
  max-height: 512px;
  margin: 0 auto;
  display: block;
  position: relative;
`;
