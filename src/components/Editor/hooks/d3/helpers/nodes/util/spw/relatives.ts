import {SpwNode} from '@spwashi/spw/ast/node/spwNode';
import getGeneration from './properties';
import {getRelativesFromParent} from './relatives/fromParent';
import {NodeInfo} from './types/nodeInfo';
import {getNearestBlock} from './relatives/nearestBlock';
import {SpwBlockNode} from '@spwashi/spw/ast/node/nodeTypes/helper/block';
import {SpwStrandNode} from '@spwashi/spw/ast/node/nodeTypes/strandNode';

const _neighborCache      = new Map()
const $$_ExcludeNodeTypes = ['strand', 'node'];


/**
 * Returns an object
 *
 * @param node
 */
export function getNodeInfo(node: SpwNode): NodeInfo {
    // cache
    if (_neighborCache.has(node)) return _neighborCache.get(node);

    // properties
    const owner  = node.getProp('owner');
    const parent = node.getProp('parent');

    const {
              firstNodeInStrand,
              orderInParent,
              strandDistance,
              firstNodeInBlock,
          }                  = getRelativesFromParent(parent, node);
    let _nearestBlock: SpwBlockNode;
    const nodeInfo: NodeInfo =
              {
                  self:       node,
                  generation: owner ? (getGeneration(owner)) : (getGeneration(node)),

                  orderInParent,

                  // parent

                  parent,
                  get parentRelationships() { return _neighborCache.get(parent) },

                  // EffectiveParent

                  effectiveParent: $$_ExcludeNodeTypes.includes(parent?.kind) ? parent?.getProp('parent') : parent,
                  get effectiveParentRelationships() { return _neighborCache.get(parent) },

                  // Owner

                  owner,
                  get ownerRelationships() { return _neighborCache.get(owner) },

                  // Specific Node Types

                  phrase:
                      {
                          orderInParent,
                      },

                  strand:
                      {
                          orderInParent,
                          firstNode:        firstNodeInStrand,
                          distanceFromHead: strandDistance,

                          get siblings() {
                              if (!parent || (parent.kind !== 'strand')) return [];
                              return parent.getProp('nodes')?.filter((n: SpwNode) => n !== node && n?.kind !== 'transport');
                              return [];
                          },
                      },

                  block:
                      {
                          orderInParent,
                          get nearest() {
                              return _nearestBlock = _nearestBlock ?? getNearestBlock(node)
                          },
                          firstNode: firstNodeInBlock,
                          get siblings() {
                              const blockNode = this.nearest;
                              if (!blockNode || getGeneration(blockNode) - getGeneration(node) > 1) return [];
                              const body             = blockNode?.body as unknown as SpwNode[] | undefined ?? [];
                              const distanceFromHead = nodeInfo.strand.distanceFromHead;
                              if (body.length <= 1) return [];

                              if (parent.kind === 'strand' && typeof distanceFromHead !== 'undefined') {
                                  const siblings = body.filter(node => node.kind === 'strand')
                                                       .map((node: SpwNode) =>
                                                                (
                                                                    (node as SpwStrandNode).getProp('nodes') ?? []
                                                                )[distanceFromHead])
                                                       .filter(n => n !== node);

                                  Object.defineProperty(this, 'siblings', {value: siblings})

                                  console.log(siblings);
                                  return siblings;
                              }

                              return (
                                  body.map(node => {
                                      return node.kind === 'strand' ? (node as SpwStrandNode).head : node;
                                  })
                              )
                          },
                      },
              }

    _neighborCache.set(node, nodeInfo);
    return nodeInfo;
}

export function _clearNodeCache() {
    _neighborCache.clear();
}