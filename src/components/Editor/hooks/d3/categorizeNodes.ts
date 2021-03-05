import {D3DataCollection} from './data';
import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {SpwStrandNode} from '@spwashi/spw/ast/node/nodeTypes/strandNode';
import {SpwNodeKind} from '@spwashi/spw/ast/node';
import {SpwBlockNode} from '@spwashi/spw/ast/node/nodeTypes/helper/block';
import {SpwAnchorNode} from '@spwashi/spw/ast/node/nodeTypes/anchorNode';
import {SpwPhraseNode} from '@spwashi/spw/ast/node/nodeTypes/phraseNode';
import {SpwStringNode} from '@spwashi/spw/ast/node/nodeTypes/stringNode';
import {SpwChannelNode} from '@spwashi/spw/ast/node/nodeTypes/channelNode';
import {SpwNodeNode} from '@spwashi/spw/ast/node/nodeTypes/nodeNode';

type Register = { item: SpwNode };

export function categorizeNodes(all: (Register)[], data: D3DataCollection) {
    const anchors: { [key: string]: SpwNode[] } = {}
    const strands: SpwStrandNode[]              = [];

    function categorizeNode({item: node}: Register) {
        switch (node.kind as SpwNodeKind) {
            case 'anchor': {
                const arr: SpwNode[] = (anchors[node.key] ?? []);
                const anchor         = node as SpwAnchorNode | SpwPhraseNode | SpwStringNode;
                arr.push(anchor);
                anchors[node.key] = arr;

                const owner = anchor.getProp('owner');
                if (owner) {
                    break;
                }

                const parent = anchor.getProp('parent') as SpwNode;
                if (parent && !['strand', 'node', 'essence', 'domain'].includes(parent.kind)) {
                    data.nodes.add(parent);
                    data.links.add({source: parent, target: anchor, type: 'parent'});
                }

                data.nodes.add(anchor);
            }
                break;
            case 'domain':
            case 'concept':
            case 'essence': {
                const block  = node as SpwBlockNode;
                const parent = block.getProp('parent') as SpwNode;
                data.nodes.add(block);
                let owner = block.getProp('owner');
                if (owner && parent?.kind === 'node') {
                    data.links.add({
                                       type:   'owner:block',
                                       source: owner,
                                       target: block,
                                   });
                    for (let sub of block.body ?? []) {
                        data.links.add({
                                           type:   'block:body',
                                           source: block,
                                           target: sub,
                                       });
                    }
                } else {
                    for (let sub of block.body ?? []) {
                        data.links.add({
                                           type:   'owner:body',
                                           source: owner ? owner : block,
                                           target: sub,
                                       });
                    }
                }
            }
                break;
            case 'string':
            case 'phrase':
            case 'channel': {
                const arr: SpwNode[] = (anchors[node.key] = anchors[node.key] ?? []);
                const anchor         = node as SpwChannelNode;
                arr.push(anchor);
                data.nodes.add(anchor);
            }
                break;
            case 'node': {
                const nodeNode = node as SpwNodeNode;
                const parent   = nodeNode.getProp('parent') as SpwNode;

                if (nodeNode.node) {
                    // data.links.add({source: nodeNode, target: nodeNode.node, type: 'nodeNode:nodeNodeNode'});

                    if (parent && parent.kind !== 'strand') {
                        data.nodes.add(parent);
                        data.links.add({source: parent, target: nodeNode.node, type: 'parent:nodeNode'});
                    }
                }

            }
                break;
            case 'strand': {
                const strand = node as SpwStrandNode;
                strands.push(strand);
                let child        = strand.head;
                let strandParent = strand.getProp('parent');
                if (child && strandParent) {
                    data.nodes.add(child);
                    data.nodes.add(strandParent);
                    data.links.add({source: strandParent, target: child, type: 'strand'});
                }
                while (child) {
                    let next = child?.getProp('next');
                    if (next?.kind === 'transport') {
                        next = next.getProp('next');
                    }
                    if (!next) break;

                    data.nodes.add(child);
                    data.nodes.add(next);
                    data.links.add({source: child, target: next});
                    child = next;
                }
            }
                break;
            default:
                break;
        }

    }

    all.forEach(categorizeNode);
    return {anchors, strands};
}