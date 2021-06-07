export class OrderConfirmationDataEntity {
    total: string;
    orderID: string;
    name: string;
    products: OrderConfirmationProductEntity[];
}

export class OrderConfirmationProductEntity {
    name: string;
    quantity: string;
    image: string;
    slug: string;
}
