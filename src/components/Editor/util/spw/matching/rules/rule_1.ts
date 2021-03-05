import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {Runtime} from '@spwashi/spw';
import {SpwNodeKind} from '@spwashi/spw/ast/node';
import {getAllNodesWithKey} from '../getAllNodesWithKey';
import {NodeSelection} from '../nodeSelection';

export async function rule_1(nodes: NodeSelection, runtime: Runtime): Promise<NodeSelection> {
    const arr = nodes.nodes;

    if (!arr?.length) return new NodeSelection;
    const mapped = await Promise.all(arr.flatMap(getNodeMapper(runtime)).filter(i => !!i));

    return NodeSelection.from(mapped.flatMap(i => i).filter(i => i !== null) as SpwNode[])
}

function getNodeMapper(runtime: Runtime) {
    return async function mapNodes(node: SpwNode): Promise<SpwNode[] | null> {
        const kind = node.kind as SpwNodeKind;

        switch (kind) {
            case 'transport':
                return (node.getProp('parent'));
            case 'channel':
                if (node.key === '#') return [node];

                return getAllNodesWithKey(runtime, node.key);
            case 'anchor':
                return getAllNodesWithKey(runtime, node.key)
                    .then(
                        nodes => {
                            if (Array.isArray(nodes)) {
                                const mapper = (curr: SpwNode) => {
                                    const owner = curr?.getProp('owner');
                                    if (
                                        owner
                                        && owner.kind === node.getProp('owner')?.kind
                                        && owner.label === curr
                                    ) {
                                        return owner;
                                    }
                                    return false;
                                }
                                return nodes.map(mapper).filter(i => !!i);
                            }
                            return nodes;
                        },
                    );
            case 'perspective':
            case 'performance':
            default:
                return [node];
        }
    }

}