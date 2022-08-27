import styled from 'styled-components';
import cssVariables from '../css_variables.json';

const variavle = cssVariables.variable;
const FooterArea = styled.footer`
    height: 40px;
    background-color: ${variavle.mainColor};
    width: 100%;
    position: absolute;
    bottom: 0;
    text-align: center;
	  color: ${variavle.textColor_w};
    // border-top: 1px solid ${variavle.columnColor};
    & small {
      position: absolute;
      bottom: 10px;
      font-size: 1.2rem;
      transform: translateX(-50%);
      -webkit-transform: translateX(-50%);
    }
`

export default function Footer() {
    return (
      <FooterArea>
        <small>©2022 Aoyama</small>
      </FooterArea>
    );
  }