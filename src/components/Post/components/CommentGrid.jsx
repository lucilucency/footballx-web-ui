import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListItem } from 'material-ui/List';
import ui from '../../../theme';
import { fromNow, ActiveLink, styles } from '../../../utils';
import { ContentText } from './Styled';
import CommentActions from './CommentActions';

const markdown = require('markdown-it')({
  html: true,
  linkify: true,
});

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

  renderComment = (item, insideTheNest) => {
    const { xuser = {} } = item;
    const { isCompact } = this.props;
    return (
      <ListItem
        key={item.id}
        disabled
        style={{
          marginTop: insideTheNest ? 0 : 8,
          marginLeft: !isCompact ? 24 : 8,
          paddingBottom: 0,
          paddingTop: 0,
          borderLeft: `2px solid ${ui.borderColor}`,
        }}
        initiallyOpen
        primaryText={
          <div style={styles.commentText.style}>
            <div>
              <ActiveLink to={`/user/${xuser.id}`}>{xuser.username || xuser.nickname}</ActiveLink> - <span>{fromNow(item.created_at)}</span>
            </div>
            <div className="text-small">
              <ContentText dangerouslySetInnerHTML={{ __html: markdown.renderInline(item.content) }} />
            </div>
          </div>
        }
        secondaryText={<CommentActions data={item} type="comment" isLoggedIn={this.props.isLoggedIn} />}
        nestedItems={item.comments && item.comments.map(el => this.renderComment(el, true))}
        nestedListStyle={{
          borderLeft: `2px solid ${ui.borderColor}`,
          marginLeft: !isCompact ? 24 : 8,
        }}
      />
    );
  };

  render() {
    const { comments } = this.props;

    return (
      <List style={{ textAlign: 'left', paddingTop: 0 }}>
        {comments.map(item => this.renderComment(item))}
      </List>
    );
  }
}

const mapStateToProps = state => ({
  comments: state.app.comments.data,
  isCompact: state.browser.lessThan.small,
});

ViewPostComments.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  /**/
  comments: PropTypes.array.isRequired,
  isCompact: PropTypes.bool,
};

export default connect(mapStateToProps)(ViewPostComments);

