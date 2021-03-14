import {Datum} from '@spwashi/react-d3/data/types/datum';
import {SpwNode} from '@spwashi/spw/ast/node/spwNode';

export type D3Node = Datum & {
    x: number,
    y: number,
    r: number,
    readonly _r: number,
    spw: {
        node: SpwNode;
        effectiveParent?: SpwNode;
        orderInParent?: number | undefined;
        [k: string]: any
    },
    debug: {
        [k: string]: any
    }
    _internal: Partial<D3Node>;
    [k: string]: any
};
export type D3_Edge = { source: D3Node, target: D3Node };