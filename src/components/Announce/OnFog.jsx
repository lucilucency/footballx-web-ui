import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
// import ReactMarkdown from 'react-markdown';
// import strings from '../../lang';
import { getBanner } from '../../actions';
import ui from '../../theme';
import { UpdateProfileStepper } from '../User/components';

const Overlay = styled.div`
  width: 100vw;
  height: 100vh;
  opacity: 0.2;
  z-index: 1000;
  position: fixed;
  text-align: center;
  background-color: #000;
  display: flex;
  justify-content: center;

  > div {
    height: 400px;
    width: 100%;
    max-width: 700px;
    align-self: center;
  }
  
   display: flex;  
`;

const AdBannerDiv = styled.div`
  width: 100vw;
  min-height: 100vh;
  //top: calc(50vh - 200px);
  //left: calc(15vw);
  opacity: 1;
  z-index: 1000;
  position: fixed;
  text-align: center;
  display: flex;
  justify-content: center;
  
  @media only screen and (max-width: 768px) {
    width: 100vw;
    left: 0;
  }

  > div {
    background-color: ${ui.surfaceColorPrimary};
    min-height: 400px;
    max-height: 100vh;
    overflow: auto;
    width: 100%;
    max-width: 700px;
    align-self: center;
  }
  
  display: flex;
`;

function inWhiteList(text) {
  const patt = new RegExp('/popular');
  return patt.test(text);
}

class OnFog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dismissed: Boolean(props.user && props.user.username),
    };

    this.dismiss = () => {
      this.setState({ dismissed: true });
    };
  }

  render() {
    const { user, location } = this.props;

    if (user && !inWhiteList(location.pathname) && (!user.username || (user.username && !this.state.dismissed))) {
      return (
        <div>
          <Overlay />
          <AdBannerDiv>
            <UpdateProfileStepper
              user={user}
              onClose={this.dismiss}
            />
          </AdBannerDiv>
        </div>
      );
    }

    return null;
  }
}

OnFog.propTypes = {
  location: PropTypes.object.isRequired,
  user: PropTypes.object,

  /**/
};

// const mapStateToProps = state => ({
//   user: state.app.metadata.data.user,
// });

const mapDispatchToProps = dispatch => ({
  getBanner: () => dispatch(getBanner()),
});

export default connect(null, mapDispatchToProps)(OnFog);
