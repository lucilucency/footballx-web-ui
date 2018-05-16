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
import constants from '../../constants';
import strings from '../../../lang';

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
      selectedCommunities: {
        value: null,
      },
    };
  }

  componentDidMount() {
    this.props.getSuggestedCommunities();
  }

  onRequestDelete = (key, stateName) => () => {
    this.setState({
      [stateName]: {
        value: null,
      },
    });
  };

  handleSelection = (values, stateName) => {
    this.setState({ [stateName]: values }, () => {
      this.props.onSelect(values, stateName);
    });
  };

  handleCustomDisplaySelections = stateName => ({ value, label } = {}) => {
    if (value) {
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Chip style={{ margin: 5 }} onRequestDelete={this.onRequestDelete(0, stateName)}>
            <Avatar
              src={value.icon}
              style={{
                width: 24,
                height: 24,
                margin: '4px -4px 4px 4px',
              }}
            />
            {label}
          </Chip>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Chip style={{ margin: 5, backgroundColor: constants.theme().surfaceColorPrimary }}>
          <Avatar
            src={null}
            style={{
              width: 24,
              height: 24,
              margin: '4px -4px 4px 4px',
            }}
          />
          {strings.label_choose_community}
        </Chip>
      </div>
    );
  };

  render() {
    const { dsCm } = this.props;

    const nodeList = dsCm.map((community, index) => {
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
            size={48}
          />
        </div>
      );
    });

    return (
      <BigSelector
        // floatingLabel="Choose a community"
        name="selectedCommunities"
        // multiple
        keepSearchOnSelect
        showAutocompleteThreshold="always"
        // withResetSelectAllButtons
        checkPosition="left"
        hintTextAutocomplete="Community"
        hintText="Complex example"
        onChange={this.handleSelection}
        value={this.state.selectedCommunities}
        selectionsRenderer={this.handleCustomDisplaySelections('selectedCommunities')}
        errorText={this.props.errorText}
        style={{
          width: 300,
          marginBottom: '1em',
          borderRadius: '3px',
          backgroundColor: constants.theme().surfaceColorPrimary,
        }}
      >
        {nodeList}
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
