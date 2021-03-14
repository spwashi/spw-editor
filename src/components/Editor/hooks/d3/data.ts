import {NodeDataContainer} from './helpers/nodes/container';
import {EdgeSpwData} from './edge.spw.data';


export class D3DataCollection {
    private readonly _nodes: NodeDataContainer;
    private readonly _links: EdgeSpwData;

    constructor() {
        this._nodes = new NodeDataContainer();
        this._links = new EdgeSpwData(this._nodes);
    }

    get links(): EdgeSpwData {
        return this._links;
    }

    get nodes(): NodeDataContainer {
        return this._nodes;
    }
}

