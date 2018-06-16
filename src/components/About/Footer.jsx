import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import strings, { langs } from '../../lang/index';
import ui, { themes } from '../../theme/index';

const Styled = styled.div`
  text-align: center;
  font-size: ${ui.fontSizeSmall};
  color: ${ui.neutralColor}
`;

const getLocalization = window.localStorage.getItem('localization') || langs[0].value;
const setLocalization = (e, payload) => {
  e.preventDefault();
  window.localStorage.setItem('localization', payload);
  window.location.reload();
};

const getTheme = window.localStorage.getItem('theme') || themes[0].value;
const setTheme = (e, payload) => {
  e.preventDefault();
  window.localStorage.setItem('theme', payload);
  window.location.reload();
};

const AboutXFooter = () => (
  <Styled>
    <div>
      <small>
        <a key="about" href="https://ttab.me" target="_blank" rel="noopener noreferrer">{strings.app_about} {strings.app_name}</a>
      </small>
      &nbsp;|&nbsp;
      <small>
        <a key="privacy" href="https://ttab.me/privacy" target="_blank" rel="noopener noreferrer">{strings.app_privacy_terms}</a>
      </small>
    </div>
    <div>
      <small>
        {langs.map(lang => <a key={lang.value} href="/" onClick={e => setLocalization(e, lang.value)} style={{ marginRight: 8, color: getLocalization !== lang.value && ui.neutralColor }}>{lang.native}</a>)}
      </small>
    </div>
    {true && (
      <div>
        <small>
          {themes.map(theme => (
            <a key={theme.value} href="/" onClick={e => setTheme(e, theme.value)} style={{ marginRight: 8, color: getTheme !== theme.value && ui.neutralColor }}>
              {theme.native}
            </a>
          ))}
        </small>
      </div>
    )}
  </Styled>
);

AboutXFooter.propTypes = {
  // isLoggedIn: PropTypes.bool,
};

export default connect()(AboutXFooter);
