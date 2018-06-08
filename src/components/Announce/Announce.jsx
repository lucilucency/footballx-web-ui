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
  //background-color: #008eff;
  color: ${constants.theme().textColorSecondary};

  ${props => props.bg && css`
     background-image: url(${props.bg});
     -webkit-background-size: cover;background-size: cover;
     background-repeat: no-repeat;
  `}
  
  .title {
    text-transform: uppercase;
    -webkit-margin-before: 1em; -webkit-margin-after: 0;
  }
  .subTitle {
    -webkit-margin-before: 0; -webkit-margin-after: 2em;
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
      font-size: ${constants.fontSizeMedium};
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
      font-size: ${constants.fontSizeCommon};
      line-height: ${constants.fontSizeCommon};
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
const Announce = ({
  title, body,
  link,
  bg,
  dismiss,
}) => (
  <StyledDiv bg={bg}>
    <main>
      <h2 className="title">{title}</h2>
      <div className="subTitle">{body && body}</div>
    </main>
    {link && (
      <aside>
        <RaisedButton
          backgroundColor={constants.colorBlue}
          href={link}
          target="_blank"
          label={strings.announce_play_game}
        />
      </aside>
    )}
    {dismiss && (
      <aside>
        <RaisedButton
          backgroundColor={constants.colorBlue}
          onClick={dismiss}
          label={strings.announce_dismiss}
        />
      </aside>
    )}
  </StyledDiv>
);

Announce.propTypes = {
  title: PropTypes.string,
  body: PropTypes.node,
  link: PropTypes.string,
  bg: PropTypes.string,
  dismiss: PropTypes.bool,
};

class AnnounceComponent extends React.Component {
  constructor() {
    super();

    this.state = {
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
          html_url: link,
        } = data;
        const now = parseInt(Date.now() / 1000, 10);

        if (!this.state.dismissed && Number(end_time) > now) {
          const isStarted = Number(start_time) < now;
          return (
            <Announce
              bg={data.bg}
              title={text}
              body={is_count_down && <Counter start={Number(start_time)} end={Number(end_time)} countToStart={!isStarted} />}
              // dismiss={this.dismiss}
              link={link}
              location={window.location}
            />
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
  return ({
    error,
    loading,
    data,
  });
};

const mapDispatchToProps = dispatch => ({
  getBanner: () => dispatch(getBanner()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AnnounceComponent);
