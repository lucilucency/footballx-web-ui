import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListItem, Avatar } from 'material-ui';
import ActionInfo from 'material-ui/svg-icons/action/info';

import { getSuggestedCommunities } from '../../../actions';
// import constants from '../../constants';

class RequestLayer extends React.Component {
  componentDidMount() {
    if (this.props.user) {
      // this.props.getSuggestedCommunities();
    }
  }

  render() {
    return (
      <List>
        {/*{this.props.posts.map(item => (*/}
          {/*<ListItem*/}
            {/*disabled*/}
            {/*leftAvatar={<Avatar src={item.icon} size={32} />}*/}
            {/*rightIcon={<ActionInfo />}*/}
            {/*primaryText={item.name}*/}
            {/*secondaryText={`${item.c_followers} followers`}*/}
          {/*/>*/}
        {/*))}*/}
      </List>
    );
  }
}

RequestLayer.propTypes = {
  user: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  getSuggestedCommunities: PropTypes.func,
};

const mapStateToProps = state => ({
  posts: state.app.suggestedCommunities.data,
  loading: state.app.suggestedCommunities.loading,
  user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  getSuggestedCommunities: () => dispatch(getSuggestedCommunities()),
});

// eslint-disable-next-line import/prefer-default-export
export const SuggestedCommunities = connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
