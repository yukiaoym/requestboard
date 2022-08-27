import React , { useState } from 'react';
import styled from 'styled-components';
import { setCardIdState } from '../atom/setCardIdState'
import { CardListAtom, CardListSelector } from '../atom/setCardListState';
import { useRecoilState, useRecoilValue } from 'recoil';
import cssVariables from '../css_variables.json';
import { UpdateCard } from './API'

const variavle = cssVariables.variable;

const EditArea = styled.div`
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
        border: solid 1px ${variavle.columnColor};
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
    font-size: ${variavle.textSize};
    cursor: pointer;
`

function EditEl() {
    const [cardid, setCardId] = useRecoilState(setCardIdState);
    const tmp_cardlist = useRecoilValue(CardListAtom)
    const [cardlist, setCardList] = useRecoilState(CardListSelector)
    const cardinfo = cardlist.card[cardid]


    const closeDetail = () => {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('edit').style.display = 'none';
        setCardId("card-0")
    }

    const SendUpdateCard = () => {
        var target_form = document.getElementById('editform');
        if (target_form !== null) {
          var formdata = {}
          formdata.product = target_form.product.value;
          formdata.subject = target_form.subject.value;
          formdata.contents = target_form.contents.value;
          formdata.cardid = cardid;

          UpdateCard(formdata).then(res => {
            if (res.data !== null) {
              document.getElementById('overlay').style.display = 'none';
              document.getElementById('edit').style.display = 'none';
              setCardList(res.data)
              setCardId("card-0")
            }
          })
        }
    }

    return (
        
        <EditArea id="edit">
            <button onClick={closeDetail}>×</button>
            <h2>内容を編集</h2>
            <form id="editform">
                <label htmlFor="product">製品名</label>
                { cardinfo.product ?
                <select name="product" defaultValue={cardinfo.product}>
                    <option value="Product1">Product1</option>
                    <option value="Product2">Product2</option>
                    <option value="Product3">Product3</option>
                    <option value="Product4">Product4</option>
                </select> : null
                }
                <label htmlFor="subject">件名</label>
                <input type="text" id="subject" name="subject" defaultValue={cardinfo.subject} />
                <label htmlFor="contents">内容</label>
                <textarea type="text" id="contents" name="contents" defaultValue={cardinfo.contents}/>
            </form>
            <Button onClick={() => SendUpdateCard()}>OK</Button>
        </EditArea> 
    );
}

export default function Edit() {
    return (
      <React.Suspense fallback={<div>Loading...</div>}>
        <EditEl />
      </React.Suspense> 
    );
  }