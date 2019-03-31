import {IInteractionData, IInteractionResponse} from "../../../../common/model/rooms/interaction";

export interface IGameRoom {
    id: string;
    gameName: string;
    vacant: boolean;

    checkIn(clientId: string): void;

    interact(clientId: string, interactionData: IInteractionData): Promise<IInteractionResponse>;

    checkOut(clientId: string): boolean;
}
