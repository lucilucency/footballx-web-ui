import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
// import ReactMarkdown from 'react-markdown';
import strings from '../../lang';
import { getBanner } from '../../actions';
import constants from '../constants';
import Counter from './Counter';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  color: ${constants.theme().textColorSecondary};

  ${props => props.bg && css`
     background-image: url(${props.bg});
     -webkit-background-size: cover;background-size: cover;
     background-repeat: no-repeat;
  `}
  
  .title {
    text-transform: uppercase;
    font-size: ${constants.fontSizeLarge};
    -webkit-margin-before: 1em; -webkit-margin-after: 0;
    
    @media only screen and (max-width: 662px) {
      -webkit-margin-before: 0;
      font-size: ${constants.fontSizeNormal};
    }
  }
  .subTitle {
    -webkit-margin-before: 0; -webkit-margin-after: 2em;
    font-size: ${constants.fontSizeSmall};
    
    @media only screen and (max-width: 662px) {
      -webkit-margin-after: 0;
    }
  }

  & main,
  & aside {
    padding: 8px 20px;
  }

  & main {
    flex-grow: 1;
    text-align: left;

    & > div,
    & a,
    & p {
      font-size: ${constants.fontSizeNormal};
      margin: 0;
      opacity: 0.85;
    }

    & a {
      color: ${constants.theme().textColorPrimary};

      &:hover {
        text-decoration: underline;
      }
    }

    & h4 {
      font-weight: ${constants.fontWeightMedium};
      font-size: ${constants.fontSizeLarge};
      line-height: ${constants.fontSizeLarge};
      margin: 0 0 2px;

      & svg {
        height: 16px;
        fill: ${constants.theme().textColorPrimary};
        vertical-align: sub;
      }
    }

    & ul {
      margin: 2px 0 0;
      padding-left: 20px;

      & li {
        list-style-type: circle;

        &::first-letter {
          text-transform: capitalize;
        }
      }
    }
  }

  & aside {
    flex-shrink: 0;
  }
`;

class AnnounceComponent extends React.Component {
  static initialState = {
    openDialog: false,
    dialogConstruct: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      ...AnnounceComponent.initialState,
    };

    this.dismiss = () => {
      this.setState({ dismissed: true });
    };
  }

  UNSAFE_componentWillMount() {
    this.props.getBanner();
  }

  render() {
    const { error, loading, data } = this.props;

    if (!error && !loading && data) {
      if (data) {
        const {
          is_count_down,
          start_time,
          end_time,
          text,
          url,
        } = data;
        const now = parseInt(Date.now() / 1000, 10);

        if (!this.state.dismissed && Number(end_time) > now) {
          const isStarted = Number(start_time) < now;
          const body = is_count_down && <Counter start={Number(start_time)} end={Number(end_time)} countToStart={!isStarted} />;
          return (
            <StyledDiv bg={data.bg}>
              <main>
                <div className="title">{text}</div>
                <div className="subTitle">{body}</div>
              </main>
              {url && (
                <aside>
                  <a style={{ color: constants.theme().textColorSecondary }} href="/game" target="_blank">{strings.announce_play_game}</a>
                </aside>
              )}
              {false && (
                <aside>
                  <RaisedButton
                    backgroundColor={constants.colorBlue}
                    onClick={this.dismiss}
                    label={strings.announce_dismiss}
                  />
                </aside>
              )}
            </StyledDiv>
          );
        }
      }
    }

    return null;
  }
}

AnnounceComponent.propTypes = {
  getBanner: PropTypes.func,
  error: PropTypes.string,
  loading: PropTypes.bool,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

const mapStateToProps = (state) => {
  const { error, loading, data } = state.app.banner;
  const isLoggedIn = Boolean(state.app.metadata.data);
  return ({
    isLoggedIn,
    error,
    loading,
    data,
  });
};

const mapDispatchToProps = dispatch => ({
  getBanner: () => dispatch(getBanner()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AnnounceComponent);
