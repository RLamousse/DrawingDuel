import {Client} from "@rmp135/imgur";
import * as config from "config";
import {injectable} from "inversify";
import "reflect-metadata";
import {ImageUploadServiceError} from "../../../common/errors/services.errors";

@injectable()
export class ImageUploadService {
    private readonly imgurClient: Client = new Client({
            client_id: config.get("imgur.clientID"),
            client_secret: config.get("imgur.clientSecret"),
    });

    public async uploadImage(imageData: Buffer): Promise<string> {
        return this.imgurClient.Image.upload(imageData)
            .then((res: APIResponse<ImageResponse>) => {
                return res.data.link;
            })
            // tslint:disable-next-line:no-any Imgur response
            .catch(() => {
                throw new ImageUploadServiceError();
            });
    }
}
