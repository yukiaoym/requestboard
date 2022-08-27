import Column from './column';
import { DragDropContext , Droppable } from 'react-beautiful-dnd';
import React from 'react';
import styled from 'styled-components';
import {atom, selector, useRecoilState, useRecoilValue} from 'recoil';
import { CardListAtom, CardListSelector } from '../atom/setCardListState';
import { ReactComponent as PlusIcon }  from '../assets/images/plus.svg'
import { setUserModeState } from '../atom/setUserModeState';
import cssVariables from '../css_variables.json';
import { updateColOrder, updateCardOrder, AddColumn } from './API'

const variavle = cssVariables.variable;

const Container = styled.div`
  display: flex;
  width: fit-content;
  margin: 0 auto;
  padding: 0 60px 40px;
  max-width: 100%;
  overflow-x: auto;
	
	&::-webkit-scrollbar {
    height: 10px;
    border: none;
  }
	&::-webkit-scrollbar-track {
	  box-shadow:0 0 6px ${variavle.subColor} inset ;
	}
	&::-webkit-scrollbar-thumb {
		background-color: ${variavle.subColor};
		border-radius: 6px;
	}
`
const AddColumnButton = styled.div`
  & svg {
    display: ${(props) => DisplayButton(props.isDisabled)};
    width: 30px;
  }
`
const DisplayButton = (isDisabled) => {
  if (isDisabled === true ) {
    return "none"
  } else {
    return "inline"
  }
}

function AllColumns() {
  const tmp_cardlist = useRecoilValue(CardListAtom)
  const [cardlist, setCardList] = useRecoilState(CardListSelector)
  const [usermode, setUserMode] = useRecoilState(setUserModeState);

  window.addEventListener('click', function(event) {
    if (usermode === false) {
        if (event.target.id !== "dots" && event.target.id !== "column_menu") {
          var els = document.getElementsByClassName("column_menu")
          for (var i = 0; i < els.length; i++) {
            els[i].style.display = "none"
          }
        }
      }
  }, false);
  
 
  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if ( type === 'column') {
      var new_order_list = Array.from(cardlist["columnOrder"]);
      new_order_list.splice(source.index, 1)
      new_order_list.splice(destination.index, 0, draggableId)

      var newcardlist = {
          ...cardlist,
          columnOrder: new_order_list
      }
      setCardList(newcardlist)
      updateColOrder(newcardlist)
    } else if ( type === 'card' ) {
      const src_column = cardlist.column[source.droppableId];
      const srcCardIds = Array.from(src_column.cardIds);
  
      const dest_column = cardlist.column[destination.droppableId];
      const destCardIds = Array.from(dest_column.cardIds);

      if (destination.droppableId === source.droppableId) {
        srcCardIds.splice(source.index, 1);
        srcCardIds.splice(destination.index, 0, draggableId);
        var newSrcColumn = {
          ...src_column,
          cardIds: srcCardIds,
        };
    
        var newcardlist = {
          ...cardlist,
          column: {
            ...cardlist.column,
            [destination.droppableId]: newSrcColumn,
          },
        };

      } else {
        srcCardIds.splice(source.index, 1);
        destCardIds.splice(destination.index, 0, draggableId);
        var newSrcColumn = {
          ...src_column,
          cardIds: srcCardIds,
        };
    
        var newDestColumn = {
          ...dest_column,
          cardIds: destCardIds,
        };    
    
        var newcardlist = {
          ...cardlist,
          column: {
            ...cardlist.column,
            [newSrcColumn.columnid]: newSrcColumn,
            [newDestColumn.columnid]: newDestColumn,
          },
        };
      }
      setCardList(newcardlist)
      updateCardOrder(newcardlist)
    }
  }
  
  const GetCards = (cardIds) => {
    var cards = []
    for (var i of cardIds) {
      if ( i in cardlist.card ) {
        cards.push(cardlist.card[i])
      }
    }
    return cards
  }

  const SendAddColumn = () => {
    AddColumn().then(res => {
      if (res.data !== null) {
        setCardList(res.data)
      }
    })
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable 
        droppableId="all-columns"
        direction="horizontal"
        type="column"
      >
        {provided => (
          <Container
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {cardlist.columnOrder.map((columnId, index) => {
                const column = cardlist.column[columnId];
                // const cards = column.cardIds.map(cardId => cardlist.card[cardId]);
                const cards = GetCards(column.cardIds)
                return (                    
                    <Column key={column.columnid} column={column} cards={cards} index={index} />
                )
              })
            }
            {provided.placeholder}
            <AddColumnButton isDisabled={usermode}>
              <button onClick={SendAddColumn}><PlusIcon fill={variavle.subColor} /></button>
            </AddColumnButton>
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default function Board() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <AllColumns />
    </React.Suspense> 
  );
}
