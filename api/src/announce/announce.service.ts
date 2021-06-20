import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { AnnounceDoc } from '../schemas/announces.schema';
import { UserDoc } from '../schemas/user.schema';
import { CreateAnnounceDto } from './dto/create-announce.dto';
import { AnnouncePositionEnum } from './enum/announce-position.enum';

@Injectable()
export class AnnounceService {
    constructor(
        @InjectModel('announce') private readonly AnnounceModel: Model<AnnounceDoc>,
        @InjectModel('user') private readonly UserModel: Model<UserDoc>,
    ) {
    }


    createAnnounce(userID: string, details: CreateAnnounceDto) {
        return new this.AnnounceModel({ ...details, createdBy: userID }).save();
    }


    getAllAnnounces() {
        return this.AnnounceModel
            .find()
            .populate({
                path: 'createdBy',
                model: this.UserModel,
                select: [ 'firstname', 'lastname', 'role' ],
            } as PopulateOptions)
            .exec();
    }


    getAnnouncesForUser(position: AnnouncePositionEnum) {
        return this.AnnounceModel
            .find({ active: true, position })
            .select([ 'message', 'position' ])
            .exec();
    }
}
