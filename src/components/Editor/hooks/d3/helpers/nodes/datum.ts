import {D3Node} from '../../types';
import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {CallbackObj} from './init';
import {getNodeInfo} from './util/spw/relatives';
import {D3DragEvent} from 'd3';
import {Datum, DatumDragBehavior, DatumForceConfiguration} from '@spwashi/react-d3/data/types/datum';

export class NodeDatum implements D3Node {
    debug = {};

    public _tmp: Partial<D3Node> = {};
    public _internal: Partial<D3Node>;
    public stroke?: string | undefined;
    public x: number             = 0;
    public y: number             = 0;
    public bound?: number | undefined;
    public vx?: number | undefined;
    public vy?: number | undefined;
    public i?: number | undefined;
    public description?: { title?: string | undefined; } | undefined;
    public forces?: DatumForceConfiguration | undefined;
    public spw!: { [k: string]: any; node: SpwNode; effectiveParent?: SpwNode | undefined; orderInParent?: number | undefined; };

    private readonly _callbacks: any;
    private readonly _node: SpwNode;

    /**
     *
     * @param node
     * @param _callbacks
     * @param map
     */
    constructor(node: SpwNode, _callbacks: CallbackObj, map: Map<SpwNode, NodeDatum>) {
        const neighborInfo         = getNodeInfo(node);
        const {generation, parent} = neighborInfo;
        this._node                 = node;
        this._callbacks            = _callbacks;
        this._internal             = {};

        const d3Node = this;

        const dragBehavior: DatumDragBehavior =
                  {
                      release(event: D3DragEvent<any, any, any>) {
                          if (event.sourceEvent.shiftKey) {
                              d3Node.fx = d3Node._tmp.fx
                              d3Node.fy = d3Node._tmp.fy
                          }
                          d3Node._tmp.fx = undefined;
                          d3Node._tmp.fy = undefined;
                      },

                      drag(event: D3DragEvent<any, any, any>, _d: Datum) {
                          const d = _d as D3Node;
                          const x = d._fx ?? event.x;
                          const y = d._fy ?? event.y;

                          d._tmp.fx = x;
                          d._tmp.fy = y;

                          const blockSiblings = neighborInfo.block
                                                            .siblings
                                                            .map((node: SpwNode) => map.get(node));
                          blockSiblings.forEach((d) => {
                              if (!d) { return; }
                              d.x       = x;
                              d._tmp.fx = x;
                          });

                          const strandSiblings = neighborInfo.strand
                                                             .siblings
                                                             .map((node: SpwNode) => map.get(node));

                          strandSiblings.forEach((d) => {
                              if (!d) { return; }
                              d.y       = y;
                              d._tmp.fy = y;
                              console.log(d.spw);
                          });


                          d3Node._tmp.reset =
                              () => {
                                  blockSiblings.forEach(d => {if (d) d._tmp.fx = undefined});
                                  strandSiblings.forEach(d => {if (d) d._tmp.fx = undefined});
                              }
                      },
                  } as DatumDragBehavior;

        let forceConfiguration =
                {
                    get electronegativity() {
                        if (generation === 0) return 0
                        if (['phrase'].includes(parent?.kind)) return 3;
                        if (parent?.kind === 'strand') return .3
                        return 1
                    },
                    boundary() { _callbacks.smallestX(node, d3Node as D3Node); },
                } as DatumForceConfiguration;
        Object.assign(this,
                      {
                          tmp:   {} as { [k: string]: any },
                          bound: 0,

                          x:            0,
                          y:            0,
                          dragBehavior: dragBehavior,
                          spw:          {node, key: node.key, ...neighborInfo},
                          description:  {get title() {return _callbacks.title(node, d3Node)}},
                          forces:       forceConfiguration,
                      } as Partial<Datum>)
    }

    // radius
    get r() {
        return this._internal.r ?? this._callbacks.r(this._node, this)
    }
    set r(r) {
        this._internal.r = r;
    }
    get _r() {
        return this._callbacks.r(this._node, this);
    }

    // color

    get color() {
        return this._internal.color ?? this._callbacks.color(this._node, this)
    }

    // fx

    get fx() {
        return (this._tmp.fx ?? this._internal.fx ?? this._callbacks.fx(this._node, this) as number | undefined)
    }
    set fx(fx: number | undefined) {
        this._internal.fx = fx
    }
    get _fx() {
        return this._callbacks.fx(this._node, this);
    }

    // fy

    get fy() {
        return (this._tmp.fy ?? this._internal.fy ?? this._callbacks.fy(this._node, this) as number | undefined)
    }
    set fy(fy: number | undefined) {
        this._internal.fy = fy
    }
    get _fy() {
        return this._callbacks.fy(this._node, this);
    }

    // Methods

    click = () => { this._callbacks.click(this._node, this) };
    reset(event?: 'dragend') {
        this._tmp.reset?.();
        this._internal.fx = undefined;
        this._internal.fy = undefined;
    }
}