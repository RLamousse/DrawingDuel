import {Collection, Db, MongoClient} from "mongodb";
import {anything, anyString, instance, mock, spy, when} from "ts-mockito";
import * as TypeMoq from "typemoq";
import {IFreeGame} from "../../../common/model/game/free-game";
import {ISimpleGame} from "../../../common/model/game/simple-game";
import {FREE_GAMES_COLLECTION, SIMPLE_GAMES_COLLECTION} from "./data-base.service";

beforeEach("Mongo Setup", () => {
    const mongoDbMock: Db = mock(Db);
    when(mongoDbMock.collection(SIMPLE_GAMES_COLLECTION))
        .thenReturn(TypeMoq.Mock.ofType<Collection<ISimpleGame>>().object);
    when(mongoDbMock.collection(FREE_GAMES_COLLECTION))
        .thenReturn(TypeMoq.Mock.ofType<Collection<IFreeGame>>().object);

    const mongoClientMock: MongoClient = mock(MongoClient);
    when(mongoClientMock.db(anyString()))
        .thenReturn(instance(mongoDbMock));

    // tslint:disable-next-line:no-any Static instance has no type
    const staticMongoClientSpy: any = spy(MongoClient);

    when(staticMongoClientSpy.connect(anyString(), anything()))
    // @ts-ignore Should resolve to an instance of mongo client
        .thenResolve(instance(mongoClientMock));
});
