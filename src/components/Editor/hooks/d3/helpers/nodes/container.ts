import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {initCallbacks} from './init';
import {NodeDatum} from './datum';

export type RawD3Node = SpwNode;


export class NodeDataContainer {
    // Nodes that haven't been turned into D3 nodes
    private _queuedNodes: { node: SpwNode, make: () => NodeDatum }[] = [];

    private _map: Map<SpwNode, NodeDatum> = new Map;

    get map(): Map<SpwNode, NodeDatum> {
        return this._map;
    }

    private _nodes: Array<() => NodeDatum> = new Array<() => NodeDatum>();

    get nodes() {
        return this._nodes.map(d => d());
    }

    get hasQueuedNodes() {
        return !!this._queuedNodes.length;
    }


    add(node: RawD3Node) {
        if (this._map.has(node)) return;
        const make: () => NodeDatum = this._getD3NodeInitializer(node);
        this._nodes.push(make);
        this._queuedNodes.push({node, make})
    }

    convertQueuedNodes() {
        let make;
        // comma expression
        while (({make} = this._queuedNodes.pop() || {}), make) {
            make();
        }
    }

    private _getD3NodeInitializer(node: SpwNode) {
        return () => {
            let dd: NodeDatum | undefined = this.map.get(node);
            if (dd) return dd;

            const _callbacks = initCallbacks(this);

            // Create Node
            {
                {
                    let d3Node: NodeDatum = new NodeDatum(node, _callbacks, this.map);
                    const _d              = {}

                    dd = d3Node;
                }
            }
            this._map.set(node, dd);
            return dd;
        };
    }
}
