export abstract class CollectionService<T> {
    public abstract getAll(id: string): T;
    public abstract get(id: string): T;
    public abstract create(id: string): T;
    public abstract delete(id: string): T;
}
