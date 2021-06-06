import type { CategoryPopulated } from '$types/categories';
import { apiWrapper } from '$lib/api/api-wrapper';

export const getCategoriesList = (fetch) => apiWrapper<CategoryPopulated[]>('/category', {
    fetch,
    validate(data, handleError) {
        if (!Array.isArray(data))
            return handleError(
                'Impossible de récupérer la liste des catégories. Veuillez réessayer.',
                null,
                new Error('Cannot display categories list, invalid input data'),
            );
    },
});
