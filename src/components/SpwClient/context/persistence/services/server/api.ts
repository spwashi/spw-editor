import {ISpwDocument} from '../../actions/util';


const server      = process.env.SPW_SERVER_URL || 'http://localhost:8000';
const route__find = (label: string) => `${server}/concept/find?label=${encodeURIComponent(label)}`;
const route__save = () => `${server}/concept/save`;

export async function save(concept: ISpwDocument) {
    const response = await fetch(route__save(),
                                 {
                                     method:  'POST',
                                     headers: {'Content-Type': 'application/json'},
                                     body:    JSON.stringify(concept),
                                 });
    return response.json()
}

export async function find(label: string) {
    const response = await fetch(route__find(label))
    return response.json();
}