import styled from 'styled-components';
import constants from '../constants';

export const StyledDiv = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;

  & svg {
    vertical-align: top;
    height: 26px !important;
    width: 26px !important;
    margin-right: 6px;
    opacity: 0.8;
    fill: ${constants.theme().textColorPrimary};
  }

  & a {
    color: ${constants.theme().textColorPrimary};
    text-decoration: none;

    &:hover {
      color: ${constants.theme().linkColor};
    }
  }

  & .title {
    font-size: 20px;
  }

  & .subtitle {
    margin-left: 5px;
    font-size: ${constants.fontSizeNormal};
    color: ${constants.colorMutedLight};
  }
`;

export const TwoLineDiv = StyledDiv.extend`
  text-align: center;
  padding: 10px 0 15px;

  & span:last-child {
    display: block;
    text-transform: lowercase;
  }
`;
