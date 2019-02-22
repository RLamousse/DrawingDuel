import {Injectable} from "@angular/core";
import Axios, {AxiosResponse} from "axios";
import {IDiffValidatorControllerRequest} from "../../../common/communication/requests/diff-validator-controller.request";
import {IDiffValidatorControllerResponse} from "../../../common/communication/responses/diff-validator-controller.response";
import {DIFFERENCE_CLUSTER_POINTS_INDEX, DifferenceCluster} from "../../../common/model/game/simple-game";
import {IPoint} from "../../../common/model/point";

export const IMAGE_DATA_PIXEL_SIZE: number = 4;

@Injectable({
              providedIn: "root",
            })
export class SimpleGameService {
  public constructor() {
  }

  private _gameName: string;

  public set gameName(value: string) {
    this._gameName = value;
  }

  public static getImageDataForDifferenceCluster(
    differenceCluster: DifferenceCluster,
    originalImageData: ImageData): ImageData {

    const appendedImageData: ImageData = new ImageData(originalImageData.width, originalImageData.height);

    for (const point of differenceCluster[DIFFERENCE_CLUSTER_POINTS_INDEX]) {
      const pixelStartIndex: number = originalImageData.width * point.y + point.x;
      const pixelData: Uint8ClampedArray = originalImageData.data.slice(pixelStartIndex, pixelStartIndex + IMAGE_DATA_PIXEL_SIZE);

      for (let i: number = 0; i < pixelData.length; i++) {
        appendedImageData.data[pixelStartIndex + i] = pixelData[i];
      }
    }

    return appendedImageData;
  }

  public async validateDifferenceAtPoint(point: IPoint): Promise<DifferenceCluster> {
    return Axios.get<IDiffValidatorControllerResponse>(
      "http://localhost:3000/api/diff-validator",
      {
        params: {
          coordX: point.x,
          coordY: point.y,
          gameName: this._gameName,
        } as IDiffValidatorControllerRequest,
      })
      .then((value: AxiosResponse<IDiffValidatorControllerResponse>) => {
        const differenceCluster: DifferenceCluster = [value.data.differenceClusterId, value.data.differenceClusterCoords];
        // TODO: encountered differences
        return differenceCluster;
      });
  }
}
