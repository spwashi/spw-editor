import {MutationRule, RuleFunction, RuleFunctionPayload, TopLevelMutationFunction} from './types/ruleFunction';


type DimensionMethodName = 'modifyX' | 'modifyY';
export function getMutationRules(enabledRules: MutationRule[], chosenMethods: DimensionMethodName[]): TopLevelMutationFunction[] {
    return enabledRules.map(item => (
        function ruleFunction(payload: RuleFunctionPayload) {
            chosenMethods
                .reduce((skip, index) => {
                    if (skip[index] || !(item.match?.(payload) ?? true)) return skip;

                    const key      = index as keyof MutationRule
                    const callback = item[key] as RuleFunction | unknown;

                    let shouldContinue = false;
                    let next           = () => shouldContinue = true;
                    if (typeof callback === 'function') {
                        callback?.(next, payload);
                    }

                    // continue trying this index if the next has not been called
                    skip[index] = !shouldContinue;
                    return skip;
                }, {} as { [name: string]: boolean });
        } as TopLevelMutationFunction
    ));
}
