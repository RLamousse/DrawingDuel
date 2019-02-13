export interface IBitmapImage {
    name: string;
    data: number[];
}

export interface IBitmapImageDB extends IBitmapImage{
    _id: mongodb.ObjectId;
}
