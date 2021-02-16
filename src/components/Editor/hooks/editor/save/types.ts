/**
 * A timestamp reported by the client
 */
type FrontendTimestamp = number;
type BackendTimestamp = number;

export interface EditorSaveAttempt {
    // Set to the timestamp a client has initiated a save attempt
    initiated: FrontendTimestamp | null,
    completion: {
        success?: boolean;
        completed: FrontendTimestamp | null;
        rawResponse?: any;
        // progress: number
    }
}

export interface EditorSaveResponse {
    saved: boolean;
}