import React from 'react';
import styled from 'styled-components';
import constants from '../../constants';

const BlankTitle = styled.div`
  @keyframes shine {
    to {
			background-position:
				0 0,
				100% 0, /* move highlight to right */
				calc(40px + 2em) 1em,
				calc(40px + 2em) 40px,
				1em 80px,
				1em 120px,
        1em 160px;
		}
	}

  margin: auto;
  width: 500px;
  height: 200px;
  background-color: ${constants.theme().surfaceColorPrimary};
  
  background-image:
    radial-gradient( circle 20px at calc(20px + 1em) calc(20px + 1em), lightgray 99%, transparent 0 ),
    linear-gradient( 100deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 80% ),
    linear-gradient( lightgray 15px, transparent 0 ),
    linear-gradient( lightgray 14px, transparent 0 ),
    linear-gradient( lightgray 18px, transparent 0 ),
    linear-gradient( lightgray 14px, transparent 0 ),
    linear-gradient( lightgray 14px, transparent 0 );

  background-repeat: repeat-y;

  background-size:
    70px 200px, /* circle */
    50px 200px, /* highlight */
    50px 200px,
    300px 200px,
    250px 200px,
    450px 200px,
    450px 200px;

  background-position:
    0 0, /* circle */
    0 0, /* highlight */
    calc(40px + 2em) 1em,
    calc(40px + 2em) 40px,
    1em 80px,
    1em 120px,
    1em 160px;

  animation: shine 1s infinite;
`;

const ViewPostCompactBlank = () => (
  <BlankTitle />
);

export default ViewPostCompactBlank;
