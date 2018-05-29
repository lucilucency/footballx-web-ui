import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { setCommunity, getCommunity } from '../../actions';
import { PostGrid } from '../Post/components/index';
import { Container } from '../../utils/index';
import RightComponent from './CommunityRightBar';

const propsLoadData = (props) => {
  const { location } = props;

  if (location.state && location.state.data) {
    props.setCommunity(location.state.data);
  } else if (props.match.params.id && Number(props.match.params.id)) {
    props.getCommunity(props.match.params.id);
  } else {
    props.history.push('/');
  }
};

class CommunityHot extends React.Component {
  componentDidMount() {
    propsLoadData(this.props);
  }

  componentWillReceiveProps(props) {
    if (props.location.pathname !== this.props.location.pathname) {
      propsLoadData(props);
    }
  }

  render() {
    const { match, data } = this.props;
    const communityID = Number(match.params.id);

    return (
      <div>
        <Helmet title="News feed" />
        <Container browser={this.props.browser}>
          <PostGrid
            bound="community"
            sorting="hot"
            communityID={communityID}
          />
          <RightComponent data={data} />
        </Container>
      </div>
    );
  }
}

CommunityHot.propTypes = {
  browser: PropTypes.object,

  match: PropTypes.object,
  location: PropTypes.object,

  data: PropTypes.object,
};

const mapStateToProps = state => ({
  browser: state.browser,
  loading: state.app.posts.loading,
  user: state.app.metadata.data.user || {},
  data: state.app.community.data,
});

const mapDispatchToProps = dispatch => ({
  setCommunity: payload => dispatch(setCommunity(payload)),
  getCommunity: id => dispatch(getCommunity(id)),
});


export default connect(mapStateToProps, mapDispatchToProps)(CommunityHot);
