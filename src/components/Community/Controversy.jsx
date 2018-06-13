import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { setCommunity, getCommunity } from '../../actions';
import { PostGrid } from '../Post/components/index';
import { Container } from '../../utils/index';
import RightComponent from './RightBar';

class CommunityControversy extends React.Component {
  componentDidMount() {
    const { location } = this.props;
    if (location.state && location.state.data) {
      this.props.setCommunity(location.state.data);
    } else if (this.props.match.params.id && Number(this.props.match.params.id)) {
      this.props.getCommunity(this.props.match.params.id);
    } else {
      this.props.history.push('/');
    }
  }

  render() {
    const { match, data } = this.props;
    const communityID = Number(match.params.id);

    return (
      <div>
        <Helmet title="New" />
        <Container browser={this.props.browser}>
          <PostGrid
            bound="community"
            sorting="new"
            communityID={communityID}
          />
          <RightComponent
            data={data}
          />
        </Container>
      </div>
    );
  }
}

CommunityControversy.propTypes = {
  browser: PropTypes.object,

  match: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,

  data: PropTypes.object,
  setCommunity: PropTypes.func,
  getCommunity: PropTypes.func,
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

export default connect(mapStateToProps, mapDispatchToProps)(CommunityControversy);
