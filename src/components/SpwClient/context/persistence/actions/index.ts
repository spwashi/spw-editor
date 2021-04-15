import {SaveLifecycleAction} from './save/save';
import {SyncLifecycleAction} from './sync/sync';



/**
 * Actions that can be handled by the SpwService context
 */
export type ISpwServiceAction = SaveLifecycleAction | SyncLifecycleAction;