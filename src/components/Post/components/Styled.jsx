import styled, { css } from 'styled-components';
import constants from '../../constants';

export const LinkCoverStyled = styled.span`
  color: ${constants.colorMutedLight};
  font-size: ${constants.fontSizeSmall};
`;

export const LinkPreview = styled.div`
  display: grid;
  grid-gap: 1em;
  img {
    float: left;
    max-width: 200px;
  }
  ${props => (props.hasImage ? css`grid-template-columns: 1fr 200px;` : css`grid-template-columns: 1fr;`)}
  @media only screen and (max-width: 768px) {
    img {
      max-width: 120px;
    }
    ${props => (props.hasImage ? css`grid-template-columns: 1fr 120px;` : css`grid-template-columns: 1fr;`)}
  }
`;

export const ImageWrapper = styled.div`
  text-align: center;
  width: 100%;
`;

export const Image = styled.img`
  vertical-align: middle;
  max-width: 100%;
  min-width: 50%;
`;

export const ImageCompact = styled.img`
  vertical-align: middle;
  min-width: 50%;
  max-width: 100%;
  max-height: 512px;
  margin: 0 auto;
  display: block;
  position: relative;
`;

export const TextWrapper = styled.div`
  img {
    max-width: 100px;
    max-height: 100px;
  }
`;

export const PostsGridStyled = styled.div`
  text-align: left;
  ${props => props.columns && css`
    -moz-column-count: ${props.columns}; 
    -webkit-column-count: ${props.columns}; 
    column-count: ${props.columns};
    -moz-column-gap: 1em;
    -webkit-column-gap: 1em; 
    column-gap: 1em;
  `}
  
  > div {
     display: inline-block;
     margin-bottom: 1em;
     width: 100%; 
  }
`;
