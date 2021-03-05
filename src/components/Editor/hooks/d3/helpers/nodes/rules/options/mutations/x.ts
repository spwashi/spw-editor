import {NodeData} from '../../../../../node.spw.data';
import {ID3_Node} from '../../../../../types';
import {getNodeRelatives} from '../../../util/spw/relatives';
import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {SpwNodeKind} from '@spwashi/spw/ast/node';

export function r_xConstraint(nodeCollection: NodeData) {
    return (node: SpwNode, d: ID3_Node) => {
        const {
                  firstNodeInBlock,
                  firstNodeInStrand,
                  strandDistance,
                  effectiveParent,
                  orderInParent,
              }                = getNodeRelatives(node);
        const strandMultiplier = 2;

        const rules =
                  {
                      NotTheFirstNodeInStrand: true,
                      NotTheFirstNodeInBlock:  true,
                      MatchTheParentBlock:     true,
                      PhraseNodes:             true,
                  }

        if (rules.PhraseNodes && effectiveParent?.kind === 'phrase') {
            const parentD  = nodeCollection.map.get(effectiveParent);
            const x        = parentD?.x ? (parentD?.fx ?? parentD?.x) + (parentD.r + d.r) * (orderInParent ?? 1)
                                        : undefined;
            const distance = (x ?? 0) - d.x;
            if (typeof x !== 'undefined' && (d.x < x)) {
                d.x = d.x + distance / 2
                // d.vx = (d.vx ?? 0) + 1;
            }
            return;
        }

        if (rules.NotTheFirstNodeInStrand && firstNodeInStrand && (firstNodeInStrand !== node) && typeof strandDistance !== 'undefined') {
            const constraintD = nodeCollection.map.get(firstNodeInStrand);
            const x           = constraintD?.x ? constraintD?.x + ((strandDistance ?? 1) * (constraintD.r + d.r) * strandMultiplier)
                                               : undefined;
            if (typeof x !== 'undefined' && (d.x < x)) {
                d.x = x ?? d.x;
            }
            return;
        }


        if (rules.NotTheFirstNodeInBlock && firstNodeInBlock !== node && firstNodeInBlock) {
            const constraintD = nodeCollection.map.get(firstNodeInBlock);
            const x           = constraintD?.x ? (constraintD.x) : undefined;
            if (typeof x !== 'undefined' && (d.x < x)) {
                d.x = x ?? d.x;
            }
            return;
        }

        if (rules.MatchTheParentBlock && !(['phrase'] as SpwNodeKind[]).includes(effectiveParent?.kind)) {
            const parentD = nodeCollection.map.get(effectiveParent);
            if (!parentD) return;
            let x = parentD.x + parentD.r + d.r * 2
            if (typeof x !== 'undefined' && (d.x < x)) {
                d.x = x;
            }
        }
    };
}