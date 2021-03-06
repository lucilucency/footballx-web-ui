import styled, { css } from 'styled-components';
import ui from '../../theme';

export const StyledBody = styled.div`
  table {
    background-color: transparent !important;
    table-layout: auto !important;
    ${props => props.fixedColumns && css`
      table-layout: fixed !important;
    `}
    
    //margin-bottom: 20px;

    & th {
      ${props => props.fixedColumns && props.fixedColumns.map(col => css`
        &:nth-child(${col.pos}) {
          width: ${col.width};
        }
      `)}
      //background-color: rgba(0, 0, 0, 0.3);

      & svg {
        vertical-align: top;
        margin-left: 2px;

        &:hover {
          cursor: pointer;
        }
      }

      & div[data-id='tooltip'] {
        text-transform: none !important;
        font-weight: var(--fontWeightNormal);
        text-align: left;
      }
    }

    & tr {
      &:nth-child(odd) {
        //background-color: rgba(255, 255, 255, 0.019);
      }
      &:nth-child(even) {
        //background-color: rgba(0, 0, 0, 0.019);
      }
      &:last-child {
        border-bottom: none !important;
      }      

      & td {
        //border-top: 1px solid rgba(255, 255, 255, 0.06) !important;
        border-top: none !important;
        //border-bottom: 0 !important;
        border-bottom: none !important;
      }
    }

    & th,
    & td {
      padding-left: 8px !important;
      padding-right: 8px !important;

      &:first-child {
        //padding-left: 24px !important;
      }

      &:last-child {
        //padding-right: 24px !important;
        text-align: right;
      }
    }
  }
  /* Override material-ui style */

  .innerContainer > div > div {
    overflow-y: hidden !important;
    overflow-x: auto !important;
  }
  @media only screen and (max-width: 960px) {
    .innerContainer {
      //margin: 0 -25px;
    }
  }
  ${props => (props.hoverRowColumn ? `
  table {
    overflow: hidden !important;

    & tr {
      :hover {
        background: rgba(190, 190, 140, 0.07) !important;
      }   
    }

    & th,
    & td {
      position: relative !important;

      :hover::after {
        content: "" !important;
        position: absolute !important;
        background: rgba(190, 190, 190, 0.07) !important;
        left: 0 !important;
        top: -1000px !important;
        height: 2000px !important;
        width: 100% !important;
        pointer-events: none !important;
      }
    }
  }` : '')};
`;
export const StyledContainer = styled.div`
  min-width: 100%;
  clear: both;
`;
export const StyledHeaderCell = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  text-align: center;
  text-transform: uppercase;
  color: ${ui.textColorVariant1} !important;
  font-weight: 500;
`;
