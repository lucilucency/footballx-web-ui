import React from 'react';
import { connect } from 'react-redux';
import { Avatar, Badge } from 'material-ui';
import IconValidated from 'material-ui/svg-icons/action/check-circle';
import styled from 'styled-components';
import constants from '../../../theme';

const LARGE_IMAGE_SIZE = 124;

const Header = styled.div`
  display: flex;
  flex-direction: row;

  @media only screen and (max-width: 662px) {
    flex-direction: column;
    align-items: center;
  }
`;
const ImageContainer = styled.div`
  padding-top: 2em;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
const ValidatedBadge = styled(IconValidated)`
  width: 18px;
  height: 18px;
  position: relative;

  &[data-hint-position="top"] {
    &::before {
        top: -7px;
        margin-left: 3px;
    }

    &::after {
    margin-bottom: 7px;
    margin-left: -7px;
    }
  }
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
    justify-content: flex-start;
    flex-wrap: wrap;
    line-height: 1.5em;
    
    @media only screen and (max-width: 662px) {
      flex-direction: column;
      align-items: center;
    }
    
    & span[data='name'] {
      color: ${constants.textColorVariant1};
      font-size: 28px;
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

const HotspotHeader = (propsVar) => {
  const {
    small, extraSmall, data,
  } = propsVar;

  let badgeStyle = {
    fontSize: 20,
    top: 5,
    left: 40,
    background: constants.green,
    width: 18,
    height: 18,
  };

  const avatarStyle = {
    marginLeft: small ? 30 : 0,
    marginRight: extraSmall ? 30 : 0,
  };

  if (!small) {
    badgeStyle = {
      ...badgeStyle,
      marginLeft: -1 * (LARGE_IMAGE_SIZE / 2) * 0.75,
    };
  }

  // const iconStyle = {
  //   width: 15,
  //   height: 15,
  //   color: constants.disabledColorVariant1,
  // };

  return (
    <Header>
      <ImageContainer>
        <Badge
          badgeContent={<ValidatedBadge
            data-hint="Validated"
            data-hint-position="top"
          />}
          badgeStyle={badgeStyle}
          style={{
            margin: 0,
            padding: 0,
          }}
        >
          <AvatarStyled
            src={data && data.icon}
            style={avatarStyle}
            size={LARGE_IMAGE_SIZE}
          />
        </Badge>
      </ImageContainer>
      <InfoContainer>
        <li>
          <span data="name">{data && data.name}</span>
          <small>{data && data.short_name}</small>
        </li>
        {/* <li>
          <span data="address"><IconLocation style={{ ...iconStyle }} />ADDRESS</span>
        </li>
        <li>
          <span><IconPhone style={{ ...iconStyle }} />PHONE</span>
        </li>
        <li>
          <span><IconWifi style={{ ...iconStyle }} />WIFI</span>
        </li> */}
      </InfoContainer>
    </Header>
  );
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
  small: state.browser.greaterThan.small,
  extraSmall: state.browser.greaterThan.extraSmall,
});

export default connect(mapStateToProps)(HotspotHeader);
