import React , { useState } from 'react';
import styled from 'styled-components';
import {atom, selector, useRecoilState, useRecoilValue} from 'recoil';
import { CardListAtom, CardListSelector } from '../atom/setCardListState';
import CancelIcon from '../assets/images/close.png'
import FilterIcon from '../assets/images/filter.png'
import GlassIcon from '../assets/images/glass.png'
import cssVariables from '../css_variables.json'
import { SearchCard } from './API'

const variavle = cssVariables.variable;

const FilterArea = styled.div`
	max-width: 1160px;
	margin: 12px auto;
	padding: 0 60px;
    display: flex;
    justify-content: end;
    @media screen and (max-width: 767px) {
		justify-content: start;
	}
`
const SearchWindow = styled.div`
    position: relative;
    margin-right: 10px;

    & input {
        background-color: rgba(255,255,255,0.4);
        font-size: ${variavle.textSize};
        padding: 6px 4px 6px 30px;
        text-align: left;
        width: 240px;
        height: 30px;
        border-radius: 2px;
        color: ${variavle.textColor_w};
    }

    .glass {
        width: 20px;
        position: absolute;
        top: 6px;
        left: 6px;
    }
    .cancel {
        width: 12px;
    }
    & button {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 6px;
        right: 2px;
    }
    & input::placeholder {
        color: ${variavle.textColor_w};
    }
    & input::-webkit-search-cancel-button {
        display: none;
    }
`

const ProductFilter = styled.div`
    color: ${variavle.textColor_w};
    font-size: ${variavle.textSize};
    height: 30px;
    display: flex;
    background-color: rgba(255,255,255,0.4);
    border-radius: 2px;
    padding: 2px 8px;

    & img {
        width: 20px;
        height: 20px;
        margin: auto 0;
    }

    & select {
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
        padding: 0 8px;
    }
    & select option {
        color: ${variavle.headerSubColor};
    }

`

function FilterEl() {
    const tmp_cardlist = useRecoilValue(CardListAtom)
    const [cardlist, setCardList] = useRecoilState(CardListSelector)
    const [timer, setTimer] = useState(null)

    const SendSearchCard = (keyword, product) => {
        if (product === 'All') {
            product = ''
        } else if (product === null) {
            product = ''
        }
        var data = {
            "keyword": keyword,
            "product": product
        }

        SearchCard(data).then(res => {
            if (res.data !== null) {
                setCardList(res.data)
            }
        })

    }

    const inputChanged = (event) => {
        var keyword = event.target.value
        var product = document.getElementById('product_filter').value
        clearTimeout(timer)
        const newTimer = setTimeout(() => {
            SendSearchCard(keyword, product)
        }, 500)
        setTimer(newTimer)
    }

    const inputClear = () => {
        var product = document.getElementById('product_filter').value
        document.getElementById('search_window').value = ''
        SendSearchCard('', product)
    }

    const selectedChanged = (event) => {
        var keyword =  document.getElementById('search_window').value
        var product = event.target.value
        SendSearchCard(keyword, product)     
    }

    return (
        <FilterArea>
            <SearchWindow>
                <img src={GlassIcon} className="glass" alt="glass icon" />
                <input onChange={(event) => inputChanged(event)} id="search_window" type="search" placeholder="検索" name="search_window"/>
                <button onClick={() => inputClear()}><img src={CancelIcon} className="cancel" alt="cancel icon" /></button>
            </SearchWindow>
            <ProductFilter>
                <img src={FilterIcon} alt="cancel icon"/>
                <select onChange={(event) => selectedChanged(event)} name="" id="product_filter">
                    <option value="All">すべて</option>
                    <option value="Product1">Product1</option>
                    <option value="Product2">Product2</option>
                    <option value="Product3">Product3</option>
                    <option value="Product4">Product4</option>
                </select>
            </ProductFilter>
        </FilterArea> 
 
    );
  }

export default function Filter() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <FilterEl />
        </React.Suspense> 
    );
}
