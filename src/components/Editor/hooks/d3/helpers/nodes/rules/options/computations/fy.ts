import {NodeDataContainer} from '../../../container';
import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {D3Node} from '../../../../../types';
import {getNodeInfo} from '../../../util/spw/relatives';

export function r_fyConstraint(nodeCollection: NodeDataContainer) {
    return (node: SpwNode, d: D3Node) => {
        const info = getNodeInfo(node);

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


        if (!info.strand.firstNode || (info.strand.firstNode === node)) return undefined;

        if (info.strand.distanceFromHead) {
            return nodeCollection.map.get(info.strand.firstNode)?.y;
        }

        return undefined;
    };
}