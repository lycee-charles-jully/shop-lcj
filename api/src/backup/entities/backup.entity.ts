import { Category } from '../../schemas/category.schema';
import { Order } from '../../schemas/order.schema';
import { ProductType } from '../../schemas/product-type.schema';
import { Product } from '../../schemas/product.schema';
import { Recommendation } from '../../schemas/recommendation.schema';
import { User } from '../../schemas/user.schema';
import { BackupOrigin } from '../enum/BackupOrigin';

export class BackupEntity {
    data: BackupData;
    timestamp: string;
    origin: BackupOrigin;
}


export class BackupData {
    categories: Category[];
    orders: Order[];
    products: Product[];
    productTypes: ProductType[];
    recommendations: Recommendation[];
    users: User[];
}
