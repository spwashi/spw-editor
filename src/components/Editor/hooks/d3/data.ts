import {NodeData} from './node.spw.data';
import {EdgeSpwData} from './edge.spw.data';


export class D3DataCollection {
    private readonly _nodes: NodeData;
    private readonly _links: EdgeSpwData;

    constructor() {
        this._nodes = new NodeData();
        this._links = new EdgeSpwData(this._nodes);
    }

    get links(): EdgeSpwData {
        return this._links;
    }

    get nodes(): NodeData {
        return this._nodes;
    }
}

