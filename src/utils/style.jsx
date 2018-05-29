import React from 'react';
import PropTypes from 'prop-types';
import { Paper } from 'material-ui';
import constants from '../components/constants';

export const styles = {
  paper: {
    style: {
      padding: 8,
      minHeight: 120,
      boxShadow: 'none',
      fontSize: constants.fontSizeTiny,
    },
  },
  card: {
    style: { boxShadow: 'none' },
  },
  cardHeader: {
    style: { padding: '1em 1em 0.5em 1em' },
  },
  cardMedia: {
    style: {
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
      fontSize: constants.fontSizeSmall,
      fontFamily: constants.theme().fontFamilySecondary,
      lineHeight: constants.lineHeightSmall,
      color: constants.theme().textColorPrimary3,
    },
  },
  cardActions: {
    style: {
      padding: '0 0',
    },
  },
  cardTitle: {
    titleStyle: {
      fontWeight: 'bold',
      fontSize: constants.fontSizeMedium,
      lineHeight: '23px',
    },
    style: {
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
