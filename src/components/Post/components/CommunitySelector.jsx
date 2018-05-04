/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  Chip,
  Avatar,
} from 'material-ui';
// import strings from '../../../lang';
// import constants from '../../constants';
import { bindAll, BigSelector } from '../../../utils';
import { getSuggestedCommunities } from '../../../actions';

const initialState = {};

class CommunitySelector extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    dsCm: PropTypes.array,

    errorText: PropTypes.string,
    getSuggestedCommunities: PropTypes.func,
  };

  static defaultProps = {
    errorText: '',
  };

  constructor(props) {
    super(props);

    bindAll([
      'handleCustomDisplaySelections',
      'onRequestDelete',
      'handleSelection',
    ], this);

    this.state = {
      ...initialState,
      selectedItems: [],
    };
  }

  componentDidMount() {
    this.props.getSuggestedCommunities();
  }

  onRequestDelete = (key, stateName) => () => {
    this.state[stateName].filter((v, i) => i !== key);

    this.setState({ [stateName]: this.state[stateName].filter((v, i) => i !== key) });
  };

  handleSelection = (values, stateName) => this.setState({ [stateName]: values }, this.props.onSelect(values, stateName));

  handleCustomDisplaySelections = stateName => (values) => {
    if (values.length) {
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {values.map(({ label, value: community }, index) => (
            <Chip key={index} style={{ margin: 5 }} onRequestDelete={this.onRequestDelete(index, stateName)}>
              <Avatar
                src={community.community_icon}
                size={30}
              />
              {label}
            </Chip>
          ))}
        </div>
      );
    }

    return (<div style={{ minHeight: 42, lineHeight: '42px' }}>Choose a community</div>);
    // advice: use one of <option>s' default height as min-height
  };

  render() {
    const { dsCm } = this.props;
    const groups = ['communities', 'popular'];

    const countriesNodeList = groups.map((groupName, index) => (
      <optgroup key={index} label={groupName}>
        {dsCm[groupName] && dsCm[groupName]
          .map((community, index) => {
            const menuItemStyle = {
              whiteSpace: 'normal',
              display: 'flex',
              justifyContent: 'space-between',
              lineHeight: 'normal',
            };

            return (
              <div key={index} value={community} label={`${community.community_name}`} style={menuItemStyle}>
                <div style={{ marginRight: 10 }}>
                  <span style={{ fontWeight: 'bold' }}>{community.community_name}</span>
                  <br />
                  <span style={{ fontSize: 12 }}>{community.address}</span>
                </div>
                <Avatar
                  src={community.community_icon}
                  size={30}
                />
              </div>
            );
          })}
      </optgroup>
    ));

    return (
      <BigSelector
        floatingLabel="Choose a community"
        name="selectedItems"
        multiple
        keepSearchOnSelect
        showAutocompleteThreshold="always"
        // withResetSelectAllButtons
        checkPosition="left"
        hintTextAutocomplete="Select community"
        hintText="Complex example"
        onChange={this.handleSelection}
        value={this.state.selectedItems}
        selectionsRenderer={this.handleCustomDisplaySelections('selectedItems')}
        style={{ width: '100%', marginTop: 20 }}
        errorText={this.props.errorText}
      >
        {countriesNodeList}
      </BigSelector>
    );
  }
}


const mapStateToProps = () => ({
  // dsCm: state.app.suggestedCommunities.data,
  dsCm: {
    communities: [{
      community_icon: 'https://s3-ap-southeast-1.amazonaws.com/football-x-data-download/league-icon/UEFA_Champions_League_logo.svg.png',
      community_id: 2,
      community_link: 'ttab',
      community_name: 'ttab',
    }, {
      community_icon: 'https://s3-ap-southeast-1.amazonaws.com/football-x-data-download/league-icon/UEFA_Champions_League_logo.svg.png',
      community_id: 1,
      community_link: 'funnyfootball',
      community_name: 'funnyfootball',
    }, {
      community_icon: 'https://media.gettyimages.com/photos/soccer-girl-picture-id532590749?s=170667a',
      community_id: 10,
      community_link: 'sexygirl',
      community_name: 'sexygirl',
    }],
  },
});

const mapDispatchToProps = dispatch => ({
  getSuggestedCommunities: () => dispatch(getSuggestedCommunities()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CommunitySelector));
