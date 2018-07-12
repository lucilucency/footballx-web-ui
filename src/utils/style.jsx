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
      paddingBottom: 0,
    },
    styleCompact: {
      paddingBottom: 8,
    },
    title: {},
  },
  cardMedia: {
    style: {
      paddingLeft: '70px',
      paddingRight: '24px',
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
      paddingRight: '24px',
      fontWeight: 'normal',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
      fontFamily: constants.fontFamilySecondary,
      fontSize: constants.fontSizeSmall,
      lineHeight: constants.lineHeightSmall,
      // textAlign: 'justify',
    },
    styleCompact: {
      padding: '0 16px 16px 16px',
      fontWeight: 'normal',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
      fontFamily: constants.fontFamilySecondary,
      fontSize: constants.fontSizeLittle,
      lineHeight: constants.lineHeightLittle,
      // textAlign: 'justify',
    },
  },
  cardActions: {
    style: {
      padding: '0 0',
      marginLeft: '70px',
      marginRight: '24px',
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
      // display: 'inline-block',
      wordWrap: 'break-word',
      padding: '0 16px 0px 70px',
      fontWeight: 'bold',
      fontSize: constants.fontSizeNormal,
      lineHeight: constants.lineHeightNormal,
    },
    titleStyleCompact: {
      // display: 'inline-block',
      wordWrap: 'break-word',
      padding: '0 16px',
      fontWeight: 'bold',
      fontSize: constants.fontSizeNormal,
      lineHeight: constants.lineHeightNormal,
    },
    style: {
      textAlign: 'justify',
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: '70px',
      wordBreak: 'break-word',
    },
    styleCompact: {
      padding: 0,
      textAlign: 'justify',
      wordBreak: 'break-word',
    },
  },
  commentText: {
    style: {
      padding: '0 0px 0px 0px',
      fontWeight: 'normal',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
      fontFamily: constants.fontFamilySecondary,
      fontSize: constants.fontSizeSmall,
      lineHeight: constants.lineHeightSmall,
      textAlign: 'justify',
    },
    styleCompact: {
      padding: '0 16px 16px 16px',
      fontWeight: 'normal',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
      fontFamily: constants.fontFamilySecondary,
      fontSize: constants.fontSizeLittle,
      lineHeight: constants.lineHeightLittle,
      textAlign: 'justify',
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
