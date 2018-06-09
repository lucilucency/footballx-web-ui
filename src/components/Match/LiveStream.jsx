import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class MatchView extends React.Component {
  componentDidMount() {

  }

  render() {
    const { data } = this.props;

    return (
      <div style={{ width: '100%', backgroundColor: 'black' }}>
        <iframe
          title={data.id}
          src={data.url_live}
          width="590"
          height="431"
          frameBorder="0"
          scrolling="no"
          allowFullScreen
        />
      </div>
    );
  }
}

MatchView.propTypes = {
  data: PropTypes.object.isRequired,
  /**/
};

const mapStateToProps = state => ({
  // user: state.app.metadata.data.user,
  browser: state.browser,
  comments: state.app.comments.data,
});

export default withRouter(connect(mapStateToProps, null)(MatchView));
