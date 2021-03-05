import {SpwStrandNode} from '@spwashi/spw/ast/node/nodeTypes/strandNode';
import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import getGeneration, {getOrderInParent} from './properties';

const _neighborCache = new Map()

/**
 * Returns an object
 *
 * @param node
 */
export function getNodeRelatives(node: SpwNode) {
    if (_neighborCache.has(node)) {
        return _neighborCache.get(node);
    }
    const owner  = node.getProp('owner');
    const parent = node.getProp('parent');

    let firstNodeInBlock: SpwNode | undefined;
    let firstNodeInStrand: SpwNode | undefined;
    let generation = owner ? (getGeneration(owner)) : (getGeneration(node));
    let strandDistance: number | undefined;
    let orderInParent: number | undefined;
    let nearestBlock;


    switch (parent?.kind) {
        case 'strand':
            let seqNode;
            strandDistance    = 0;
            firstNodeInStrand = (parent as SpwStrandNode).head;
            while (seqNode = (seqNode ?? node).getProp('prev')) {
                strandDistance += 1;
            }
            if (firstNodeInStrand === node) {
                ({
                    orderInParent,
                    firstNodeInBlock: firstNodeInBlock,
                } = getOrderInParent(parent.getProp('parent'), parent));
            }
            break;
        case 'concept':
        case 'domain':
        case 'phrase':
        case 'essence':
            ({orderInParent, firstNodeInBlock: firstNodeInBlock} = getOrderInParent(parent, node));
            break;
    }


    {
        let _parent;
        while (_parent = (_parent ?? node).getProp('parent')) {
            if (['concept', 'domain', 'essence'].includes(_parent.kind)) {
                nearestBlock = _parent;
            }
        }
    }

    const neighbors =
              {
                  parent,
                  nearestBlock,
                  generation,
                  owner,
                  effectiveParent:   ['strand', 'node'].includes(parent?.kind) ? parent?.getProp('parent') : parent,
                  firstNodeInStrand: firstNodeInStrand,
                  firstNodeInBlock:  firstNodeInBlock,
                  strandDistance,
                  orderInParent,
              }
    _neighborCache.set(node, neighbors);
    return neighbors;
}

export function _clearNodeCache() {
    _neighborCache.clear();
}