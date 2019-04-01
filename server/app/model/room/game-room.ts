import {IInteractionData, IInteractionResponse} from "../../../../common/model/rooms/interaction";

export interface IGameRoom {
    id: string;
    gameName: string;
    vacant: boolean;
    empty: boolean;
    ongoing: boolean;

    checkIn(clientId: string): void;

    interact(clientId: string, interactionData: IInteractionData): Promise<IInteractionResponse>;

    checkOut(clientId: string): void;
}
