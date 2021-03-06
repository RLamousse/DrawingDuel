import {Collection, FilterQuery, FindOneOptions} from "mongodb";
import {Message} from "../../../../common/communication/messages/message";
import {DatabaseError, EmptyIdError, NoElementFoundError} from "../../../../common/errors/database.errors";
import {EMPTY_QUERY, FindQuery, REMOVE_ID_PROJECTION_QUERY} from "../data-base.service";

export const DEFAULT_FIND_OPTIONS: FindOneOptions = {projection: REMOVE_ID_PROJECTION_QUERY};

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
    public async abstract update(id: string, data: Partial<T>): Promise<Message>;
    public async abstract delete(id: string): Promise<Message>;
    protected abstract creationSuccessMessage(data: T): Message;
    protected abstract updateSuccessMessage(id: string): Message;
    protected abstract deletionSuccessMessage(id: string): Message;
    protected abstract queryDeletionSuccessMessage(): Message;

    public async contains(id: string): Promise<boolean> {
        return await this.documentCount(id) !== 0;
    }

    public async getAll(findQuery?: FindQuery): Promise<T[]> {
        const query: FindQuery = findQuery ? findQuery : EMPTY_QUERY;

        return this._collection.find(query.filterQuery)
            .project({...REMOVE_ID_PROJECTION_QUERY, ...query.projectQuery})
            .toArray()
            .then((items: T[]) => items)
            .catch(() => {
                throw new DatabaseError();
            });
    }

    public async documentCountWithQuery(query: FilterQuery<T>): Promise<number> {
        try {
            return this._collection.countDocuments(query);
        } catch (error) {
            throw new DatabaseError();
        }
    }

    protected async documentCount(id: string): Promise<number> {
        try {
            return this._collection.countDocuments({[this.idFieldName]: {$eq: id}});
        } catch (error) {
            throw new DatabaseError();
        }
    }

    protected async createDocument(data: T): Promise<Message> {
        return this._collection.insertOne(data)
            .then(() => {
                return this.creationSuccessMessage(data);
            })
            .catch(() => {
                throw new DatabaseError();
            });
    }

    protected async updateDocument(id: string, data: Partial<T>): Promise<Message> {
        return this._collection.updateOne({[this.idFieldName]: {$eq: id}}, {$set: data})
            .then(() => {
                return this.updateSuccessMessage(id);
            })
            .catch(() => {
                throw new DatabaseError();
            });
    }

    protected async deleteDocument(id: string): Promise<Message> {
        return this._collection.deleteOne({[this.idFieldName]: {$eq: id}})
            .then(() => {
                return this.deletionSuccessMessage(id);
            })
            .catch(() => {
                throw new DatabaseError();
            });
    }

    protected async getDocument(id: string): Promise<T> {
        return this._collection.findOne(
            {
                [this.idFieldName]: {$eq: id},
            },
            DEFAULT_FIND_OPTIONS,
        ).then((value: T) => {
            if (value === null) {
                throw new NoElementFoundError();
            }

            return value;
        }).catch((error: Error) => {
            if (error.message === NoElementFoundError.NO_ELEMENT_FOUND_ERROR_MESSAGE) {
                throw error;
            }

            throw new DatabaseError();
        });
    }

}
