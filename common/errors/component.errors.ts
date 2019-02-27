export class ComponentNotLoadedError extends Error {
    public static readonly COMPONENT_NOT_LOADED_MESSAGE_ERROR: string = "Component was not initialised!";
    constructor() {
        super(ComponentNotLoadedError.COMPONENT_NOT_LOADED_MESSAGE_ERROR);
    }
}