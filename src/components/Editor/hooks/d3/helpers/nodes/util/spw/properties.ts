import {SpwNodeKind} from '@spwashi/spw/ast/node';
import {SpwBlockNode} from '@spwashi/spw/ast/node/nodeTypes/helper/block';
import {SpwPhraseNode} from '@spwashi/spw/ast/node/nodeTypes/phraseNode';
import {SpwStrandNode} from '@spwashi/spw/ast/node/nodeTypes/strandNode';
import {SpwNode} from '@spwashi/spw/ast/node/spwNode';

export default function getGeneration(spwNode: SpwNode): number {
    const parent = spwNode.getProp('parent');
    if (parent && parent !== spwNode) {
        const parentGeneration = getGeneration(parent);
        switch (parent.kind as SpwNodeKind) {
            case 'strand':
                return parentGeneration;
        }
        return parentGeneration + 1;
    } else {
        return 0;
    }
}

export function getOrderInParent(parent: SpwBlockNode | SpwPhraseNode | undefined, node: SpwNode) {
    let orderInParent = 0;
    let firstNodeInBlock;
    const isBlockNode = !!parent?.kind && ['domain', 'essence', 'concept'].includes(parent.kind);
    for (let seqNode of parent?.body || []) {
        if (isBlockNode && !firstNodeInBlock) firstNodeInBlock = seqNode;
        if (seqNode === node) { break; }
        orderInParent++;
    }
    if (isBlockNode && firstNodeInBlock?.kind === 'strand') {
        firstNodeInBlock = (firstNodeInBlock as SpwStrandNode).head;
    }
    return {orderInParent, firstNodeInBlock: firstNodeInBlock};
}

