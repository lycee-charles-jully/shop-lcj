export interface Announce {
    _id: string;
    message: string;
    position: AnouncePosition;
}

export type AnouncePosition = 'HOME';
