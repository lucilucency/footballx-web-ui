import React from 'react';
import PropTypes from 'prop-types';
import strings from '../../lang';

const Error = props => (
  <div>{strings.err_default} {props.text ? props.text : ''}</div>
);

Error.propTypes = {
  text: PropTypes.string,
};

export default Error;
