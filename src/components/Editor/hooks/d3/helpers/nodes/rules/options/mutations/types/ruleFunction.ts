import {NodeInfo} from '../../../../util/spw/types/nodeInfo';
import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import {D3Node} from '../../../../../../types';
import {NodeDataContainer} from '../../../../container';

export type RuleFunctionTrigger = () => any;
export type RuleFunctionPayload = { info: NodeInfo, node: SpwNode, d: D3Node, nodeCollection: NodeDataContainer };
export type TopLevelMutationFunction = (data: RuleFunctionPayload) => any;
export type RuleFunction = (next: RuleFunctionTrigger, data: RuleFunctionPayload) => any;
export type MutationRule = {
    id: string;
    match?: (payload: RuleFunctionPayload) => boolean;
}
export type XRule = MutationRule & {
    modifyX: RuleFunction;
};
export type YRule = MutationRule & { id: string, modifyY: RuleFunction };
