import {Collection, MongoError} from "mongodb";
import {Message} from "../../../../common/communication/messages/message";
import {DatabaseError, EmptyIdError} from "../../../../common/errors/database.errors";

export abstract class CollectionService<T> {

    public constructor(collection: Collection<T>) {
        this._collection = collection;
    }
    protected abstract get idFieldName(): string;
    protected _collection: Collection<T>;

    protected static assertId(id: string): void {
        if (id === "") {
            throw new EmptyIdError();
        }
    }

    public async abstract getFromId(id: string): Promise<T>;
    public async abstract create(data: T): Promise<Message>;
    public async abstract delete(id: string): Promise<Message>;
    public abstract creationSuccessMessage(data: T): Message;
    public abstract deletionSuccessMessage(id: string): Message;

    public async contains(id: string): Promise<boolean> {
        return await this.documentCount(id) !== 0;
    }

    public async getAll(): Promise<T[]> {
        return new Promise<T[]>((resolve: (value?: T[] | PromiseLike<T[]>) => void, reject: (reason?: Error) => void) => {
            this._collection.find().toArray((error: MongoError, res: T[]) => {
                if (error) {
                    reject(new DatabaseError());
                }
                resolve(res);
            });
        });
    }

    protected async documentCount(id: string): Promise<number> {
        try {
            return this._collection.countDocuments({[this.idFieldName]: {$eq: id}});
        } catch (error) {
            throw new DatabaseError();
        }
    }

    protected async createDocument(data: T): Promise<Message> {
        return new Promise<Message>((resolve: (value?: Message | PromiseLike<Message>) => void, reject: (reason?: Error) => void) => {

            this._collection.insertOne(data, (error: MongoError) => {
                if (error) {
                    reject(new DatabaseError());
                }
                resolve(this.creationSuccessMessage(data));
            });
        });
    }

    protected async deleteDocument(id: string): Promise<Message> {
        return new Promise<Message>((resolve: (value?: Message | PromiseLike<Message>) => void, reject: (reason?: Error) => void) => {
            this._collection.deleteOne({[this.idFieldName]: {$eq: id}}, (error: MongoError) => {
                if (error) {
                    reject(new DatabaseError());
                }
                resolve(this.deletionSuccessMessage(id));
            });
        });
    }

    protected async getDocument(id: string, errorMessage: string): Promise<T> {
        return new Promise<T>((resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: Error) => void) => {
            this._collection.find({[this.idFieldName] : {$eq : id}}).toArray((error: MongoError, res: T[]) => {
                if (error) {
                    return reject(new DatabaseError());
                } else if (res.length === 0) {
                    return reject(new Error(errorMessage));
                }

                return resolve(res[0]);
            });
        });
    }

}
