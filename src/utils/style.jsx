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
      fontSize: constants.fontSizeSmall,
      fontFamily: constants.fontFamilySecondary,
      lineHeight: constants.lineHeightSmall,
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
      fontSize: constants.fontSizeNormal,
      lineHeight: constants.lineHeightNormal,
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
