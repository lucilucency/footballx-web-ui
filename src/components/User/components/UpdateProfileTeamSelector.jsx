import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import clubsArr from 'fxconstants/build/clubsArr.json';

import {
  Chip,
  Avatar,
} from 'material-ui';
import { bindAll, BigSelector } from '../../../utils';
import constants from '../../constants';

const initialState = {};
const clubs = clubsArr.sort((a, b) => {
  const aPoint = a.popularity || 0;
  const bPoint = b.popularity || 0;
  if (aPoint < bPoint) return 1;
  if (aPoint > bPoint) return -1;
  return 0;
});

class TeamSelector extends React.Component {
  constructor(props) {
    super(props);

    bindAll([
      'handleCustomDisplaySelections',
      'onRequestDelete',
      'handleSelection',
    ], this);

    this.state = {
      ...initialState,
      selectedTeams: {
        value: null,
      },
    };
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

  handleCustomDisplaySelections = () => (callbackData) => {
    if (callbackData) {
      const { value, label } = callbackData;
      if (value) {
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Chip
              style={{ margin: 5 }}
              // onRequestDelete={this.onRequestDelete(0, stateName)}
            >
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
          Team
        </Chip>
      </div>
    );
  };

  render() {
    const teamList = clubs && clubs.map((club, index) => {
      const menuItemStyle = {
        whiteSpace: 'normal',
        display: 'flex',
        justifyContent: 'space-between',
        lineHeight: 'normal',
      };

      return (
        <div key={index} value={club} label={`${club.name}`} style={menuItemStyle}>
          <div style={{ marginRight: 10 }}>
            <span style={{ fontWeight: 'bold' }}>{club.name}</span>
            <br />
            <span style={{ fontSize: 12 }}>{club.short_name}</span>
          </div>
          <Avatar
            src={club.icon}
            // size={48}
          />
        </div>
      );
    });

    return (
      <BigSelector
        // floatingLabel="Choose a community"
        name="selectedTeams"
        // multiple
        keepSearchOnSelect
        showAutocompleteThreshold="always"
        // withResetSelectAllButtons
        checkPosition="left"
        hintTextAutocomplete="Team"
        hintText="Complex example"
        onChange={this.handleSelection}
        value={this.state.selectedTeams}
        selectionsRenderer={this.handleCustomDisplaySelections('selectedTeams')}
        errorText={this.props.errorText}
        elementHeight={64}
        style={{
          width: 300,
          marginBottom: '1em',
          borderRadius: '3px',
          // backgroundColor: constants.theme().surfaceColorPrimary,
          margin: 'auto',
        }}
      >
        {teamList}
      </BigSelector>
    );
  }
}

TeamSelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
  errorText: PropTypes.string,
};

TeamSelector.defaultProps = {
  errorText: '',
};


export default withRouter(connect()(TeamSelector));
