import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { langs } from '../../lang/index';
import ui, { themes } from '../../theme/index';

const Styled = styled.div`
  text-align: center;
  font-size: ${ui.fontSizeSmall};
  color: ${ui.neutralColor}
`;

const getLocalization = window.localStorage.getItem('localization');
const setLocalization = (e, payload) => {
  e.preventDefault();
  window.localStorage.setItem('localization', payload);
  window.location.reload();
};

const getTheme = window.localStorage.getItem('theme');
const setTheme = (e, payload) => {
  e.preventDefault();
  window.localStorage.setItem('theme', payload);
  window.location.reload();
};

const AboutXFooter = () => (
  <Styled>
    <div>
      <small>
        {langs.map(lang => <a href="/" onClick={e => setLocalization(e, lang.value)} style={{ marginRight: 8, color: getLocalization !== lang.value && ui.neutralColor }}>{lang.native}</a>)}
      </small>
      &nbsp;|&nbsp;
      <small>
        {themes.map(theme => <a href="/" onClick={e => setTheme(e, theme.value)} style={{ marginRight: 8, color: getTheme !== theme.value && ui.neutralColor }}>{theme.native}</a>)}
      </small>
    </div>
  </Styled>
);

AboutXFooter.propTypes = {
  // isLoggedIn: PropTypes.bool,
};

export default connect()(AboutXFooter);
