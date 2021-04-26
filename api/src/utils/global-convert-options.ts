import mongoose from 'mongoose';

export const globalConvertOptions: mongoose.ToObjectOptions = {
    versionKey: false,
};