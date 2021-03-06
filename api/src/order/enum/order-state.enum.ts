export enum OrderStateEnum {
    WAITING_FOR_ACCEPTATION = 'WAITING_FOR_ACCEPTATION',
    PREPARATING = 'PREPARATING',
    DELIVERING = 'DELIVERING',
    COMPLETED = 'COMPLETED',
    USER_CANCELLED = 'USER_CANCELLED',
    ADMIN_CANCELLED = 'ADMIN_CANCELLED',
}

export const pendingStates = [
    OrderStateEnum.WAITING_FOR_ACCEPTATION,
    OrderStateEnum.PREPARATING,
    OrderStateEnum.DELIVERING,
];

