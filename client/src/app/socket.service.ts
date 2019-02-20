import { Injectable } from "@angular/core";
import { connect } from "socket.io-client";

@Injectable()
export class SocketService {

    private readonly BASE_URL: string = "http://localhost:3000/";

    public openSocket(): SocketIOClient.Socket {
        return connect(this.BASE_URL);
    }
}
