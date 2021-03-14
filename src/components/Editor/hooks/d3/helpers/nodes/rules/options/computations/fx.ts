import {NodeDataContainer} from '../../../container';
import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {D3Node} from '../../../../../types';
import {getNodeInfo} from '../../../util/spw/relatives';
import {D3NodeAttrCalculator} from '../../types/ruleFn';

export function r_fxConstraint(nodeCollection: NodeDataContainer): D3NodeAttrCalculator<number | undefined> {
    let _topOrderInParent = 0;
    return (node: SpwNode, d: D3Node) => {
        const info = getNodeInfo(node);

        const TT_nodeRules =
                  {
                      EssencesMatchOwner:             true,
                      EssencesInStrandsMatchPrev:     false,
                      FirstNodeInStrandMatchesParent: false,
                      NodesMatchFirstInBlock:         false,
                  }

        if (!info.generation) {
            return;
        }

        if (
            TT_nodeRules.EssencesInStrandsMatchPrev &&
            node.kind === 'essence' &&
            node.getProp('prev')?.kind === 'transport'
        ) {
            const constraintNode = node.getProp('prev').getProp('prev');
            if (constraintNode) {
                const constraintD = nodeCollection.map.get(constraintNode);
                return constraintD?.x ? constraintD.x + constraintD.r
                                      : undefined;
            }
        }

        if (
            TT_nodeRules.EssencesMatchOwner &&
            node.kind === 'essence'
        ) {
            const constraintNode = node.getProp('owner');
            if (constraintNode) {
                const constraintD = nodeCollection.map.get(constraintNode);
                return constraintD?.x ? constraintD.x + 2 * constraintD.r
                                      : undefined;
            }
        }


        if (
            TT_nodeRules.FirstNodeInStrandMatchesParent &&
            (info.strand.firstNode === node)
        ) {
            const parentD = nodeCollection.map.get(info.effectiveParent);
            return parentD?.x ? parentD?.x + (parentD.r + d.r)
                              : undefined;
        }

        if (
            TT_nodeRules.NodesMatchFirstInBlock &&
            info.block.firstNode &&
            info.block.firstNode !== node &&
            info.block.orderInParent
        ) {
            const firstD = nodeCollection.map.get(info.block.firstNode);
            if (firstD?.x) {
                return firstD.x
            }
        }

        return undefined
    };
}