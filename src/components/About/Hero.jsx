import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import ui from '../../theme';
import { CreatePostButton } from '../Post/components/index';
import strings from '../../lang/index';
import Shooter from './Shooter';

const AboutXStyled = styled.div`
  text-align: left;
`;
const HeroStyled = styled.div`
  background-image: url(/assets/images/stadium.png);
  background-repeat: no-repeat;
  background-position: center bottom;
  -webkit-background-size: 150%;background-size: 150%;
  height: 120px;
  position: relative;
  overflow: hidden;
  .layer {
    background-color: rgba(0, 0, 0, 0.7);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .voice {
    position: absolute;
    bottom: 0;
    left: 1em;
    text-align: left;
    color: ${ui.alternateTextColor};
    
    .appName {
      font-size: ${ui.fontSizeSmall};
      -webkit-margin-after: 0;
    }
    .appDesc {
      font-size: ${ui.fontSizeTiny};
      display: block;
      -webkit-margin-before: 0;
      -webkit-margin-after: 1em;
    }
  }
  .shooter {
    position: absolute;
    right: 10px;
    bottom: 8px;
  }
  .x {
    position: absolute;
    right: -7px;
    bottom: -21px;
    width: 93px;
    height: 93px;
  }
`;
const Hero = () => (
  <HeroStyled>
    <div className="layer" />
    <div className="voice">
      <div className="appName">
        <b>{strings.app_name}</b>
      </div>
      <div className="appDesc">
        {strings.app_description}
      </div>
    </div>
    <img src="/assets/images/icons/icon-128x128.png" alt="" className="x" />
    <div className="shooter"><Shooter /></div>
  </HeroStyled>
);

const AboutX = (props) => {
  const { isLoggedIn } = props;
  return (
    <AboutXStyled>
      <Hero />
      <div style={{ padding: 8, fontSize: ui.fontSizeTiny }}>
        <p><b>{strings.paragraph_app_desc_primary}</b></p>
        <p>
          <small className="text-tiny">
            {strings.paragraph_app_desc_secondary}
          </small>
        </p>
        {isLoggedIn && <CreatePostButton />}
      </div>
    </AboutXStyled>
  );
};

AboutX.propTypes = {
  isLoggedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
  isLoggedIn: Boolean(state.app.metadata.data.user),
});

export default connect(mapStateToProps, null)(AboutX);
