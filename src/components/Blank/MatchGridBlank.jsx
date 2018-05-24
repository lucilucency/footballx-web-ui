import styled from 'styled-components';
import constants from '../constants';

const ViewMatchCompactBlank = styled.div`
  @keyframes shine {
    to {
			background-position:
				0 0,
				100% 0,
				calc(40px + 2em) 1em,
				calc(40px + 2em) 40px,
				1em 80px,
				1em 120px,
        1em 160px,
        0 200px;
    }
  }
	
	margin: auto;
	width: 500px;
	height: 400px;
	background-color: ${constants.theme().surfaceColorPrimary};
  
  background-image:
    radial-gradient( circle 20px at calc(20px + 1em) calc(20px + 1em), lightgray 99%, transparent 0 ),
    linear-gradient( 90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 80% ),
    linear-gradient( lightgray 15px, transparent 0 ),
    linear-gradient( lightgray 14px, transparent 0 ),
    linear-gradient( lightgray 18px, transparent 0 ),
    linear-gradient( lightgray 14px, transparent 0 ),
    linear-gradient( lightgray 14px, transparent 0 ),
    linear-gradient( ${constants.theme().backgroundColor} 1em, transparent 0 );

  background-repeat: repeat-y;
  background-size:
    70px calc(200px + 1em), /* circle */
    50px calc(200px + 1em), /* highlight */
    50px calc(200px + 1em),
    300px calc(200px + 1em),
    250px calc(200px + 1em),
    450px calc(200px + 1em),
    450px calc(200px + 1em),
    500px calc(200px + 1em);

  background-position:
    0 0, /* circle */
    0 0, /* highlight */
    calc(40px + 2em) 1em,
    calc(40px + 2em) 40px,
    1em 80px,
    1em 120px,
    1em 160px,
    0 200px;

  animation: shine 1s infinite ease-in-out;
`;

export default ViewMatchCompactBlank;
