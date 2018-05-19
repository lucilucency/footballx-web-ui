/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { announce } from '../../../actions';

const ButtonShare = ({ clipboard, announce, child }) => (
  <CopyToClipboard
    text={clipboard}
    onCopy={() => {
      announce({
        message: 'Copied to clipboard!',
      });
    }}
  >
    {child}
  </CopyToClipboard>
);

ButtonShare.propTypes = {
  clipboard: PropTypes.string,
  announce: PropTypes.func,
  child: PropTypes.node,
  /**/
};

const mapDispatchToProps = dispatch => ({
  announce: props => dispatch(announce(props)),
});

export default connect(null, mapDispatchToProps)(ButtonShare);

