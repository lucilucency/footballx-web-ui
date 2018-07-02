import React from 'react';
import PropTypes from 'prop-types';
import { Paper } from 'material-ui';
import ui from '../theme';
import constants from '../components/constants';

export const styles = {
  paper: {
    style: {
      padding: 16,
      minHeight: 70,
      boxShadow: 'none',
      fontSize: constants.fontSizeTiny,
    },
  },
  card: {
    style: { boxShadow: 'none' },
  },
  cardHeader: {
    style: {
      paddingBottom: 6,
    },
    title: {},
  },
  cardMedia: {
    style: {
      paddingLeft: '70px',
      paddingRight: '16px',
      paddingTop: '8px',
      overflow: 'hidden',
      textAlign: 'center',
      cursor: 'pointer',
    },
    styleCompact: {
      paddingTop: '16px',
      overflow: 'hidden',
      textAlign: 'center',
      cursor: 'pointer',
    },
  },
  cardText: {
    style: {
      paddingLeft: '70px',
      fontWeight: 'normal',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
      fontFamily: constants.fontFamilySecondary,
      fontSize: constants.fontSizeSmall,
      lineHeight: constants.lineHeightSmall,
      textAlign: 'justify',
    },
    styleCompact: {
      padding: '0 16px',
      fontWeight: 'normal',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
      fontFamily: constants.fontFamilySecondary,
      fontSize: constants.fontSizeLittle,
      lineHeight: constants.lineHeightLittle,
      textAlign: 'justify',
    },
  },
  cardActions: {
    style: {
      padding: '0 0',
      marginLeft: '70px',
      marginRight: '16px',
      borderTop: `1px solid ${ui.borderColorVariant1}`,
    },
    styleCompact: {
      padding: '0 0',
      marginLeft: '16px',
      marginRight: '16px',
      borderTop: `1px solid ${ui.borderColorVariant1}`,
    },
  },
  cardTitle: {
    titleStyle: {
      fontWeight: 'bold',
      fontSize: constants.fontSizeNormal,
      lineHeight: constants.lineHeightNormal,
    },
    titleStyleCompact: {
      display: 'inline-block',
      padding: '0 16px',
      textAlign: 'justify',
      fontWeight: 'bold',
      fontSize: constants.fontSizeSmall,
      lineHeight: constants.lineHeightSmall,
    },
    style: {
      textAlign: 'left',
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: '70px',
      wordBreak: 'break-word',
    },
    styleCompact: {
      padding: 0,
      textAlign: 'left',
      wordBreak: 'break-word',
    },
  },
};

export const SmallPaper = ({ children, style = {} }) => (
  <Paper style={{ ...styles.paper.style, ...style }}>
    {children}
  </Paper>
);
SmallPaper.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
};
