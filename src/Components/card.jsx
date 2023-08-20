import React, { useState } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { ReactComponent as GoodIcon }  from '../assets/images/good.svg'
import { CardListAtom, CardListSelector } from '../atom/setCardListState';
import { useRecoilState, useRecoilValue } from 'recoil';
import { setCardIdState } from '../atom/setCardIdState';
import { setUserModeState } from '../atom/setUserModeState';
import cssVariables from '../css_variables.json';
import { UpdateGoodCount } from './API'

const variavle = cssVariables.variable;
const ProductColor = cssVariables.ProductColor;

const Container = styled.div`
    border-radius: 2px;
    padding: 8px;
    margin-bottom: 8px;
    background-color: ${variavle.cardColor};
    box-shadow: ${variavle.boxShadow};
	color: ${variavle.textColor};
	
	& p {
		font-size: ${variavle.textSize};
        line-height: 2.1rem;
		margin: 12px 0;
	}
`;

const ProductTag = styled.div`
    display: inline-block;
    padding: 4px 8px;
    color: ${variavle.textColor_w};
    border-radius: 2px;
    font-size: ${variavle.textSizeMini};
    background-color: ${(props) => ProductColor[props.product]};
`
const MetaTag = styled.div`
    display: flex;
    justify-content: space-between;

    & span {
        font-size: ${variavle.textSizeMini};
        line-height: 20px;
    }
    & svg {
        width: 20px;
        height: 20px;
        margin-right: 4px;
        vertical-align:top;
    }
    & div {
        cursor: pointer;
        z-index: 10;
    }
`

export default function Card({key, card, index}) {
    const tmp_cardlist = useRecoilValue(CardListAtom)
    const [cardlist, setCardList] = useRecoilState(CardListSelector)
    const [usermode, setUserMode] = useRecoilState(setUserModeState);

    const [cardid, setCardId] = useRecoilState(setCardIdState);
    const ShowCard = (event) => {
        const targetTag = event.target.tagName
        if (targetTag !== 'svg' && targetTag !== 'g' && targetTag !== 'path') {
            document.getElementById('overlay').style.display = 'block';
            document.getElementById('detail').style.display = 'block';
            setCardId(card.cardid)
        }
    }

    const ChangeGoodCount = () => {
        const zendesk_userid = localStorage.getItem('zendesk_userid')
        const data = {
            'cardid': card.cardid,
            'userid': zendesk_userid
        }
        UpdateGoodCount(data).then(res => {
            if (res.data !== null) {
            setCardList(res.data)
            }
        })
    }
      
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
    
    return (
        <Draggable 
            draggableId={card.cardid} 
            index={index}
            isDragDisabled={usermode}
        >
            {(provided) => (                    
                <Container
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    onClick={ShowCard}
                >
                    <ProductTag product={card.product}>{card.product}</ProductTag>
                    <p>{card.subject}</p>
                    <MetaTag>
                        <span>実装時期：{card.planned_date}</span>
                        <div>
                            <GoodIcon id="good_icon" onClick={ChangeGoodCount} fill={CheckGoodColor(card.cardid)} />
                            <span>{CheckGoodCount(card.cardid)}</span>
                        </div>
                    </MetaTag>
                </Container>
            )}
        </Draggable>
      );
}
