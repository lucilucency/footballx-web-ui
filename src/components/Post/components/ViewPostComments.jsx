import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import { fromNow, MutedLink } from '../../../utils';

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
        <Subheader>
          {comments.length ?
            <span>Comments ({comments.length})</span> :
            <span>Be the first one bark here</span>
          }
        </Subheader>
        {comments.map((item) => {
          const { xuser = {} } = item;
          return (
            <ListItem
              key={item.id}
              secondaryText={
                <p>
                  <span><MutedLink to={`/user/${xuser.id}`}>{xuser.nickname}</MutedLink> - <small>{fromNow(item.created_at)}</small></span><br />
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
          );
        })}
      </List>
    );
  }
}

ViewPostComments.propTypes = {
  comments: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default connect()(ViewPostComments);

