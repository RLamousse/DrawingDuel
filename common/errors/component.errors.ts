export class ComponentNotLoadedError extends Error {
    public static readonly COMPONENT_NOT_LOADED_MESSAGE_ERROR: string = "Component was not initialised!";
    constructor() {
        super(ComponentNotLoadedError.COMPONENT_NOT_LOADED_MESSAGE_ERROR);
    }
}

export class ComponentNavigationError extends Error {
    public static readonly COMPONENT_NAVIGATION_ERROR_MESSAGE: string = "Error in navigation!";

    constructor() {
        super(ComponentNavigationError.COMPONENT_NAVIGATION_ERROR_MESSAGE);
    }
}

export class ComponentCanvasError extends Error {
    public static readonly COMPONENT_CANVAS_ERROR_MESSAGE: string = "Error in canvas!";

    constructor() {
        super(ComponentCanvasError.COMPONENT_CANVAS_ERROR_MESSAGE);
    }
}

export class FreeViewGamesRenderingError extends  Error {
    public static readonly FREE_VIEW_GAMES_RENDERING_ERROR_MESSAGE: string = "An error occured when trying to render the free view games";
    constructor() {
        super(FreeViewGamesRenderingError.FREE_VIEW_GAMES_RENDERING_ERROR_MESSAGE);
    }
}
