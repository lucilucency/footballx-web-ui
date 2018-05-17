import React from 'react';
// import PropTypes from 'prop-types';
import {
  List,
  ListItem,
} from 'material-ui';
import strings from '../../lang';
import constants from '../constants';
import { IconFail } from '../Icons';

const styles = {
  error: {
    fontSize: '0.9em',
    color: 'red',
    transition: 'opacity 1s ease-out',
  },
  closeIcon: {
    fill: constants.colorDanger,
    width: '1em',
    height: '1em',
    display: 'inline-block',
  },
};

const Error = ({ text, errors } = {}) => {
  if (errors) {
    errors.map((el, index) => <div key={index}>{el}</div>);
    return (
      <List>
        {errors.map(r => (<ListItem
          key={r}
          primaryText={r}
          // eslint-disable-next-line no-nested-ternary
          leftIcon={<IconFail color={constants.colorRed} title={strings.form_general_fail} />}
          secondaryText={r.error && r.error}
          secondaryTextLines={1}
        />))}
      </List>
    );
  }

  return <i style={styles.error}>{text || strings.err_default}</i>;
};

export default Error;
