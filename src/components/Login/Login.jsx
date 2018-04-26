import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import strings from '../../lang';
import LoginForm from './LoginForm';

const Wrapper = styled.div`
  width: 600px;
  height: 380px;
  margin: 0 auto;
  text-align: center;
  padding-top: 120px;

  @media only screen and (max-width: 768px) {
    width: auto;
  }
`;

const AppName = styled.div`
  text-transform: uppercase;
  font-size: 90px;
  line-height: 1.2;

  @media only screen and (max-width: 425px) {
    font-size: 60px;
  }
    
  @media only screen and (max-width: 375px) {
    font-size: 42px;
  }
`;

const AppDesc = styled.div`
  font-size: 32px;
  margin-bottom: 20px;
  @media only screen and (max-width: 768px) {
    font-size: 25px;
  }
`;

const Login = (props) => {
  if (props.user) {
    props.history.push('/');
  }

  return (
    <div>
      <Wrapper>
        <AppName>{strings.app_name}</AppName>
        <AppDesc>{strings.app_description}</AppDesc>
        <LoginForm />
      </Wrapper>
    </div>
  );
};

Login.propTypes = {
  user: PropTypes.object, // eslint-disable-line react/forbid-prop-types,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
});

export default connect(mapStateToProps)(Login);
