import {ISpwConcept} from '../../actions/util';


const server             = process.env.SPW_SERVER_URL || 'http://localhost:8000';
const route__findByLabel = (label: string) => `${server}/concept/find?label=${encodeURIComponent(label)}`;
const route__findByHash  = (hash: string) => `${server}/concept/find?hash=${encodeURIComponent(hash)}`;
const route__save        = () => `${server}/concept/save`;

export async function save(concept: ISpwConcept) {
    const response = await fetch(route__save(),
                                 {
                                     method:  'POST',
                                     headers: {'Content-Type': 'application/json'},
                                     body:    JSON.stringify(concept),
                                 });
    return response.json()
}

type  FindParams = { hash?: string | undefined; label?: string | undefined; }

export async function find({label, hash}: FindParams) {
    const route = label ? route__findByLabel(label) : (hash ? route__findByHash(hash) : null);
    if (!route) throw  new Error('Expected label or hash')
    const response = await fetch(route)
    return response.json();
}