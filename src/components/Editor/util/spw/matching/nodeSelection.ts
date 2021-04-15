import {SpwItemKind} from '@spwashi/spw/constructs';
import {SpwNode} from '@spwashi/spw/constructs/ast/nodes/abstract/node';

export class NodeSelection<K extends SpwItemKind = SpwItemKind> {
    protected _nodes?: SpwNode<K>[];

    get nodes(): SpwNode<K>[] | undefined {
        return this._nodes;
    }

    set nodes(value: SpwNode<K>[] | undefined) {
        this._nodes = value;
    }

    static from<Kind extends SpwItemKind>(nodes: NodeSelection<Kind> | SpwNode<Kind> | SpwNode<Kind>[] | null) {
        const selection = new this();
        if (!nodes) return selection;


        if (nodes instanceof NodeSelection) {
            selection.nodes = nodes.nodes;
            return selection;
        }

        if (Array.isArray(nodes)) {
            if (Array.isArray(nodes[0])) {
                throw new Error('boon')
            }
            selection.nodes = nodes;
            return selection;

        }
        if (nodes.kind) {
            selection.nodes = [nodes]
            return selection;

        }

        throw new Error('boon');
    }


    forEach(callback: { (node: SpwNode<any>): void }) {
        this._nodes?.forEach(callback);
    }
}