import styled from 'styled-components';
import ui from '../../theme';

const CrreateEditPostFormBlank = styled.div`
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
	width: 100%;
	height: 2000px;
	background-color: ${ui.surfaceColorPrimary};
  
  background-image:
    radial-gradient( circle 20px at calc(20px + 1em) calc(20px + 1em), lightgray 99%, transparent 0 ),
    linear-gradient( 90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 80% ),
    linear-gradient( lightgray 15px, transparent 0 ),
    linear-gradient( lightgray 14px, transparent 0 ),
    linear-gradient( lightgray 18px, transparent 0 ),
    linear-gradient( lightgray 14px, transparent 0 ),
    linear-gradient( lightgray 14px, transparent 0 ),
    linear-gradient( ${ui.backgroundColorPrimary} 1em, transparent 0 );

  background-repeat: repeat-y;
  background-size:
    70px calc(200px + 1em), /* circle */
    50px calc(200px + 1em), /* highlight */
    50px calc(200px + 1em),
    250px calc(200px + 1em),
    250px calc(200px + 1em),
    calc(100% - 2em) calc(200px + 1em),
    calc(100% - 2em) calc(200px + 1em),
    100% calc(200px + 1em);

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

export default CrreateEditPostFormBlank;
