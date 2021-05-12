import { Category } from '../../schemas/category.schema';
import { ProductType } from '../../schemas/product-type.schema';
import { Product } from '../../schemas/product.schema';
import { User } from '../../schemas/user.schema';
import { BackupOrigin } from '../enum/BackupOrigin';

export class BackupEntity {
    data: BackupData;
    timestamp: string;
    origin: BackupOrigin;
}


export class BackupData {
    products: Product[];
    productTypes: ProductType[];
    categories: Category[];
    users: User[];
}
