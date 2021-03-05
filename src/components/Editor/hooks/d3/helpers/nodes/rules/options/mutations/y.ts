import {NodeData} from '../../../../../node.spw.data';
import {ID3_Node} from '../../../../../types';
import {getNodeRelatives} from '../../../util/spw/relatives';
import {SpwNode} from '@spwashi/spw/ast/node/spwNode';

export function r_yConstraint(nodeCollection: NodeData) {
    return (node: SpwNode, d: ID3_Node) => {
        const info            = getNodeRelatives(node);
        const blockMultiplier = 3;
        const inStrand        = typeof info.strandDistance !== 'undefined';

        const TT_nodeRules = {PhraseNodes: false}

        if (
            TT_nodeRules.PhraseNodes &&
            ['phrase'].includes(info.effectiveParent?.kind)
        ) {
            const parentD = nodeCollection.map.get(info.effectiveParent);
            if (parentD) {
                let y = ((parentD.fy ?? parentD.y) + parentD.r * 1.5) ?? d.y;
                if (typeof y !== 'undefined' && (d.y < y)) {
                    d.y = y ?? d.y;
                }
            }
            return
        }


        // block: first
        if (info.firstNodeInBlock === node) {
            const constraintD = nodeCollection.map.get(info.effectiveParent);
            if (constraintD) {
                const y = constraintD.y + ((constraintD.r + d.r) * blockMultiplier);
                if (d?.y < y) {
                    d.y = y;
                    return;
                }
            }
        }

        // Block: not the first
        if (info.firstNodeInBlock !== node && info.firstNodeInBlock) {
            const constraintD = nodeCollection.map.get(info.firstNodeInBlock);
            const _order      = ((info.orderInParent ?? 0));
            const y           = constraintD?.y ? (constraintD.y) + ((d.r + constraintD.r) * _order * blockMultiplier) : undefined;
            if (typeof y !== 'undefined' && (d.y < y)) {
                d.y = y ?? d.y;
            }
            return;
        }

        if (inStrand && info.firstNodeInBlock === node) {
            const parentD = nodeCollection.map.get(info.effectiveParent);
            if (parentD) {
                let y: number | undefined;
                const _order = (parentD.spw?.orderInParent ?? 1) || 1;

                y = parentD.y + _order * parentD.r

                if (typeof y !== 'undefined' && (d.y < y)) {
                    d.y = y ?? d.y;
                }
            }
        }

    };
}