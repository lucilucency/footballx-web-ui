import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import IconSort from 'material-ui/svg-icons/content/sort';
import { setCommunity, getCommunity } from '../../actions';
import { Container } from '../../utils/index';
import { TransparentTabBar } from '../TabBar';
import RightComponent from './RightBar';
import Hot from './Hot';
import New from './New';
import Top from './Top';
import Controversy from './Controversy';
import { IconHotFeed } from '../Icons';

const verticalAlign = {
  verticalAlign: 'middle',
};

const tabs = loggedInUserID => [{
  name: <div><IconHotFeed style={{ ...verticalAlign }} /> <span style={{ ...verticalAlign }}>HOT</span></div>,
  key: 'hot',
  content: <Hot loggedInUserID={loggedInUserID} />,
  route: '/home/hot',
}, null && {
  name: 'NEW',
  key: 'new',
  content: <New loggedInUserID={loggedInUserID} />,
  route: '/home/new',
}, {
  name: <div><IconSort style={{ ...verticalAlign }} /> <span style={{ ...verticalAlign }}>TOP</span></div>,
  key: 'top',
  content: <Top loggedInUserID={loggedInUserID} />,
  route: '/home/top',
}, null && {
  name: 'CONTROVERSY',
  key: 'controversy',
  content: <Controversy loggedInUserID={loggedInUserID} />,
  route: '/home/controversy',
}].filter(Boolean);

class HomeFeed extends React.Component {
  componentDidMount() {

  }

  render() {
    const { match, data, loggedInUserID } = this.props;
    const info = match.params.info || 'hot';
    const tab = tabs(loggedInUserID).find(_tab => _tab.key === info);

    // if (!matchID || !tab) {
    //   this.props.history.push('/');
    // }

    return (
      <div>
        <Helmet title={this.props.data.name} />
        <Container
          columns="1fr 300px"
          style={{
            maxWidth: 992,
            margin: 'auto',
          }}
        >
          <div>
            <div
              style={{
                // width: 400,
              }}
            >
              <TransparentTabBar
                info={info}
                tabs={tabs(loggedInUserID)}
              />
            </div>
            {tab && tab.content}
          </div>
          <RightComponent data={data} />
        </Container>
      </div>
    );
  }
}

HomeFeed.propTypes = {
  match: PropTypes.object,

  data: PropTypes.object,
  loggedInUserID: PropTypes.number,
};

const mapStateToProps = state => ({
  data: state.app.community.data,
  loggedInUserID: state.app.metadata.data.user && state.app.metadata.data.user.id && Number(state.app.metadata.data.user.id),
});

const mapDispatchToProps = dispatch => ({
  setCommunity: payload => dispatch(setCommunity(payload)),
  getCommunity: id => dispatch(getCommunity(id)),
});


export default connect(mapStateToProps, mapDispatchToProps)(HomeFeed);
