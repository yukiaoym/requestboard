import React from 'react';
import Header from './Components/header';
import Filter from './Components/filter';
import Board from './Components/board';
import Popup from './Components/popup';
import Footer from './Components/footer';
import styled from 'styled-components';
import { RecoilRoot } from 'recoil';
import cssVariables from './css_variables.json';
import REQUEST_ICON from './assets/images/REQUEST_LOGO.png'
const variavle = cssVariables.variable;

const Main = styled.main`
  min-height: 100vh;
  background-color: ${variavle.mainColor};
  position: relative;
  padding-bottom: 40px;
  box-sizing: border-box;
`

const Error = styled.main`
  min-height: 100vh;
  background-color: ${variavle.mainColor};
  color: ${variavle.textColor_w};
  font-size: ${variavle.textSizeBig};
  padding: 20px;

  & div {
    text-align: center;
    padding-top: 15%;
    max-width: 1160px;
    margin: 0 auto;
  }
  & div p {
    margin-bottom: 10px;
  }
  & img {
    margin-top: 20px;
    width: 100px;
  }
`


var params = window.location.search;
var url = window.location.href

var zendesk_userid = params.substr(8)
localStorage.setItem('zendesk_userid', zendesk_userid);
window.history.pushState(null, null, url.replace(/\?.*/,''));

export default function App() {
  // var zendesk_userid = localStorage.getItem('zendesk_userid')
  return (
    <RecoilRoot>
      <Main id="main">
        <Header />
        <Filter />
        <Board />
        <Popup />
        <Footer />
      </Main>
    </RecoilRoot>
  );

  // } else {
  //   return (
  //     <Error>
  //       <div>
  //         <p>サポートシステムにログイン後、右下のREQUESTアイコンからアクセスしてください。</p>
  //         <br />
  //         <img src={REQUEST_ICON} alt="request_icon" />
  //       </div>
  //     </Error>
  //   )
  // }

}
