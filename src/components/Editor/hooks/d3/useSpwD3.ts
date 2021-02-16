import {useEffect, useState} from 'react';
import {Runtime} from '@spwashi/language';
import {SpwAnchorNode} from '@spwashi/language/grammars/spw/src/ast/node/nodeTypes/anchorNode';
import {SpwNode} from '@spwashi/language/grammars/spw/src/ast/node/spwNode';
import {SpwNodeKind} from '@spwashi/language/grammars/spw/src/ast/node';
import {SpwStrandNode} from '@spwashi/language/grammars/spw/src/ast/node/nodeTypes/strandNode';
import {SpwChannelNode} from '@spwashi/language/grammars/spw/src/ast/node/nodeTypes/channelNode';
import {D3_Link, D3_Node} from './types';
import {useD3DataEffect} from './useD3DataEffect';
import {D3DataCollection} from './data';

function getAllNodes(runtime: Runtime | undefined) {
    const registers = runtime?.registers;
    const all       = Array.from(registers?.get(Runtime.symbols.all)?.items || []);
    return all;
}

function categorizeNodes(
    // @ts-ignore
    all: RegisterValue[],
    current: D3DataCollection,
) {
    const anchors: { [key: string]: SpwNode[] } = {}
    const strands: SpwStrandNode[]              = [];
    all
        .forEach(({item}) => {
            switch (item.kind as SpwNodeKind) {
                case 'anchor': {
                    const arr: SpwNode[] = (anchors[item.key] = anchors[item.key] ?? []);
                    const anchor         = item as SpwAnchorNode;
                    arr.push(anchor);
                    current.nodes.push(anchor);
                }
                    break;
                case 'channel': {
                    const arr: SpwNode[] = (anchors[item.key] = anchors[item.key] ?? []);
                    const anchor         = item as SpwChannelNode;
                    arr.push(anchor);
                    current.nodes.push(anchor);
                }
                    break;
                case 'strand': {
                    const strand = item as SpwStrandNode;
                    strands.push(strand);
                    let child = strand.head;
                    while (child) {
                        const next = child?.getProp('next');
                        if (!next) break;

                        current.links.push({source: child, target: next});
                        child = next;
                    }
                }
                    break;
                default:
                    break;
            }

        });
    return {anchors, strands};
}

export function useSpwD3(runtime: Runtime | undefined): D3DataCollection | undefined {
    const [data, setData] = useState<D3DataCollection | undefined>(undefined);

    useEffect(
        () => {
            if (!runtime) return;

            const all   = getAllNodes(runtime);
            const _data = new D3DataCollection();

            const {anchors, strands} = categorizeNodes(all, _data);
            // console.log({anchors, strands, current: _data});

            setData(_data);
        },
        [runtime],
    );

    useD3DataEffect(data);

    return data;
}