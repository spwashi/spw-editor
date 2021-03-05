import {NodeData} from '../../../../../node.spw.data';
import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {ID3_Node} from '../../../../../types';
import {getNodeRelatives} from '../../../util/spw/relatives';
import {RuleFn} from '../../types/ruleFn';

export function r_fxConstraint(nodeCollection: NodeData): RuleFn<number | undefined> {
    return (node: SpwNode, d: ID3_Node) => {
        const {
                  generation,
                  firstNodeInBlock,
                  firstNodeInStrand,
                  orderInParent,
                  effectiveParent,
              } = getNodeRelatives(node);

        const TT_nodeRules =
                  {
                      EssencesMatchOwner:             true,
                      EssencesInStrandsMatchPrev:     false,
                      FirstNodeInStrandMatchesParent: false,
                      NodesMatchFirstInBlock:         false,
                  }

        if (!generation) return 0;

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
            (firstNodeInStrand === node)
        ) {
            const parentD = nodeCollection.map.get(effectiveParent);
            return parentD?.x ? parentD?.x + (parentD.r + d.r)
                              : undefined;
        }

        if (
            TT_nodeRules.NodesMatchFirstInBlock &&
            firstNodeInBlock &&
            firstNodeInBlock !== node &&
            orderInParent
        ) {
            const firstD = nodeCollection.map.get(firstNodeInBlock);
            if (firstD?.x) {
                return firstD.x
            }
        }

        return undefined
    };
}