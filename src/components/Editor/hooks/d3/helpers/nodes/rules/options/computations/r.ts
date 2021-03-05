import {SpwNode} from '@spwashi/spw/ast/node/spwNode';

export function r_rConstraint(){
    const r =
              (node: SpwNode): number => {
                  const parent = node.getProp('parent');
                  if (parent?.kind === 'phrase' || (parent?.kind === 'node' && parent?.getProp('parent').kind === 'phrase')) {
                      return 1;
                  }

                  const parentOwner = parent?.getProp('owner');
                  if (parentOwner) {
                      return r(parentOwner)
                  }
                  switch (node.kind) {
                      case 'essence':
                          return 1;
                      case 'domain':
                          return 4;
                      default:
                          return 4;
                  }
              };
    return r;
}