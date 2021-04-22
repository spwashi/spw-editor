import {Runtime} from '@spwashi/spw';
import {SpwNode} from '@spwashi/spw/constructs/ast/nodes/abstract/node';
import {getAllNodesWithKey} from '../getAllNodesWithKey';
import {NodeSelection} from '../nodeSelection';
import {SpwItemKind} from '@spwashi/spw/constructs';
import {SpwItem} from '@spwashi/spw/constructs/ast/abstract/item';

export async function rule_1(nodes: NodeSelection, runtime: Runtime): Promise<NodeSelection> {
    const arr = nodes.nodes;

    if (!arr?.length) return new NodeSelection;
    const mapped = await Promise.all(arr.flatMap(getNodeMapper(runtime)).filter(i => !!i));

    return NodeSelection.from(mapped.flatMap(i => i).filter(i => i !== null) as SpwNode<SpwItemKind>[])
}

function getNodeMapper(runtime: Runtime) {
    return async function mapNodes(node: SpwItem): Promise<SpwItem | SpwItem[]> {
        const kind = node.kind as SpwItemKind;

        switch (kind) {
            case 'channel':
                if (node.key === '#') return [node];
                return getAllNodesWithKey(runtime, node.key);
            case 'anchor':
                return getAllNodesWithKey(runtime, node.key)
            case 'perspective':
            case 'performance':
            default:
                return [node];
        }
    }

}