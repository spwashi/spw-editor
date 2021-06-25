import {ConstructKind} from '@spwashi/spw/constructs/ast/_types/kinds';
import {Node} from '@spwashi/spw/constructs/ast/nodes/_abstract/node';

type SpwItemKind = ConstructKind;

export class NodeSelection<K extends SpwItemKind = SpwItemKind> {
    protected _nodes?: Node<K>[];

    get nodes(): Node<K>[] | undefined {
        return this._nodes;
    }

    set nodes(value: Node<K>[] | undefined) {
        this._nodes = value;
    }

    static from<Kind extends SpwItemKind>(nodes: NodeSelection<Kind> | Node<Kind> | Node<Kind>[] | null) {
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


    forEach(callback: { (node: Node<any>): void }) {
        this._nodes?.forEach(callback);
    }
}