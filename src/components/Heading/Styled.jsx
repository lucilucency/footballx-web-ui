import styled from 'styled-components';
import ui from '../../theme';

export const StyledDiv = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;

  & svg {
    vertical-align: top;
    height: 26px !important;
    width: 26px !important;
    margin-right: 6px;
    opacity: 0.8;
    fill: ${ui.textColorPrimary};
  }

  & a {
    color: ${ui.textColorPrimary};
    text-decoration: none;

    &:hover {
      color: ${ui.linkColor};
    }
  }

  & .title {
    font-size: 20px;
  }

  & .subtitle {
    margin-left: 5px;
    font-size: ${ui.fontSizeNormal};
    color: ${ui.disabledColorVariant1};
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
