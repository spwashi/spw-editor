import {D3_Link, D3_Node} from './types';
import {SpwNode} from '@spwashi/language/grammars/spw/src/ast/node/spwNode';

type RawD3Node = SpwNode;

class NodeCollection {
    private _nodes: Array<D3_Node> = new Array<D3_Node>();

    get nodes() {
        return this._nodes;
    }

    push(node: RawD3Node) {
        this._nodes.push(node);
    }
}

class LinkCollection {
    private _links: Array<D3_Link> = new Array<D3_Link>();

    get links() {
        return this._links;
    }

    push(link: { source: RawD3Node, target: RawD3Node }) {
        this._links.push(link);
    }
}


export class D3DataCollection {
    private _links = new LinkCollection();

    get links(): LinkCollection {
        return this._links;
    }

    private _nodes = new NodeCollection();

    get nodes(): NodeCollection {
        return this._nodes;
    }
}

