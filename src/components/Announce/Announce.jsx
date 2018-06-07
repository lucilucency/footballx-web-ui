import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import styled from 'styled-components';
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
  background-color: #008eff;
  color: ${constants.theme().textColorSecondary};
  
  h2 {
    text-transform: uppercase;
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
  onClick,
  link,
}) => (
  <StyledDiv>
    <main>
      <h2>{title}</h2>
      {/* {body && <ReactMarkdown source={body} />} */}
      {body && body}
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
    <aside>
      <RaisedButton
        backgroundColor={constants.colorBlue}
        onClick={onClick}
        label={strings.announce_dismiss}
      />
    </aside>
  </StyledDiv>
);

Announce.propTypes = {
  title: PropTypes.string,
  body: PropTypes.node,
  onClick: PropTypes.func,
  link: PropTypes.string,
};

class AnnounceComponent extends React.Component {
  constructor() {
    super();

    this.state = {
    };

    this.dismiss = (value) => {
      if (localStorage) {
        localStorage.setItem('dismiss', value);
      }
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
          number,
          html_url: link,
        } = data;
        const now = parseInt(Date.now() / 1000, 10);

        if (!this.state.dismissed && Number(end_time) > now) {
          const isStarted = Number(start_time) < now;
          return (
            <Announce
              title={text}
              body={is_count_down && <Counter start={Number(start_time)} end={Number(end_time)} countToStart={!isStarted} />}
              onClick={() => this.dismiss(number)}
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
