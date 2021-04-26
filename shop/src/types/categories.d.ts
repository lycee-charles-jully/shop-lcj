export interface Category {
    id: string,
    name: string,
    slug: string,
}

export interface CategoryPopulated extends Category {
    products: [ {
        _id: string,
        coverImageUrl: string,
    } ],
    productType: {
        _id: string,
        name: string,
        namePluralized: string,
    },
}
