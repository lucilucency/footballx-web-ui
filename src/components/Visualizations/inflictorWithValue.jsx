import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import uuid from 'uuid';
import items from 'dotaconstants/build/items.json';
import styled from 'styled-components';
import strings from '../../lang';
import constants from '../constants';

const customNameIcon = {
  kaya: 'trident',
};

const getInflictorImage = (inflictor) => {
  if (inflictor.includes('recipe')) {
    return 'recipe';
  }
  return customNameIcon[inflictor] || inflictor;
};

const customImageIcon = ['refresher_shard'];

const StyledDiv = styled.div`
.inflictorWithValue {
  position: relative;
  float: left;
  margin: 1px;
  height: 27px;
  z-index: 1;

  :hover {
    z-index: 9999;
  }

  & .overlay {
    background-color: ${constants.theme().colorPrimary};
    font-size: 10px;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
  }

  & img {
    height: 27px;
  }

  & .tooltip {
    & > div {
      max-width: 300px;

      & .heading {
        font-size: ${constants.fontSizeCommon};
        text-transform: uppercase;
        color: ${constants.colorBlue};

        & .lore {
          font-size: ${constants.fontSizeSmall};
          text-transform: none;
          display: block;
          color: ${constants.colorMutedLight};
          margin-bottom: 5px;
        }

        & .gold {
          color: ${constants.colorGolden};
          position: relative;
          font-size: ${constants.fontSizeSmall};

          & img {
            height: 11px;
            margin: 0 5px;
          }
        }
      }

      & hr {
        border: 0;
        height: 1px;
        background: linear-gradient(to right, ${constants.colorMutedLight}, rgba(0, 0, 0, 0));
        margin: 4px 0 3px;
      }

      & .cost {
        margin-top: 6px;

        & span {
          &:first-child {
            margin-right: 30px;
          }

          & img {
            width: 16px;
            height: 16px;
            vertical-align: sub;
            margin-right: 5px;
          }
        }
      }

      & .cmb {
        & img {
          width: 16px;
          height: 16px;
          vertical-align: sub;
          margin-right: 5px;
        }
      }
    }
  }

  &:matches([data-tip="true"]) {
    & > img {
      transition: ${constants.normalTransition};
    }

    &:hover {
      & > img {
        opacity: 0.7;
      }
    }
  }
}

.noBr {
  & br {
    display: none;
  }
}

.attribVal {
  color: ${constants.colorYelor};
  font-weight: ${constants.fontWeightMedium};
}

.cooldownMana {
  & div {
    display: inline-block;

    &:first-child {
      margin-right: 30px;
    }

    &:last-child {
      margin-top: 5px;
    }
  }
}

.buff {
  width: 29px;
  height: 29px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  box-shadow: 0 0 5px ${constants.theme().colorPrimary};
}

.buffOverlay {
  position: absolute;
  bottom: 0;
  right: 2px;
  color: ${constants.theme().textColorPrimary};
  font-weight: ${constants.fontWeightMedium};
  text-shadow: 1px 1px 2px black, -1px -1px 2px black;
}
`;

const tooltipContainer = thing => (
  <div>
    <div className="heading">
      {thing.dname}
      {thing.cost &&
      <span className="gold">
        <img src={`${process.env.REACT_APP_API_HOST}/apps/dota2/images/tooltips/gold.png`} alt="" />
        {thing.cost}
      </span>}
      {thing.lore &&
      <span className="lore">{thing.lore}</span>}
      {thing.desc &&
      <span className="lore">{thing.desc}</span>}
    </div>
    <hr />
    {(thing.attrib || []).map(attrib => <div key={attrib.key}>{`${attrib.header} ${attrib.value} ${attrib.footer || ''}`}</div>)}
    {(thing.cd || thing.mc || thing.cmb) &&
    <div className="cost">
      {thing.mc > 0 &&
      <span>
        <img src={`${process.env.REACT_APP_API_HOST}/apps/dota2/images/tooltips/mana.png`} alt="" />
        {thing.mc}
      </span>}
      {thing.cd > 0 &&
      <span>
        <img src={`${process.env.REACT_APP_API_HOST}/apps/dota2/images/tooltips/cooldown.png`} alt="" />
        {thing.cd}
      </span>}
    </div>}
  </div>
);

class InflictorWithValue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async UNSAFE_componentWillMount() {
    this.setState({
      abilities: await import('dotaconstants/build/abilities.json'),
      neutralAbilities: await import('dotaconstants/build/neutral_abilities.json'),
    });
  }

  render() {
    const {
      inflictor, value, type, ptooltip,
    } = this.props;
    const { abilities, neutralAbilities } = this.state;
    if (inflictor !== undefined) {
      const ability = abilities && abilities[inflictor];
      const neutralAbility = neutralAbilities && neutralAbilities[inflictor];
      const item = items[inflictor];
      let image;
      let tooltip = strings.tooltip_autoattack_other;
      const ttId = uuid.v4();

      if (ability) {
        if (inflictor.includes('attribute_bonus')) {
          image = '/assets/images/stats.png';
        } else if (inflictor.includes('special_bonus')) {
          image = '/assets/images/dota2/talent_tree.svg';
        } else if (neutralAbility) {
          image = neutralAbility.img;
        } else {
          image = `${process.env.REACT_APP_API_HOST}/apps/dota2/images/abilities/${inflictor}_lg.png`;
        }
        tooltip = tooltipContainer(ability);
      } else if (item) {
        if (customImageIcon.includes(inflictor)) {
          image = `/assets/images/dota2/${inflictor}.png`;
        } else {
          image = `${process.env.REACT_APP_API_HOST}/apps/dota2/images/items/${getInflictorImage(inflictor)}_lg.png`;
        }
        tooltip = tooltipContainer(item);
      } else {
        image = '/assets/images/default_attack.png';
      }
      if (ptooltip) {
        tooltip = ptooltip;
      }

      return (
        <StyledDiv>
          <div className="inflictorWithValue" data-tip={tooltip && true} data-for={ttId}>
            {!type &&
            <object data={image} height="27px" type="image/png">
              <img src="/assets/images/logo-128x128.png" alt="" style={{ filter: 'grayscale(60%)' }} />
            </object>}
            {type === 'buff' &&
            <div
              className="buff"
              style={{
              backgroundImage: `url(${image})`,
            }}
            />
          }
            {!type && <div className="overlay">{value}</div>}
            {type === 'buff' &&
            <div className="buffOverlay">
              {value > 0 && value}
            </div>
          }
            {tooltip &&
            <div className="tooltip">
              <ReactTooltip id={ttId} effect="solid" place="left">
                {tooltip}
              </ReactTooltip>
            </div>}
          </div>
        </StyledDiv>
      );
    }
    return null;
  }
}

InflictorWithValue.propTypes = {
  inflictor: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  ptooltip: PropTypes.shape({}),
};

export default (inflictor, value, type, ptooltip) => <InflictorWithValue inflictor={inflictor} value={value} type={type} ptooltip={ptooltip} />;
