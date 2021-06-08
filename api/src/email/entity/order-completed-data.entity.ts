export class OrderCompletedDataEntity {
    total: string;
    name: string;
    products: OrderCompletedProductEntity[];
}

export class OrderCompletedProductEntity {
    name: string;
    quantity: string;
    image: string;
    slug: string;
}
