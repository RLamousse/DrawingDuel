import {IInteractionData, IInteractionResponse} from "../../../../common/model/rooms/interaction";
import {ReadyInfo} from "../../../../common/model/rooms/ready-info";

export interface IGameRoom {
    id: string;
    gameName: string;
    playerCapacity: number;
    vacant: boolean;
    empty: boolean;
    ongoing: boolean;
    roomReadyEmitInformation: ReadyInfo;

    checkIn(clientId: string): void;

    handleReady(clientId: string): void;

    setOnReadyCallBack(callback: () => void): void;

    interact(clientId: string, interactionData: IInteractionData): Promise<IInteractionResponse>;

    checkOut(clientId: string): void;
}
