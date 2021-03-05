import {isSpwNode, SpwNode} from '@spwashi/spw/ast/node/spwNode';

export class NodeSelection {
    protected _nodes?: SpwNode[];

    get nodes(): SpwNode[] | undefined {
        return this._nodes;
    }

    set nodes(value: SpwNode[] | undefined) {
        this._nodes = value;
    }

    static from(nodes: NodeSelection | SpwNode | SpwNode[] | null) {
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
        if (isSpwNode(nodes)) {
            selection.nodes = [nodes]
            return selection;

        }

        throw new Error('boon');
    }


    forEach(callback: { (node: SpwNode): void }) {
        this._nodes?.forEach(callback);
    }
}