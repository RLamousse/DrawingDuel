import Axios, {AxiosResponse} from "axios";
import {injectable} from "inversify";
import "reflect-metadata";
import {Bitmap} from "../../../common/image/bitmap/bitmap";
import {IGame} from "../../../common/model/IGame";
import {IPoint} from "../../../common/model/IPoint";
import {BitmapFactory} from "../images/bitmap/bitmap-factory";

@injectable()
export class DiffValidatorService {
    public async hasDifference(gameName: string, point: IPoint): Promise<boolean> {
        const game: IGame = await this.getGame(gameName);
        const diffImageBuffer: ArrayBuffer = await this.getDiffImage(game.diffImage);
        const diffImage: Bitmap = BitmapFactory.createBitmap(gameName, new Buffer(diffImageBuffer));

        return diffImage.pixels[point.y][point.x] === 0;
    }

    private async getGame(gameName: string): Promise<IGame> {
        return Axios.get<IGame>(`http://localhost:3000/api/data-base/games/${gameName}`)
            .then((value: AxiosResponse<IGame>) => value.data)
            // tslint:disable-next-line:no-any Since Axios defines reason as `any`
            .catch((reason: any) => {
                throw new Error(reason);
            });
    }

    private async getDiffImage(diffImageName: string): Promise<ArrayBuffer> {
        return Axios.get<ArrayBuffer>(`http://localhost:3000/api/data-base/images/${diffImageName}`)
            .then((value: AxiosResponse<ArrayBuffer>) => value.data)
            // tslint:disable-next-line:no-any Since Axios defines reason as `any`
            .catch((reason: any) => {
                throw new Error(reason);
            });
    }
}
