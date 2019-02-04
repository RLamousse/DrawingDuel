export interface Game{
    title: string;
    soloScores: {name:string, time: number}[];
    duoScores: {name:string, time: number}[];
    image: string;
}
