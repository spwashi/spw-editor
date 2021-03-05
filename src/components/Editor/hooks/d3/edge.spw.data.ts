import {D3_Edge} from './types';
import {NodeData, RawD3Node} from './node.spw.data';

export class EdgeSpwData {
    _pendingLinks: (() => D3_Edge | false)[] = [];

    private _nodeContainer: NodeData;

    constructor(nodeCollection: NodeData) {
        this._nodeContainer = nodeCollection;
    }

    private _edges: Array<D3_Edge> = new Array<D3_Edge>();

    get edges() {
        // Make sure all nodes have been converted
        if (this._nodeContainer.hasQueuedNodes) this._nodeContainer.convertQueuedNodes();
        if (!this._pendingLinks.length) return this._edges;
        if (this._edges.length) return this._edges;
        const edges: D3_Edge[] = [];
        this._pendingLinks
            .forEach((get) => {
                try {
                    const item = get();
                    item && edges.push(item);
                } catch (e) {
                    console.error(e);
                }
            });
        this._pendingLinks = [];
        return this._edges = edges;
    }

    add(link: { source: RawD3Node, target: RawD3Node, type?: string }) {
        const make = () => {
            const source = this._nodeContainer.map.get(link.source);
            const target = this._nodeContainer.map.get(link.target);
            if (!source || !target) {
                const doThrow = false;
                console.log('Could not create link', link, {source, target});
                if (doThrow) {
                    throw new Error('Could not create link');
                }
                return false;
            }

            let strength: number | undefined;
            const sourceSpwNode = source.spw?.node;
            const targetSpwNode = target.spw?.node;

            if (sourceSpwNode?.getProp('owner') === target) {
                // strength = 1;
            }

            if (!strength && targetSpwNode.kind === 'essence' && targetSpwNode.getProp('prev')?.kind === 'transport') {
                strength = 2;
            }

            if (['domain'].includes(sourceSpwNode?.kind)) {
                strength = .2;
            }
            if (['phrase'].includes(sourceSpwNode?.kind)) {
                strength = 1;
            }
            if (['essence', 'strand'].includes(sourceSpwNode?.kind)) {
                strength = .1;
            }

            return {
                type: link.type,

                source,
                target,
                strength: strength ?? .3,
            };
        };

        this._pendingLinks.push(make);
    }
}