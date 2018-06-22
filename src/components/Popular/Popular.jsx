import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { setCommunity, getCommunity } from '../../actions';
import { Container } from '../../utils/index';
import TabBar from '../TabBar';
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
  name: <div><IconHotFeed style={{ ...verticalAlign }} /> <b style={{ ...verticalAlign }}>HOT</b></div>,
  key: 'hot',
  content: <Hot loggedInUserID={loggedInUserID} />,
  route: '/popular/hot',
}, null && {
  name: 'NEW',
  key: 'new',
  content: <New loggedInUserID={loggedInUserID} />,
  route: '/popular/new',
}, {
  name: 'TOP',
  key: 'top',
  content: <Top loggedInUserID={loggedInUserID} />,
  route: '/popular/top',
}, null && {
  name: 'CONTROVERSY',
  key: 'controversy',
  content: <Controversy loggedInUserID={loggedInUserID} />,
  route: '/popular/controversy',
}].filter(Boolean);

class PopularFeed extends React.Component {
  componentDidMount() {

  }

  render() {
    const { match, data, loggedInUserID } = this.props;
    const info = match.params.info || 'hot';
    const tab = tabs(loggedInUserID).find(_tab => _tab.key === info);

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
            <TabBar
              info={info}
              tabs={tabs(loggedInUserID)}
            />
            {tab && tab.content}
          </div>
          <RightComponent data={data} />
        </Container>
      </div>
    );
  }
}

PopularFeed.propTypes = {
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


export default connect(mapStateToProps, mapDispatchToProps)(PopularFeed);
