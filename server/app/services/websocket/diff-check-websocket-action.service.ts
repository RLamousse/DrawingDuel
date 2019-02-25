import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import * as Httpstatus from "http-status-codes";
import { injectable } from "inversify";
import * as io from "socket.io";
import { WebsocketMessage } from "../../../../common/communication/messages/message";
import { IDiffValidatorControllerRequest } from "../../../../common/communication/requests/diff-validator-controller.request";
import { IDiffValidatorControllerResponse } from "../../../../common/communication/responses/diff-validator-controller.response";
import { SocketEvent } from "../../../../common/communication/socket-events";
import { WebsocketActionService } from "./websocket-action.service";
@injectable()
export class DiffCheckWebsocketActionService extends WebsocketActionService {

    public static readonly DIFF_ERR: string = "DiffCheckWebsocketActionService: Something went wrong during the call to micro-service";
    private readonly _EVENT_TYPE: SocketEvent = SocketEvent.CHECK_DIFFERENCE;

    public execute(data: WebsocketMessage<IDiffValidatorControllerRequest>, socket: io.Socket): void {
        this.checkPoint(data.body.gameName, data.body.coordX, data.body.coordY)
        .then((response: IDiffValidatorControllerResponse) => {
            this.emitMessage<IDiffValidatorControllerResponse>(response, socket);
        })
        .catch((invalidDiff: Object) => {
            this.emitMessage(invalidDiff, socket);
        });
    }

    private async checkPoint(gameName: string, coordX: number, coordY: number): Promise<IDiffValidatorControllerResponse | Error> {
        return new Promise<IDiffValidatorControllerResponse | Error>(
            (resolve: (value?: IDiffValidatorControllerResponse | Error) => void,
             reject: (reason?: string) => void) => {
                const config: AxiosRequestConfig = {
                    params: {
                        gameName,
                        coordX,
                        coordY,
                    },
                };
                Axios.get<IDiffValidatorControllerResponse>("http://localhost:3000/api/diff-validator", config)
                    .then((response: AxiosResponse<IDiffValidatorControllerResponse>) => {
                        resolve(response.data as IDiffValidatorControllerResponse);
                    })
                    // tslint:disable-next-line:no-any Generic error response
                    .catch((reason: any) => {
                        if (reason.response.data && reason.response.status === Httpstatus.NOT_FOUND) {
                            reject("");
                        }
                        reject(DiffCheckWebsocketActionService.DIFF_ERR);
                    });
            });
    }

    private emitMessage<Type = Object>(content: Type, socket: io.Socket): void {
        const socketMessage: WebsocketMessage<Type> = {
            title: this._EVENT_TYPE,
            body: content,
        }
        socket.emit(this._EVENT_TYPE, socketMessage);
    }
}
