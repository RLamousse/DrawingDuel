import {Client} from "@rmp135/imgur";
import {expect} from "chai";
import {instance, mock, when} from "ts-mockito";
import {ImageUploadServiceError} from "../../../common/errors/services.errors";
import {ImageUploadService} from "./image-upload.service";

describe("A service uploading images to imgur", () => {

    const imageUploadService: ImageUploadService = new ImageUploadService();
    let mockedImgurClient: Client;

    const injectClient: () => void = () => {
        // @ts-ignore For test purposes, ignore readonly property
        imageUploadService["imgurClient"] = instance(mockedImgurClient);
    };

    beforeEach(() => {
        mockedImgurClient = mock(Client);
    });

    it("should return the image link on success", async () => {
        when(mockedImgurClient.Image)
            .thenReturn(
                // @ts-ignore We only want to mock! Ignore missing fields
                {
                    upload: async () => {
                        return Promise.resolve(
                            {
                                data: {
                                    link: "a-link",
                                },
                            } as APIResponse<ImageResponse>);
                    },
                });

        injectClient();

        return imageUploadService.uploadImage(Buffer.of())
            .then((url: string) => {
                expect(url).to.eql("a-link");
            });
    });

    it("should throw on failure", async () => {
        when(mockedImgurClient.Image)
            .thenReturn(
                // @ts-ignore We only want to mock! Ignore missing fields
                {
                    upload: async () => {
                        return Promise.reject();
                    },
                });

        injectClient();

        return imageUploadService.uploadImage(Buffer.of())
            .catch((error: ImageUploadServiceError) => {
                expect(error.message)
                    .to.eql(ImageUploadServiceError.IMAGE_UPLOAD_ERROR_MESSAGE);
            });
    });
});
