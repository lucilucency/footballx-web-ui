import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { getPosts } from '../../actions';
import { toDateTimeString } from '../../utils';

class HotPage extends React.Component {
  componentDidMount() {
    this.props.dispatchPosts('new');
  }

  render() {
    return (
      <div>
        <Helmet title="footballx - hot" />
        {this.props.posts.map(item => {
          const link = <Link to={`/user/${item.xuser_nickname}`}>${item.xuser_nickname}</Link>;
          return (
            <Card key={item.id}>
              <CardHeader
                title={link}
                subtitle={`${toDateTimeString(item.created_at)}`}
                avatar={item.xuser_avatar}
              />
              <CardMedia
                overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
              >
                <iframe width="560" height="315" src="https://www.youtube.com/embed/6WG3LVYmjcw" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen/>
              </CardMedia>
              <CardTitle
                title={item.title}
                subtitle={<Link to={`/r/${item.community_link}`}>${item.community_name}</Link>}
              />
              <CardText>
                {item.content}
              </CardText>
              <CardActions>
                <FlatButton label="Upvote" />
                <FlatButton label="Downvote" />
              </CardActions>
            </Card>
          );
        })}
      </div>
    );
  }
}

HotPage.propTypes = {
  browser: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  posts: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  dispatchPosts: PropTypes.func,
};

const mapStateToProps = state => ({
  browser: state.browser,
  posts: state.app.posts.data,
  loading: state.app.posts.loading,
});

const mapDispatchToProps = dispatch => ({
  dispatchPosts: params => dispatch(getPosts(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HotPage);
