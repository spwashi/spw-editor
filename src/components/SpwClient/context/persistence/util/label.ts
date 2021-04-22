export function serializeLabelComponents(components: string[]) {
    return components.map(c => `${c}`).join('/');
}