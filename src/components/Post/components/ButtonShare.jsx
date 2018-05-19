/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatButton } from 'material-ui';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { announce } from '../../../actions';
import constants from '../../constants';

const ButtonShare = ({ clipboard, announce }) => (
  <CopyToClipboard
    text={clipboard}
    onCopy={() => {
      announce({
        message: 'Copied to clipboard!',
      });
    }}
  >
    <FlatButton
      target="_blank"
      label="Share"
      style={{
        marginTop: 6,
        lineHeight: '32px',
        height: 34,
        minWidth: 60,
      }}
      labelStyle={{
        fontSize: constants.fontSizeSmall,
        paddingLeft: 5,
        paddingRight: 5,
        fontWeight: constants.fontWeightHeavy,
      }}
    />
  </CopyToClipboard>
);

ButtonShare.propTypes = {
  clipboard: PropTypes.string,
  announce: PropTypes.func,
  /**/
};

const mapDispatchToProps = dispatch => ({
  announce: props => dispatch(announce(props)),
});

export default connect(null, mapDispatchToProps)(ButtonShare);

