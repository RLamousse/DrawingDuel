import {IInteractionData} from "../../../../common/model/rooms/interaction";

export interface IGameRoom {
    gameName: string;
    vacant: boolean;

    join(clientId: string): void;

    interact(interactionData: IInteractionData): void;

    leave(clientId: string): void;
}
