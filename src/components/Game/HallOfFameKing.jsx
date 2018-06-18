import React from 'react';
import { connect } from 'react-redux';
import { Avatar } from 'material-ui';
import styled from 'styled-components';
import ui from '../../theme';

const LARGE_IMAGE_SIZE = 64;

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ImageContainer = styled.div`
  padding-top: 2em;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
const InfoContainer = styled.div`
  padding-top: 1em;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  & li {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    line-height: 1.5em;
    
    @media only screen and (max-width: 662px) {
      flex-direction: column;
      align-items: center;
    }
    
    & span[data='name'] {
      color: ${ui.textColorVariant1};
      font-size: ${ui.fontSizeLarge};
      text-align: center;
    }
    
    & span[data='address'] {
      color: rgba(245, 245, 245, 0.870588);
      font-size: 18px;
      text-align: center;
    }
  }
`;
const AvatarStyled = styled(Avatar)`
  box-shadow: 0 0 15px 2px rgba(0, 0, 0, 0.4);

  @media only screen and (max-width: 662px) {
    margin-left: 0 !important;
  }
`;

const HallOfFameKing = (propsVar) => {
  const {
    small, extraSmall, data,
  } = propsVar;

  const avatarStyle = {
    marginLeft: small ? 30 : 0,
    marginRight: extraSmall ? 30 : 0,
  };

  return (
    <Styled>
      <ImageContainer>
        <AvatarStyled
          color={ui.yellowA400}
          backgroundColor={ui.orangeA700}
          style={avatarStyle}
          size={LARGE_IMAGE_SIZE}
        >
          I
        </AvatarStyled>
      </ImageContainer>
      <InfoContainer>
        <li>
          <span data="name">{data && data.name}</span>
          <small>{data && data.rank}</small>
        </li>
      </InfoContainer>
    </Styled>
  );
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
  small: state.browser.greaterThan.small,
  extraSmall: state.browser.greaterThan.extraSmall,
});

export default connect(mapStateToProps)(HallOfFameKing);
