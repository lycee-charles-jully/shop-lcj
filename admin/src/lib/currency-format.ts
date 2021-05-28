const formatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

export const currencyFormat = (price: number) => formatter.format(price);