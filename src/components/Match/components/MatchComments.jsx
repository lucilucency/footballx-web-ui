import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListItem } from 'material-ui/List';
import { fromNow, ActiveLink } from '../../../utils';

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
      <List
        style={{
          textAlign: 'left',
        }}
      >
        {comments.map((item) => {
          const { xuser = {} } = item;
          return (
            <ListItem
              key={item.id}
              secondaryText={
                <div>
                  <small>
                    <ActiveLink to={`/user/${xuser.id}`}>{xuser.username || xuser.nickname}</ActiveLink> - <span>{fromNow(item.created_at)}</span>
                  </small>
                  <br />
                  <div>
                    {item.content}
                  </div>
                </div>
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

