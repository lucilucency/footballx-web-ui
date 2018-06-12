import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { List, ListItem, Subheader } from 'material-ui';
import Avatar from 'material-ui/Avatar';
import ui from '../../theme';
import { SmallPaper } from '../../utils';
import strings from '../../lang';

const styles = {
  subheader: {
    style: { fontSize: ui.fontSizeTiny, fontWeight: ui.fontWeightHeavy },
  },
  listItem: {
    primaryTextStyle: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textTransform: 'none !important',
      whiteSpace: 'nowrap',
      fontWeight: ui.fontWeightMedium,
    },
    innerDivStyle: {
      marginLeft: 3,
      paddingLeft: '44px',
      fontSize: ui.fontSizeSmall,
    },
  },
};

class Squad extends React.Component {
  componentDidMount() {

  }

  render() {
    const { data } = this.props;
    const lsPos = {};

    if (data && data.length) {
      data.forEach((el) => {
        if (lsPos[el.pos]) {
          lsPos[el.pos].push(el);
        } else {
          lsPos[el.pos] = [el];
        }
      });

      return (
        <SmallPaper style={{ textAlign: 'left' }}>
          {Object.keys(lsPos).map(pos => (
            <List style={{ padding: 0 }}>
              <Subheader style={styles.subheader.style}>{strings[`enum_player_pos_${pos.toLowerCase()}`]}</Subheader>

              {lsPos[pos].map(player => (
                <ListItem
                  key={player.name}
                  primaryText={<div style={styles.listItem.primaryTextStyle}>{player.name}</div>}
                  leftIcon={<Avatar size={24} src={player.icon} />}
                  innerDivStyle={styles.listItem.innerDivStyle}
                  rightIcon={<Avatar size={24} src={player.club_logo} />}
                />
              ))}
            </List>
          ))}
        </SmallPaper>
      );
    }

    return <h3>No data</h3>;
  }
}

Squad.propTypes = {
  data: PropTypes.array,
  /**/
  // user: PropTypes.object,
};

const mapStateToProps = state => ({
  // user: state.app.metadata.data.user,
  browser: state.browser,
  comments: state.app.comments.data,
});

export default withRouter(connect(mapStateToProps)(Squad));
