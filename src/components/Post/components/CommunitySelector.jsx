import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  Chip,
  Avatar,
} from 'material-ui';
import { bindAll, BigSelector } from '../../../utils';
import { getSuggestedCommunities } from '../../../actions';

const initialState = {};

class CommunitySelector extends React.Component {
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
                src={community.icon}
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

    const countriesNodeList = dsCm.map((community, index) => {
      const menuItemStyle = {
        whiteSpace: 'normal',
        display: 'flex',
        justifyContent: 'space-between',
        lineHeight: 'normal',
      };

      return (
        <div key={index} value={community} label={`${community.name}`} style={menuItemStyle}>
          <div style={{ marginRight: 10 }}>
            <span style={{ fontWeight: 'bold' }}>{community.name}</span>
            <br />
            <span style={{ fontSize: 12 }}>{community.c_followers} followers</span>
          </div>
          <Avatar
            src={community.icon}
            size={30}
          />
        </div>
      );
    });

    return (
      <BigSelector
        // floatingLabel="Choose a community"
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

CommunitySelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
  dsCm: PropTypes.array,

  errorText: PropTypes.string,
  getSuggestedCommunities: PropTypes.func,
};

CommunitySelector.defaultProps = {
  errorText: '',
};

const mapStateToProps = state => ({
  dsCm: state.app.suggestedCommunities.data,
});

const mapDispatchToProps = dispatch => ({
  getSuggestedCommunities: () => dispatch(getSuggestedCommunities()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CommunitySelector));
