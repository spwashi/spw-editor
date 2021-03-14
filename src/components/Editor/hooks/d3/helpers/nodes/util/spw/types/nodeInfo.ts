import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {SpwBlockNode} from '@spwashi/spw/ast/node/nodeTypes/helper/block';

export type NodeInfo = {
    generation: number;
    orderInParent: number | undefined;

    self: SpwNode;
    owner: SpwNode;
    parent: SpwNode;
    effectiveParent: SpwNode;

    readonly  parentRelationships: any | undefined;
    readonly ownerRelationships: NodeInfo | undefined;
    readonly effectiveParentRelationships: any | undefined;

    phrase:
        {
            orderInParent: number | undefined;
        },

    strand:
        {
            distanceFromHead: number | undefined;
            firstNode: SpwNode | undefined;
            orderInParent: number | undefined
            readonly siblings: SpwNode[] | [];
        };

    block:
        {
            firstNode: SpwNode | undefined;
            nearest: SpwBlockNode
            orderInParent: number | undefined;
            readonly siblings: SpwNode[]
        }
};