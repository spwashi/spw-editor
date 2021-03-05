import {NodeData} from '../../../../../node.spw.data';
import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {ID3_Node} from '../../../../../types';
import {getNodeRelatives} from '../../../util/spw/relatives';

export function r_fyConstraint(nodeCollection: NodeData) {
    return (node: SpwNode, d: ID3_Node) => {
        const info = getNodeRelatives(node);

        if (!info.generation) return 0;

        const TT_nodeRules =
                  {
                      EssencesMatchOwner: true,
                  }

        if (
            TT_nodeRules.EssencesMatchOwner &&
            node.kind === 'essence'
        ) {
            const constraintNode = node.getProp('owner');
            if (constraintNode) {
                const constraintD = nodeCollection.map.get(constraintNode);
                return constraintD?.y ? constraintD.y + constraintD.r
                                      : undefined;
            }
        }


        if (!info.firstNodeInStrand || (info.firstNodeInStrand === node)) return undefined;

        if (info.strandDistance) {
            return nodeCollection.map.get(info.firstNodeInStrand)?.y;
        }

        return undefined;
    };
}