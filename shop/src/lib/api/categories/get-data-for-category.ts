import type { Category } from '$types/categories';
import type { Product } from '$types/products';
import { apiWrapper } from '$lib/api/api-wrapper';

export const getDataForCategory = async (slug: string, fetch) => {
    let products: Product[], category: Category, error: string | null = null, status = 200;

    [ { data: products }, { data: category } ] = await Promise.all([
        apiWrapper<Product[]>(`/product?category=${slug}&sort=orderCount&limit=20`, {
            fetch,
            validate(data, handleError) {
                if (!Array.isArray(data))
                    return handleError(
                        'Impossible d\'obtenir les produits de cette catégorie. Veuillez réessayer.',
                        null,
                        new Error('Cannot display products of a category, invalid input data'),
                    );
            },
            reqPattern: '/product',
        })
            .then(res => {
                if (res.error)
                    error = res.error;
                if (res.status !== 200)
                    status = res.status;
                return res;
            }),
        apiWrapper<Category>(`/category/${slug}`, {
            fetch,
            validate(data, handleError) {
                if (!data.name)
                    return handleError(
                        'Impossible d\'obtenir les informations de la catégorie. Veuillez réessayer.',
                        null,
                        new Error('Cannot display category information, invalid input data'),
                    );
            },
            reqPattern: '/category/:slug',
        })
            .then(res => {
                if (res.error && typeof error !== 'string') // The product error has the priority, do not overwrite
                    error = res.error;
                if (res.status !== 200)
                    status = res.status;
                return res;
            }),
    ]);

    return {
        products,
        category,
        error,
        status,
    };
};
