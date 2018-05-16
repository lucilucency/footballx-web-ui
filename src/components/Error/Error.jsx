import React from 'react';
// import PropTypes from 'prop-types';
import {
  List,
  ListItem,
} from 'material-ui';
import strings from '../../lang';
import constants from '../constants';
import { IconFail } from '../Icons';

const Error = ({ text, errors } = {}) => {
  if (errors) {
    errors.map((el, index) => <div key={index}>{el}</div>);
    return (
      <List>
        {errors.map((r, index) => (<ListItem
          key={index}
          primaryText={r}
          // eslint-disable-next-line no-nested-ternary
          leftIcon={<IconFail color={constants.colorRed} title={strings.form_general_fail} />}
          secondaryText={r.error && r.error}
          secondaryTextLines={1}
        />))}
      </List>
    );
  }

  return <div>{strings.err_default} {text || ''}</div>;
};

export default Error;
