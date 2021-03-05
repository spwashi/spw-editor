import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {ID3_Node} from './types';
import {CallbackObj, initCallbacks} from './helpers/nodes/init';
import {getNodeRelatives} from './helpers/nodes/util/spw/relatives';

export type RawD3Node = SpwNode;


export class NodeData {
    // Nodes that haven't been turned into D3 nodes
    private _queuedNodes: { node: SpwNode, make: () => ID3_Node }[] = [];

    private _map: Map<SpwNode, ID3_Node> = new Map;

    get map() {
        return this._map;
    }

    private _nodes: Array<() => ID3_Node> = new Array<() => ID3_Node>();

    get nodes() {
        return this._nodes.map(d => d());
    }

    get hasQueuedNodes() {
        return !!this._queuedNodes.length;
    }


    add(node: RawD3Node) {
        if (this._map.has(node)) return;
        const make: () => ID3_Node = this._getD3NodeInitializer(node);
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
            let dd: ID3_Node | undefined = this.map.get(node);
            if (dd) return dd;

            const _callbacks = initCallbacks(this);

            // Create Node
            {
                {
                    let d3Node: ID3_Node = new D3_Node(node, _callbacks);
                    const _d             = {}

                    dd = d3Node;
                }
            }
            this._map.set(node, dd);
            return dd;
        };
    }
}

class D3_Node implements ID3_Node {
    public tmp: Partial<ID3_Node>;
    public stroke?: string | undefined;
    public x: number = 0;
    public y: number = 0;
    public bound?: number | undefined;
    public vx?: number | undefined;
    public vy?: number | undefined;
    public i?: number | undefined;
    public description?: { title?: string | undefined; } | undefined;
    public forces?: { electronegativity?: number | undefined; boundary?: { smallest?: { x?: (() => void) | undefined; y?: (() => void) | undefined; } | undefined; largest?: { x?: (() => void) | undefined; y?: (() => void) | undefined; } | undefined; } | undefined; } | undefined;
    public spw!: { [k: string]: any; node: SpwNode; effectiveParent?: SpwNode | undefined; orderInParent?: number | undefined; };

    private readonly _callbacks: any;
    private readonly _node: SpwNode;

    /**
     *
     * @param node
     * @param _callbacks
     */
    constructor(node: SpwNode, _callbacks: CallbackObj) {
        const neighborInfo         = getNodeRelatives(node);
        const {generation, parent} = neighborInfo;
        this._node                 = node;
        this._callbacks            = _callbacks;
        this.tmp                   = {};
        const d3Node               = this;
        Object.assign(this,
                      {
                          tmp:         {} as { [k: string]: any },
                          bound:       0,
                          x:           0,
                          y:           0,
                          spw:         {node, key: node.key, ...neighborInfo},
                          description: {get title() {return _callbacks.title(node, d3Node)}},
                          forces:      {
                              get electronegativity() {
                                  if (generation === 0) return 0
                                  if (['phrase'].includes(parent?.kind)) return 3;
                                  if (parent?.kind === 'strand') return .3
                                  return 1
                              },
                              boundary:
                                  {
                                      smallest: {
                                          y() { _callbacks.smallestY(node, d3Node); },
                                          x() { _callbacks.smallestX(node, d3Node); },
                                      },
                                  },
                          },
                      })
    }

    // Radius
    get r() {
        return this.tmp.r ?? this._callbacks.r(this._node, this)
    }

    set r(r) {
        this.tmp.r = r;
    }

    get _r() {
        return this._callbacks.r(this._node, this);
    }

    // Color
    get color() {
        return this.tmp.color ?? this._callbacks.color(this._node, this)
    }

    // fx
    get fx() {
        return (this.tmp.fx ?? this._callbacks.fx(this._node, this) as number | undefined)
    }

    set fx(fx: number | undefined) {
        this.tmp.fx = fx
    }

    get _fx() {
        return this._callbacks.fx(this._node, this);
    }

    // fy
    get fy() {
        return (this.tmp.fy ?? this._callbacks.fy(this._node, this) as number | undefined)
    }

    set fy(fy: number | undefined) {
        this.tmp.fy = fy
    }

    get _fy() {
        return this._callbacks.fy(this._node, this);
    }

    // Methods

    click() {
        this._callbacks.click(this._node, this)
    }

    reset() {
        this.tmp.fx = undefined;
        this.tmp.fy = undefined;
    }
}

