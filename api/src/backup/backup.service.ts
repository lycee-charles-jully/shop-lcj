import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { Category, CategoryDoc } from '../schemas/category.schema';
import { Order, OrderDoc } from '../schemas/order.schema';
import { ProductType, ProductTypeDoc } from '../schemas/product-type.schema';
import { Product, ProductDoc } from '../schemas/product.schema';
import { Recommendation, RecommendationDoc } from '../schemas/recommendation.schema';
import { User, UserDoc } from '../schemas/user.schema';
import { RestoreBackupDto } from './dto/restore-backup.dto';
import { BackupData } from './entities/backup.entity';
import { BackupOrigin } from './enum/BackupOrigin';
import * as path from 'path';
import * as fs from 'fs';
import * as dayjs from 'dayjs';

@Injectable()
export class BackupService {
    constructor(
        @InjectModel('category') private readonly CategoryModel: Model<CategoryDoc>,
        @InjectModel('order') private readonly OrderModel: Model<OrderDoc>,
        @InjectModel('product') private readonly ProductModel: Model<ProductDoc>,
        @InjectModel('product-type') private readonly ProductTypeModel: Model<ProductTypeDoc>,
        @InjectModel('recommendation') private readonly RecommendationModel: Model<RecommendationDoc>,
        @InjectModel('user') private readonly UserModel: Model<UserDoc>,
    ) {
    }

    private static saveBackupToFile(backupData: BackupData, origin: BackupOrigin) {
        const backupTimestamp = new Date();
        const backupFolder = path.resolve('./backups');
        const backupPath = path.resolve(
            backupFolder,
            `${dayjs(backupTimestamp).format('YYYY-MM-DD_HH-mm-ss')}_lcjshop.json`,
        );
        const backup = {
            data: backupData,
            timestamp: backupTimestamp.toISOString(),
            origin,
        };
        fs.mkdirSync(backupFolder, { recursive: true });
        fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
    }

    async createBackup() {
        const backup = await this.getDatabaseBackup();
        BackupService.saveBackupToFile(backup, BackupOrigin.MANUAL);
        return {
            success: true,
        };
    }

    getBackup() {
        return this.getDatabaseBackup();
    }

    async restoreBackup({ backup, drop }: RestoreBackupDto) {
        const currentBackup = await this.getDatabaseBackup();
        BackupService.saveBackupToFile(currentBackup, BackupOrigin.OVERWRITE);
        try {
            if (drop) await Promise.all([
                this.CategoryModel.collection.drop(),
                this.OrderModel.collection.drop(),
                this.ProductModel.collection.drop(),
                this.ProductTypeModel.collection.drop(),
                this.RecommendationModel.collection.drop(),
                this.UserModel.collection.drop(),
            ]);
        } catch {
            drop = false;
        }
        try {
            await Promise.all([
                this.CategoryModel.insertMany(backup.data.categories),
                this.OrderModel.insertMany(backup.data.orders),
                this.ProductModel.insertMany(backup.data.products),
                this.ProductTypeModel.insertMany(backup.data.productTypes),
                this.RecommendationModel.insertMany(backup.data.recommendations),
                this.UserModel.insertMany(backup.data.users),
            ]);
        } catch (e) {
            throw new InternalServerErrorException(e.message);
        }
        return {
            success: true,
            dropped: drop,
        };
    }

    private static changelessTransform(docs: Document[]) {
        return docs.map(d => d.toObject({ versionKey: true, transform: ((doc, ret) => ret) }));
    }

    private async getDatabaseBackup(): Promise<BackupData> {
        const [ categories, orders, products, productTypes, recommendations, users ] = await Promise.all([
            this.CategoryModel.find().exec().then(BackupService.changelessTransform) as Promise<Category[]>,
            this.OrderModel.find().exec().then(BackupService.changelessTransform) as Promise<Order[]>,
            this.ProductModel.find().exec().then(BackupService.changelessTransform) as Promise<Product[]>,
            this.ProductTypeModel.find().exec().then(BackupService.changelessTransform) as Promise<ProductType[]>,
            this.RecommendationModel.find().exec().then(BackupService.changelessTransform) as Promise<Recommendation[]>,
            this.UserModel.find().exec().then(BackupService.changelessTransform) as Promise<User[]>,
        ]);
        return { categories, orders, products, productTypes, recommendations, users };
    }
}
