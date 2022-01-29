// Description: the configuration file for the data validator for the FitMeIn Application
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const postSpotSchema = {
    title: value => value.length > 0 && value.length <= 32,
    price: value => value === null || (typeof value) === 'number',
    description: value => value.length > 0 && value.length <= 256,
    duration: value => value === null || (typeof value) === 'number',
    price: value => value === null || (typeof value) === 'number',
    imageUrl: value => /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(value)
};

const putSpotSchema = {
    id: value => value === null || (typeof value) === 'number',
    title: value => value.length > 0 && value.length <= 32,
    description: value => value.length > 0 && value.length <= 256,
    duration: value => value === null || (typeof value) === 'number',
    price: value => value === null || (typeof value) === 'number',
    price: value => value === null || (typeof value) === 'number',
    imageUrl: value => /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(value)
};

const patchSpotBasketSchema = {
    id: value => value === null || (typeof value) === 'number',
    inBasketUserID: value => value === null || (typeof value) === 'number'
};

const patchSpotBasketRemoveSchema = {
    id: value => value === null || (typeof value) === 'number'
};

const patchSpotPurchaseSchema = {
    id: value => value === null || (typeof value) === 'number',
    purchasedByUserId: value => value === null || (typeof value) === 'number'
};

const postOrderSchema = {
    localId: value => value === null || (typeof value) === 'number',
    // basketItems: value => /^[\],:{}\s]*$/.test(value.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, '')),
    basketItems: value => String(value).length > 0,
    total: value => value === null || (typeof value) === 'number'
};

module.exports = {
    postSpotSchema: postSpotSchema,
    putSpotSchema: putSpotSchema,
    postOrderSchema: postOrderSchema,
    patchSpotBasketSchema: patchSpotBasketSchema,
    patchSpotPurchaseSchema: patchSpotPurchaseSchema,
    patchSpotBasketRemoveSchema: patchSpotBasketRemoveSchema
}