import React , { useState } from 'react';
import styled from 'styled-components';
import Info01 from '../assets/images/info01.png';
import cssVariables from '../css_variables.json';

const variavle = cssVariables.variable;

const InfoArea = styled.div`
  position: fixed;
  width: 40%;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background-color: ${variavle.cardColor};
  z-index: 30;
  opacity: 1;
  border-radius: 4px;
  box-shadow: ${variavle.boxShadowBig};
  padding: 4px;
  display: none;

  @media screen and (max-width: 767px) {
    width: 80%;
  }

  & button {
    font-size: 2.6rem;
    position: absolute;
    top: 4px;
    right: 14px;
  }
  & img {
    width: 100%;
  }
`

export default function Infomation() {
    const closeDetail = () => {
      document.getElementById('overlay').style.display = 'none';
      document.getElementById('info').style.display = 'none';
    }

    return (
      <InfoArea id="info">
        <button onClick={closeDetail}>×</button>
        <img src={Info01} />
      </InfoArea> 
    );
  }
  