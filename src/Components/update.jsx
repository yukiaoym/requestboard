import React , { useState } from 'react';
import styled from 'styled-components';
import cssVariables from '../css_variables.json';

const variavle = cssVariables.variable;

const UpdateArea = styled.div`
  width: 40%;
  height: 70%;
  position: fixed;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background-color: ${variavle.cardColor};
  color: ${variavle.textColor};
  z-index: 30;
  opacity: 1;
  border-radius: 4px;
  box-shadow: ${variavle.boxShadowBig};
  display: none;
  padding: 30px;

  @media screen and (max-width: 767px) {
    width: 80%;
  }
  
  & button {
    font-size: 2.6rem;
    position: absolute;
    top: 2px;
    right: 12px;
  }

  & h2 {
    font-size: ${variavle.textSizeTitle};
    font-weight: 600;
    margin: 10px 0 30px 0;
  }

  & ol li {
    font-size: ${variavle.textSize};
  }

`


export default function Update() {
  const closeDetail = () => {
      document.getElementById('overlay').style.display = 'none';
      document.getElementById('update').style.display = 'none';
  }

  return (
    <UpdateArea id="update">
      <button onClick={closeDetail}>×</button>
      <h2>更新情報</h2>
      <ol>
        <li>2022/XX/XX 「スマートフォン用アプリが欲しい」を「受付中」から「実装予定」に移動しました。</li>
      </ol>
    </UpdateArea> 
  );
}