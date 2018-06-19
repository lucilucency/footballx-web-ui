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
      padding: '1em 1em 0.5em 1em',
    },
    title: {
      color: ui.textColorVariant1,
    },
  },
  cardMedia: {
    style: {
      paddingTop: '1em',
      overflow: 'hidden',
      textAlign: 'center',
      cursor: 'pointer',
    },
  },
  cardText: {
    style: {
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
      borderTop: `1px solid ${ui.borderColorVariant1}`,
    },
  },
  cardTitle: {
    titleStyle: {
      fontWeight: 'bold',
      fontSize: ui.fontSizeNormal,
      lineHeight: '23px',
    },
    style: {
      textAlign: 'left',
      paddingTop: 0,
      paddingBottom: 0,
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
