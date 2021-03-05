import {Datum} from '@spwashi/react-d3/data/types/datum';
import {SpwNode} from '@spwashi/spw/ast/node/spwNode';

export type ID3_Node = Datum & {
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
    tmp: Partial<ID3_Node>;
    [k: string]: any
};
export type D3_Edge = { source: ID3_Node, target: ID3_Node };