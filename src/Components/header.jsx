import styled from 'styled-components';
import {atom, selector, useRecoilState, useRecoilValue} from 'recoil';
import { setUserModeState } from '../atom/setUserModeState';
import { ReactComponent as PostIcon } from '../assets/images/write.svg'
import { ReactComponent as InfoIcon } from '../assets/images/info.svg'
import { ReactComponent as BellIcon } from '../assets/images/bell.svg'
import cssVariables from '../css_variables.json';
import CyberLOGO from '../assets/images/CyberSolutions_LOGO_1.png';
import LOGO from '../assets/images/logo.png';

const variavle = cssVariables.variable;

const HeaderArea = styled.header`
    height: 60px;
    background-color: ${variavle.subColor};
	// border-bottom: 1px solid ${variavle.columnColor};
    width: 100%;
	box-sizing: border-box;
`
const Container = styled.div`
	display: flex;
	justify-content: space-between;
	max-width: 1160px;
	margin: 0 auto;
	padding: 0 60px;
`
const Title = styled.h1`
	font-family: 'Outfit', sans-serif;
	font-size: 2.4rem;
    font-weight: 400;
    color: ${variavle.headerSubColor};
    line-height: 60px;
	#cyberlogo {
		height: 36px;
		margin: 12px 0;
	}
	#logo {
		height: 52px;
		margin-top: 8px;
	}
	@media screen and (max-width: 767px) {
		#logo {
			display: none;
		}
	}
`
const Switch = styled.ul`
	display: ${(props) => DisplaySwitch(props.userid)};
	font-size: ${variavle.textSize};
	line-height: 20px;
	color: ${variavle.headerSubColor};
	& li {
		cursor: pointer;
		padding: 6px;
		margin: auto 10px;
	}
	& li:first-child {
		border-bottom: ${(props) => (props.usermode ? 'none' : 'solid 1px #172b4d')};
	}
	& li:last-child {
		border-bottom: ${(props) => (props.usermode ? 'solid 1px #172b4d' : 'none')};
	}
	@media screen and (max-width: 767px) {
		display: none;
	}
`
const Menu = styled.ul`
	display: flex;
	color: ${variavle.headerSubColor};
	font-size: ${variavle.textSize};
	line-height: 20px;
	& li {
		cursor: pointer;
		padding: 6px;
		margin: auto 8px;
	}
	& svg {
		height: 20px;
		margin-right: 8px;
	}
	@media screen and (max-width: 767px) {
		& li span {
			display: none;
		}
		& li svg {
			margin: 0;
		}
		& li {
			padding: 0;
		}
	}
`

const ShowInfo = () => {
	document.getElementById('overlay').style.display = 'block';
	document.getElementById('info').style.display = 'block';
}

const ShowUpdate = () => {
	document.getElementById('overlay').style.display = 'block';
	document.getElementById('update').style.display = 'block';
}
const ShowForm = () => {
	window.open('https://forms.gle/qThJeVduy2Sba4W96')
}
const DisplaySwitch = (userid) => {
	if (userid === "admin") {
		return "flex";
	} else {
		return "none";
	}
}

const Nav = styled.div`
	display: flex;
`

export default function Header() {
    const [usermode, setUserMode] = useRecoilState(setUserModeState);
	const zendesk_userid = localStorage.getItem('zendesk_userid')

    return (
        <HeaderArea>
			<Container>
				<Title>
					{/* <img src={CyberLOGO} alt="cyberlogo" id="cyberlogo" />
					<img src={LOGO} alt="logo" id="logo"/> */}
					Request Board
				</Title>
				<Nav>
					<Menu >
						{/* <li onClick={ShowForm}>
							<PostIcon fill={variavle.headerSubColor} />
							<span>新規要望の投稿</span>
						</li> */}
						<li onClick={ShowInfo}>
							<InfoIcon fill={variavle.headerSubColor} />
							<span>お知らせ</span>
						</li>
						<li onClick={ShowUpdate}>
							<BellIcon fill={variavle.headerSubColor} />
							<span>更新情報</span>
						</li>
					</Menu>
					{/* <Switch userid={zendesk_userid} usermode={usermode}>
						<li onClick={() => setUserMode(false)}>管理者モード</li>
						<li onClick={() => setUserMode(true)}>ユーザモード</li>
					</Switch> */}
				</Nav>
			</Container>
        </HeaderArea> 

    );
  }