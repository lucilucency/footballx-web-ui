import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import styled, { css } from 'styled-components';
import IconButton from 'material-ui/IconButton';
import ActionUp from 'material-ui/svg-icons/action/thumb-up';
import ActionDown from 'material-ui/svg-icons/action/thumb-down';
import ActionShare from 'material-ui/svg-icons/action/thumb-down';
import { getPosts } from '../../actions';
import { toDateTimeString } from '../../utils';
import constants from '../constants';

const PostsGrid = styled.div`
  width: 60%;
  //display: grid;
  //grid-gap: 1em;
  //grid-template-columns: repeat(3, 1fr);
  
  ${props => props.columns && css`
    -moz-column-count: ${props.columns}; 
    -webkit-column-count: ${props.columns}; 
    column-count: ${props.columns};
    -moz-column-gap: 1em;
    -webkit-column-gap: 1em; 
    column-gap: 1em;
  `}
  
  > div {
     display: inline-block;
     margin-bottom: 1em;
     width: 100%; 
  }
`;

class HotPage extends React.Component {
  componentDidMount() {
    this.props.dispatchPosts('new');
    this.columnCount = 1;
  }

  render() {
    return (
      <div>
        <Helmet title="footballx - hot" />

        <PostsGrid columns={this.columnCount}>
          {this.props.posts.map(item => {
            const link = <Link to={`/user/${item.xuser_nickname}`}>${item.xuser_nickname}</Link>;
            return (
              <Card
                key={item.id}
              >
                <CardHeader
                  title={link}
                  subtitle={`${toDateTimeString(item.created_at)}`}
                  avatar={item.xuser_avatar}
                  style={{ padding: '1em 1em 0.5em 1em' }}
                />
                {item.content_type === 2 && <CardMedia
                  overlay={<CardTitle
                    title={item.title}
                    subtitle={<Link to={`/r/${item.community_link}`}>${item.community_name}</Link>}
                    titleColor={constants.theme().textColorPrimary}
                    titleStyle={{ fontWeight: constants.fontWeightMedium, fontSize: constants.fontSizeBig }}
                  />}
                >
                  <img src={item.content} alt="" />
                </CardMedia>}
                {item.content_type === 1 && <CardTitle
                  title={item.title}
                  subtitle={<Link to={`/r/${item.community_link}`}>${item.community_name}</Link>}
                  titleColor={constants.theme().textColorPrimary}
                  titleStyle={{ fontWeight: constants.fontWeightHeavy, fontSize: constants.fontSizeBig }}
                  style={{ paddingTop: 0, paddingBottom: 0 }}
                />}
                {item.content_type === 1 && <CardText color={constants.theme().textColorSecondary} style={{ fontSize: constants.fontSizeSmall }}>
                  {item.content}
                </CardText>}
                <CardActions
                  style={{ padding: '0 8px', display: 'flex', flexDirection: 'row' }}
                >
                  <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'row' }}>
                    <IconButton
                      tooltip="Upvote"
                      tooltipPosition="bottom-right"
                    >
                      <ActionUp color={constants.grey300} hoverColor={constants.blueA100} />
                    </IconButton>
                    <small style={{ verticalAlign: 'middle', lineHeight: '48px' }}>{item.c_ups}</small>
                  </div>
                  <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'row' }}>
                    <IconButton
                      tooltip="Downvote"
                      tooltipPosition="bottom-right"
                    >
                      <ActionDown color={constants.grey300} hoverColor={constants.blueA100} />
                    </IconButton>
                    <small style={{ verticalAlign: 'middle', lineHeight: '48px' }}>{item.c_downs}</small>
                  </div>
                  <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'row' }}>
                    <IconButton
                      tooltip="Downvote"
                      tooltipPosition="bottom-right"
                    >
                      <ActionDown color={constants.grey300} hoverColor={constants.blueA100} />
                    </IconButton>
                    <small style={{ verticalAlign: 'middle', lineHeight: '48px' }}>{item.c_downs}</small>
                  </div>
                </CardActions>
              </Card>
            );
          })}
        </PostsGrid>
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
