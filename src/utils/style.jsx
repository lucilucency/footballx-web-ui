import React from 'react';
import PropTypes from 'prop-types';
import { Paper } from 'material-ui';
import ui from '../theme';

export const styles = {
  paper: {
    style: {
      padding: 8,
      minHeight: 70,
      boxShadow: 'none',
      fontSize: ui.fontSizeTiny,
    },
  },
  card: {
    style: { boxShadow: 'none' },
  },
  cardHeader: {
    style: {
      paddingBottom: 6,
    },
    title: {
      color: ui.textColorVariant1,
    },
  },
  cardMedia: {
    style: {
      paddingLeft: '70px',
      paddingTop: '8px',
      paddingRight: '16px',
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
      fontSize: ui.fontSizeSmall,
      fontFamily: ui.fontFamilySecondary,
      lineHeight: ui.lineHeightSmall,
      color: ui.textColorVariant1,
    },
  },
  cardActions: {
    style: {
      padding: '0 0',
      marginLeft: '70px',
      marginRight: '16px',
      borderTop: `1px solid ${ui.borderColorVariant1}`,
    },
  },
  cardTitle: {
    titleStyle: {
      fontWeight: 'bold',
      fontSize: ui.fontSizeNormal,
      lineHeight: ui.lineHeightNormal,
      color: ui.textColorPrimary,
    },
    style: {
      textAlign: 'left',
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: '70px',
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
