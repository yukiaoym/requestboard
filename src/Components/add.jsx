import React , { useState } from 'react';
import styled from 'styled-components';
import { setTargetCoState } from '../atom/setTargetCoState'
import { CardListAtom, CardListSelector } from '../atom/setCardListState';
import { useRecoilState, useRecoilValue } from 'recoil';
import cssVariables from '../css_variables.json';
import { AddCard } from './API'

const variavle = cssVariables.variable;
const AddArea = styled.div`
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

  & form {
    width: 100%;
    height: calc(100% - 64px);
    & label {
        font-size: ${variavle.textSizeMini};
    }
    & input, select, textarea {
        margin: 4px 0 20px 0;
        border: solid 1px ${variavle.pointColor_g};
        border-radius: 4px;
        width: 100%;
        font-size: ${variavle.textSize};
        padding: 8px;
    }
    & textarea {
        height: calc(100% - 220px);
    }
  }
`
const Button = styled.div`
    padding: 6px 50px;
    background-color: ${variavle.pointColor};
    border-radius: 4px;
    position: absolute;
    bottom: 30px;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    font-size: 1.4rem;
    cursor: pointer;
`

function AddEl() {
    const [target_co, setTargetCo] = useRecoilState(setTargetCoState)
    const tmp_cardlist = useRecoilValue(CardListAtom)
    const [cardlist, setCardList] = useRecoilState(CardListSelector)

    const closeDetail = () => {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('add').style.display = 'none';
    }

    const SendAddData = (target_co) => {
        var target_form = document.getElementById('addform');
        if (target_form !== null) {
            var formdata = {}
            formdata.product = target_form.product.value;
            formdata.subject = target_form.subject.value;
            formdata.contents = target_form.contents.value;
            formdata.columnid = target_co;
            //const response = await axios.post('http://172.20.43.181:8081/addCard', formdata);
            //const response = await axios.post(hostname + ':8081/addCard', formdata);
            AddCard(formdata).then(res => {
              if (res.data !== null) {
                document.getElementById('overlay').style.display = 'none';
                document.getElementById('add').style.display = 'none';
                setCardList(res.data)
              }
            })
        }
      }

    return (
        <AddArea id="add">
            <button onClick={closeDetail}>×</button>
            <h2>新規要望を追加</h2>
            <form id="addform">
                <label htmlFor="product">製品名</label>
                <select name="product">
                    <option value="Product1">Product1</option>
                    <option value="Product2">Product2</option>
                    <option value="Product3">Product3</option>
                    <option value="Product4">Product4</option>
                </select>
                <label htmlFor="subject">件名</label>
                <input type="text" id="subject" name="subject" />
                <label htmlFor="contents">内容</label>
                <textarea type="text" id="contents" name="contents" />
            </form>
            <Button onClick={() => SendAddData(target_co)}>OK</Button>
        </AddArea>
    );
}

export default function Add() {
    return (
      <React.Suspense fallback={<div>Loading...</div>}>
        <AddEl />
      </React.Suspense> 
    );
  }
