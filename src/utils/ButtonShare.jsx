import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { announce } from '../actions/index';
import strings from '../lang/index';

const ButtonShare = ({ clipboard, announceFn, child }) => (
  <CopyToClipboard
    text={clipboard}
    onCopy={() => {
      announceFn({
        message: strings.announce_copied,
      });
    }}
  >
    {child}
  </CopyToClipboard>
);

ButtonShare.propTypes = {
  clipboard: PropTypes.string,
  announceFn: PropTypes.func,
  child: PropTypes.node,
  /**/
};

const mapDispatchToProps = dispatch => ({
  announceFn: props => dispatch(announce(props)),
});

export default connect(null, mapDispatchToProps)(ButtonShare);

