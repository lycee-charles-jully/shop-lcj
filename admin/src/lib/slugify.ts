export const slugify = (slug: string) => slug
    .toLowerCase()
    .replace(/[ _\d]/g, '-')
    .replace(/[éêèë]/ig, 'e')
    .replace(/[àäâ]/gi, 'a')
    .replace(/[üû]/gi, 'u')
    .replace(/[öô]/gi, 'o')
    .replace(/[^\w-]/g, '-');