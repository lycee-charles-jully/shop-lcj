export function imgload(picture: HTMLImageElement) {

    if (!('loading' in HTMLImageElement.prototype))
        return {};

    if (picture.tagName.toLowerCase() !== 'picture')
        throw new Error(`A picture element is required to use the image loader, ${picture.tagName} used`);

    const img = picture.querySelector('img');

    if (!img)
        throw new Error('A img element is required');

    picture.classList.add('picture-loader');

    if (!img.complete) {
        applyLoadingState();
        img.addEventListener('load', handleImageLoad, false);
        img.addEventListener('error', handleImageError, false);
    } else if (img.naturalWidth === 0) {
        picture.classList.add('picture-error');
    }

    function applyLoadingState() {
        picture.classList.add('picture-loading');
        img.classList.add('img-loading');
    }

    function handleImageLoad() {
        picture.classList.remove('picture-loading');
        img.classList.remove('img-loading');
    }

    function handleImageError() {
        picture.classList.remove('picture-loading');
        picture.classList.add('picture-error');
    }

    return {
        destroy() {
            img.removeEventListener('load', handleImageLoad, false);
            img.removeEventListener('error', handleImageError, false);
        },
    };
}
