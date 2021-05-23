import { Model, Types } from 'mongoose';

export function getInvalidIDs(ids: (Types.ObjectId | string)[], model: Model<any>) {
    return Promise.all(
        ids.map(async id => ({
            id,
            exists: await model.exists({ _id: id }).catch(() => false),
        })),
    )
        .then(res => res.filter(e => !e.exists))
        .then(res => res.map(e => typeof e.id !== 'string' ? e.id.toHexString() : e.id));
}
