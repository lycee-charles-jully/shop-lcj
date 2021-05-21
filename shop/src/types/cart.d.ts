import type { BasicProduct } from '$types/products';

export interface CartItem {
    count: number,
    product: string,
}

export interface CartItemPopulated extends CartItem {
    product: BasicProduct,
}
