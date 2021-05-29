import type { CartItem } from '$types/cart';

export interface Order {
    _id: string;
    status: OrderStatus;
    user: string;
    createdAt: string;
    modifiedAt: string;
    items: CartItem;
    history: OrderHistoryElement[];
}

export type OrderStatus =
    'WAITING_FOR_ACCEPTATION'
    | 'PREPARATING'
    | 'DELIVERING'
    | 'COMPLETED'
    | 'USER_CANCELLED'
    | 'ADMIN_CANCELLED';

export interface OrderHistoryElement {
    newStatus: OrderStatus;
    createdAt: string;
}
