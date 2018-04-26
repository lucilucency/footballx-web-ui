/* eslint-disable no-eval,react/forbid-prop-types */
import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

class RequestLayer extends React.Component {
  static propTypes = {

  };

  componentDidMount() {

  }

  render() {
    return (<div>
      <Helmet title={'title'}/>

      <h1>IT'S SOMETHING HOT</h1>
    </div>);
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
