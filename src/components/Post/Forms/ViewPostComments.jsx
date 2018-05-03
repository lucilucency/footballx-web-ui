import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import IconButton from 'material-ui/IconButton';
import IconUp from 'material-ui/svg-icons/action/thumb-up';
import IconDown from 'material-ui/svg-icons/action/thumb-down';
import constants from '../../constants';
import { fromNow, ActiveLink, MutedLink } from '../../../utils';

class ViewPostComments extends React.Component {
  state = {
    open: false,
  };

  handleToggle = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  handleNestedListToggle = (item) => {
    this.setState({
      open: item.state.open,
    });
  };

  render() {
    const { comments } = this.props;
    return (
      <List>
        {comments.length ? <Subheader>Comments ({comments.length})</Subheader> : <Subheader>Be the first one bark here</Subheader>}
        {comments.map(item => (
          <ListItem
            secondaryText={
              <p>
                <span><MutedLink to={`/user/${item.xuser.id}`}>{item.xuser.nickname}</MutedLink> - <small>{fromNow(item.created_at)}</small></span><br />
                {item.content}
              </p>
            }
            disabled
            secondaryTextLines={2}
            innerDivStyle={{
              paddingTop: 0,
              paddingBottom: 5,
            }}
          />
        ))}
      </List>
    );
  }
}

ViewPostComments.propTypes = {
  comments: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default connect()(ViewPostComments);

