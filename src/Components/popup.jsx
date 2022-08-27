import styled from 'styled-components';
import Detail from './detail';
import Add from './add';
import Edit from './edit';
import Information from './information';
import Update from './update';
import React from 'react';

const Overlay = styled.div`
  height: 100%;
  width: 100%;
  background-color: #333;
  position: absolute;
  top: 0;
  z-index: 20;
  opacity: 0.5;
  display: none;
`
export default function Popup() {
    return (
        <React.Fragment>
            <Overlay id="overlay" />
            <Detail />
            <Add />
            <Edit />
            <Information />
            <Update />
        </React.Fragment>
    );
  }