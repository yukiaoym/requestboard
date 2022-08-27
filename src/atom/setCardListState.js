import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import axios from 'axios';
import cssVariables from '../css_variables.json';

const hostname = cssVariables.Hostname;
const User = cssVariables.User;

export const CardListAtom = atom({
  key: 'CardListAtom',
  default: null,
});
export const CardListSelector = selector({
  key: 'CardListSelector',
  get: async ({get}) => {
      const currValue = get(CardListAtom)
      if (currValue) {
          return currValue
      } else {
          const response = await axios.get(hostname + ':8081/getCards', {
            auth: {
              "username": User.username,
              "password": User.password
            }
          });
          return response.data;
      }
    },
  set: ({set}, newValue) => set(CardListAtom, newValue)
});











