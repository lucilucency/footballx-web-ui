import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import styled, { css } from 'styled-components';
import Paper from 'material-ui/Paper';

import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import NearbyIcon from 'material-ui/svg-icons/communication/location-on';
import RecentsIcon from 'material-ui/svg-icons/action/restore';
import FavoritesIcon from 'material-ui/svg-icons/action/favorite';
import { getPosts } from '../../actions';
// import constants from '../constants';
import ViewPostCompact from '../Post/Forms/ViewPostCompact';

const Container = styled.div`
  display: grid;
  grid-gap: 2em;
  grid-template-columns: 2fr 1fr;
`;

const PostsGrid = styled.div`
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

const RightTray = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-rows: 100px 100px 100px;
  
  > div {
     text-align: center;
  }
`;

class HotPage extends React.Component {
  state = {
    selectedIndex: 0,
  };

  select(index) {
    this.setState({ selectedIndex: index });
  }

  componentDidMount() {
    this.props.dispatchPosts('hot');
    this.columnCount = 1;
  }

  render() {
    return (
      <div>
        <Helmet title="footballx - Posts" />
        <Container>
          <PostsGrid columns={this.columnCount}>
            {this.props.posts.map(item => <ViewPostCompact data={item} />)}
          </PostsGrid>
          <RightTray>
            <div>
              <Paper zDepth={1}>
                <BottomNavigation selectedIndex={this.state.selectedIndex}>
                  <BottomNavigationItem
                    label="Recents"
                    icon={<RecentsIcon />}
                    onClick={() => this.select(0)}
                  />
                  <BottomNavigationItem
                    label="Favorites"
                    icon={<FavoritesIcon />}
                    onClick={() => this.select(1)}
                  />
                  <BottomNavigationItem
                    label="Nearby"
                    icon={<NearbyIcon />}
                    onClick={() => this.select(2)}
                  />
                </BottomNavigation>
              </Paper>
            </div>
            <div>
              Ads
            </div>
            <div>
              Trending communities
            </div>
          </RightTray>
        </Container>
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
