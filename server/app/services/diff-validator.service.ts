import Axios, {AxiosResponse} from "axios";
import {injectable} from "inversify";
import "reflect-metadata";
import {Bitmap} from "../../../common/image/bitmap/bitmap";
import {IPoint} from "../../../common/model/IPoint";
import {BitmapFactory} from "../images/bitmap/bitmap-factory";

@injectable()
export class DiffValidatorService {
    public async hasDifference(gameName: string, point: IPoint): Promise<boolean> {
        // const game: Game = await this.getGame(gameName);
        const diffImageBuffer: ArrayBuffer = await this.getDiffImage(gameName);
        const diffImage: Bitmap = BitmapFactory.createBitmap(gameName, new Buffer(diffImageBuffer));

        return diffImage.pixels[point.y][point.x] === 0;
    }

    // private async getGame(gameName: string): Promise<Game> {
    //     return Axios.get<Game>(`http://localhost:3000/api/data-base/games/${gameName}`)
    //         .then((value: AxiosResponse<Game>) => value.data)
    //         // tslint:disable-next-line:no-any Since Axios defines reason as `any`
    //         .catch((reason: any) => {
    //             throw new Error(reason);
    //         });
    // }

    private async getDiffImage(gameName: string): Promise<ArrayBuffer> {
        return Axios.get<ArrayBuffer>(`http://localhost:3000/api/data-base/images/diff/${gameName}`)
            .then((value: AxiosResponse<ArrayBuffer>) => value.data)
            // tslint:disable-next-line:no-any Since Axios defines reason as `any`
            .catch((reason: any) => {
                throw new Error(reason);
            });
    }
}
