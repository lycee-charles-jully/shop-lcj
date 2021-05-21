import type { CartItem } from '$types/cart';

export interface User {
    _id: string,
    email: string,
    firstname: string,
    lastname: string,
    grade: string,
    jeunestNumber: string,
    role: number,
    cart: CartItem[],
    tokenCreatedAt: string,
}
