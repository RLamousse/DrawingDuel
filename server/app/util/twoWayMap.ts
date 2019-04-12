export class TwoWayMap<T, U> {
    private readonly map: Map<T, U>;
    private readonly revMap: Map<U, T>;

    public constructor() {
        this.map = new Map();
        this.revMap = new Map();
    }

    public set(key: T, revKey: U): void {
        this.map.set(key, revKey);
        this.revMap.set(revKey, key);
    }

    public get(key: T): U | undefined {
        return this.map.get(key);
    }

    public revGet(key: U): T | undefined {
        return this.revMap.get(key);
    }

    public delete(key: T): void {
        this.revMap.delete(this.map.get(key) as U);
        this.map.delete(key);
    }
}
