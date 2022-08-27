import cssVariables from '../css_variables.json';
import axios from 'axios';

const hostname = cssVariables.Hostname;
const User = cssVariables.User;

// Card
export async function AddCard(data) {
    const response = await axios.post(hostname + ':8081/addCard', data, {
        auth: {
          "username": User.username,
          "password": User.password
        }
    });
    return response
}

export async function DelCard(data) {
    const response = await axios.get(hostname + ':8081/delCard/' + data, {
        auth: {
          "username": User.username,
          "password": User.password
        }
    });
    return response
}

export async function UpdateCard(data) {
    const response = await axios.post(hostname + ':8081/updateCard', data, {
        auth: {
          "username": User.username,
          "password": User.password
        }
    });
    return response
}

export async function UpdateGoodCount(data) {
    const response = await axios.post(hostname + ':8081/updateGoodCount', data, {
        auth: {
          "username": User.username,
          "password": User.password
        }
    });
    return response
}

export async function updateCardOrder(data) {
    const response = await axios.post(hostname + ':8081/updateCardOrder', data, {
        auth: {
          "username": User.username,
          "password": User.password
        }
    });
    return response
}


// Column
export async function AddColumn() {
    const response = await axios.get(hostname + ':8081/addColumn', {
        auth: {
          "username": User.username,
          "password": User.password
        }
    });
    return response
}

export async function DelColumn(data) {
    const response = await axios.post(hostname + ':8081/delColumn', data, {
        auth: {
          "username": User.username,
          "password": User.password
        }
    });
    return response
}

export async function UpdateColumn(data) {
    const response = await axios.post(hostname + ':8081/updateColumn', data, {
        auth: {
          "username": User.username,
          "password": User.password
        }
    });
    return response
}

export async function updateColOrder(data) {
    const response = await axios.post(hostname + ':8081/updateColOrder', data, {
        auth: {
          "username": User.username,
          "password": User.password
        }
    });
    return response
}


export async function SearchCard(data) {
    const response = await axios.post(hostname + ':8081/searchCard', data, {
        auth: {
          "username": User.username,
          "password": User.password
        }
    });
    return response
}
