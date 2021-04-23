type SideEffects = { reset: boolean };

export const navigateToConcept = (l: string): SideEffects => {
    const curr = window.location.pathname;
    const next = `/${encodeURIComponent(l)}`;
    if (curr === next) {
        return {
            reset: false,
        }
    }
    (window.open(next, '_blank'));
    return {
        reset: true,
    };
};