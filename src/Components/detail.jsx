import React , { useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as GoodIcon }  from '../assets/images/good.svg'
import { useRecoilState, useRecoilValue } from 'recoil';
import { CardListAtom, CardListSelector } from '../atom/setCardListState';
import { setCardIdState } from '../atom/setCardIdState'
import { setUserModeState } from '../atom/setUserModeState';
import cssVariables from '../css_variables.json';
import { UpdateGoodCount, DelCard } from './API'

const variavle = cssVariables.variable;
const ProductColor = cssVariables.ProductColor;

const DetailArea = styled.div`
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
  display: ${(props) => DisplayDetail(props.displayflag)};
  padding: 30px;
`
const DisplayDetail = (cardid) => {
  if (cardid === "card-0") {
    return "none"
  } else {
    return "block"
  }
}
const ContentsArea = styled.div`
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
  & span {
    font-size: ${variavle.textSizeMini};
  }
  & p {
    margin: 10px 0 20px 0;
    font-size: ${variavle.textSize};
  }
  & svg {
    width: 20px;
    height: 20px;
    margin-right: 4px;
    cursor: pointer;
  }
`
const ProductTag = styled.div`
    display: inline-block;
    padding: 4px 8px;
    color: ${variavle.textColor_w};
    border-radius: 2px;
    font-size: ${variavle.textSizeMini};
    background-color: ${(props) => ProductColor[props.product]};
    margin-right: 10px;
`
const ButtonArea = styled.div`
    position: absolute;
    bottom: 30px;  
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    display: ${(props) => DisplayButton(props.isDisabled)};
    justify-content: center;
    width: 100%;
    padding: 0 30px;
    margin: 0 auto;
    
    & button {
      font-size: ${variavle.textSize};
      padding: 6px 50px;
      border-radius: 4px;
      margin: 0 8px;
    }
    #edit_button {
      background-color: ${variavle.pointColor};
    }
    #delete_button {
      background-color: ${ProductColor.Product2};
      color: ${variavle.textColor_w};
    }
`
const DisplayButton = (isDisabled) => {
  if (isDisabled === true ) {
    return "none"
  } else {
    return "flex"
  }
}
function DetailEl() {
    const [cardid, setCardId] = useRecoilState(setCardIdState);
    const tmp_cardlist = useRecoilValue(CardListAtom)
    const [cardlist, setCardList] = useRecoilState(CardListSelector)
    const cardinfo = cardlist.card[cardid]
    const [usermode, setUserMode] = useRecoilState(setUserModeState);

    const CheckGoodColor = (cardid) => {
      const zendesk_userid = localStorage.getItem('zendesk_userid')
      var good_list = cardlist['card'][cardid]['good_list']
      if (good_list.includes(zendesk_userid)) {
          var good_color = variavle.pointColor
      } else {
          good_color = variavle.pointColor_g
      }
      return good_color  
  }

    const CheckGoodCount = (cardid) => {
        var good_count = cardlist['card'][cardid]['good_list'].length
        return good_count
    }
  
    const ChangeGoodCount = () => {
      const zendesk_userid = localStorage.getItem('zendesk_userid')
      const data = {
          'cardid': cardinfo.cardid,
          'userid': zendesk_userid
      }
      UpdateGoodCount(data).then(res => {
          if (res.data !== null) {
          setCardList(res.data)
          }
      })
    }

    const closeDetail = () => {
      document.getElementById('overlay').style.display = 'none';
      document.getElementById('detail').style.display = 'none';
      setCardId("card-0")
    }

    const SendDelCard = (cardid) => {
      DelCard(cardid).then(res => {
        if (res.data !== null) {
          document.getElementById('overlay').style.display = 'none';
          document.getElementById('detail').style.display = 'none';
          setCardList(res.data)
          setCardId("card-0")
        }
      })
    }

    const ShowEdit = () => {
      document.getElementById('overlay').style.display = 'block';
      document.getElementById('detail').style.display = 'none';
      document.getElementById('edit').style.display = 'block';
    }

    return (
        <DetailArea id="detail" displayflag={cardid}>
            <ContentsArea>
              <button onClick={closeDetail}>×</button>
              <ProductTag product={cardinfo.product}>{cardinfo.product}</ProductTag>
              <h2>{cardinfo.subject}</h2>
              <span>最終更新日時：{cardinfo.updated_time}</span>
              <p>{cardinfo.contents}</p>
              <div>
                  <GoodIcon onClick={ChangeGoodCount} fill={CheckGoodColor(cardinfo.cardid)}/>
                  <span>{CheckGoodCount(cardinfo.cardid)}</span>
              </div>
            </ContentsArea>
            <ButtonArea isDisabled={usermode}>
                <button id="edit_button" onClick={ShowEdit}>編集</button>
                <button id="delete_button" onClick={() => SendDelCard(cardinfo.cardid)} >削除</button>
            </ButtonArea>
        </DetailArea>
    );
}

export default function Detail() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <DetailEl />
    </React.Suspense> 
  );
}
