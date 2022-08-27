import React, { useState } from 'react';
import styled from 'styled-components';
import Card from './card';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { ReactComponent as PlusIcon }  from '../assets/images/plus.svg'
import { setTargetCoState } from '../atom/setTargetCoState'
import DotsIcon from '../assets/images/dots.png'
import {atom, selector, useRecoilState, useRecoilValue} from 'recoil';
import { CardListAtom, CardListSelector } from '../atom/setCardListState';
import { setUserModeState } from '../atom/setUserModeState';
import cssVariables from '../css_variables.json';
import { DelColumn, UpdateColumn } from './API'


const variavle = cssVariables.variable;

const Container = styled.div`
    background-color: ${variavle.columnColor};
    border: 1px solid ${variavle.columnColor};
    border-radius: 4px;
    width: 250px;
    min-width: 250px;
    margin-right: 10px;
    position: relative;
    height: fit-content;
`
const Title = styled.div`
    display: ${(props) => (props.isDisabled ? 'none' : 'flex')};
    justify-content: space-between;
    & input {
		color: ${variavle.textColor};
        font-size: ${variavle.textSizeBig};
        font-weight: 600;
        margin: 10px 10px 0 10px;
        line-height: 24px;
        display: inline-block;
        width: 160px;
    }
    & img {
        cursor: pointer;
        width: 24px;
        height: 24px;
        margin: 10px 8px 0 10px;
    }
`

const Title2 = styled.div`
    display: ${(props) => (props.isEnabled ? 'block' : 'none')};
    & h2 {
		color: ${variavle.textColor};
        font-size: ${variavle.textSizeBig};
        font-weight: 600;
        margin: 10px 10px 0 10px;
        line-height: 24px;
        display: inline-block;
        width: 160px;
    }
`

const Menu = styled.div`
    background-color: #FFF;
    width: fit-content;
    border-radius: 4px;
    border: solid 1px ${variavle.columnColor};
    box-shadow: ${variavle.boxShadow};
    color: ${variavle.textColor};
    position: absolute;
    top: 20px;
    left: 236px;
    z-index: 10;
    display: none;

    & ul {
        display: inline-block;
    }
    & ul li {
        padding: 10px;
        font-size: ${variavle.textSize};
        cursor: pointer;
    }    
    & ul li:hover {
        background-color: ${variavle.columnColor};
    }
    & ul li:last-child {
        color: red;
    }
`
const CardList = styled.div`
    padding: 8px;
`
const AddCardButton = styled.div`
    text-align: right;
    height: 30px;
    display: ${(props) => (props.isDisabled ? 'none' : 'block')};
    & svg {
        display: none;
    }

    &:hover svg {
        display: inline;
        width: 30px;
    }
`

export default function Column({key, column, cards, index}) {
    const [target_co, setTargetCo] = useRecoilState(setTargetCoState)
    const tmp_cardlist = useRecoilValue(CardListAtom)
    const [cardlist, setCardList] = useRecoilState(CardListSelector)
    const [usermode, setUserMode] = useRecoilState(setUserModeState);

    const ShowAdd = () => {
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('add').style.display = 'block';
        setTargetCo(column.columnid)
    }
    const ChangeDisplayFlag = (event) => {
        const target_el = event.currentTarget
        const next_el = target_el.parentElement.nextElementSibling
        if (next_el.style.display === "none") {
            next_el.style.display = "block"
        } else {
            next_el.style.display = "none"
        }
    }    
    
    const SendDelColumn = (columnid) => {
        var data = {"columnid": columnid}
        DelColumn(data).then(res => {
            if (res.data === "NG") {
                window.alert("カードが存在するため削除できません。")
            } else if (res.data !== null) {
                setCardList(res.data)
            }
        })
    }

    const SendUpdateColumn = (event, columnid) => {
        var data = {
            "columnid": columnid,
            "title": event.target.value
        }
        UpdateColumn(data).then(res => {
            if (res.data !== null) {
                setCardList(res.data)
            }
        })
    }

      
    return (
        <Draggable 
            draggableId={column.columnid}
            index={index}
            isDragDisabled={usermode}
        >
            {provided => (
                <Container
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    <Title2 {...provided.dragHandleProps} isEnabled={usermode}>
                        <h2>{column.title}</h2>
                    </Title2>
                    <Title {...provided.dragHandleProps} isDisabled={usermode}>
                        <input type="text" defaultValue={column.title} onBlur={(event) => SendUpdateColumn(event, column.columnid)}></input>
                        <img id="dots" src={DotsIcon} onClick={(event) => ChangeDisplayFlag(event)}/>
                    </Title>
                    <Menu className="column_menu">
                        <ul>
                            <li onClick={ShowAdd}>カードの追加</li>
                            <li onClick={() => SendDelColumn(column.columnid)}>列の削除</li>
                        </ul>
                    </Menu>
                    <Droppable droppableId={column.columnid} type="card">
                        {provided => (
                            <CardList
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {cards.map((card, index) => <Card key={card.cardid} card={card} index={index}/>)}
                                {provided.placeholder}
                                <AddCardButton isDisabled={usermode}>
                                    <button onClick={ShowAdd}><PlusIcon fill="#B2B1B9" /></button>
                                </AddCardButton>
                            </CardList>
                        )}
                    </Droppable>
                </Container>
            )}
        </Draggable>
    )
}