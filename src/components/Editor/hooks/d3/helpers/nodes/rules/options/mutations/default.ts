import {
    blockChildrenRule,
    firstNodeInBlockRule,
    inBlock_afterFirstNode,
    inStrand_afterFirstNodeRule,
    inStrandNode_firstInBlockRule,
    phraseNodeRule,
    topLevelNodeRule,
} from './rules';
import {alignSiblingsRule} from './rules/alignSiblingsRule';

const rules      =
          [
              alignSiblingsRule,
              inStrandNode_firstInBlockRule,
              firstNodeInBlockRule,
              blockChildrenRule,
              inBlock_afterFirstNode,
              inStrand_afterFirstNodeRule,
              topLevelNodeRule,
              phraseNodeRule,
          ];
const dimensions = ['modifyX', 'modifyY']
export default {rules, dimensions}