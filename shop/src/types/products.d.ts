export interface BasicProduct {
    _id: string;
    name: string;
    slug: string;
    coverImageUrl: string;
    price: number;
}

export interface Product extends BasicProduct {
    description: string;
    imagesUrls: string[];
}

export interface HomeProducts {
    popular: BasicProduct[];
    latest: BasicProduct[];
}
