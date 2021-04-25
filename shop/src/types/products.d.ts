export interface BasicProduct {
    _id: string;
    name: string;
    slug: string;
    coverImageUrl: string;
    price: number;
}

export interface HomeProducts {
    popular: BasicProduct[];
    latest: BasicProduct[];
}
