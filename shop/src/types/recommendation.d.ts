import type { BasicProduct } from '$types/products';

export interface Recommendation {
    _id: string;
    message: string;
    recommendedProduct: BasicProduct;
}
