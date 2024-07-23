const errorMessages = {
    FEW_PARAMETERS:{code:0,status:400,message:'Faltan parametros obligatorios o se enviaron vacios'},
    MISSING_FIELD: { code: 1, status: 400, message: 'El campo "{field}" es obligatorio.' },
    INVALID_TYPE: { code: 2, status: 400, message: 'El campo "{field}" debe ser de tipo "{type}".' },
    PRODUCT_NOT_FOUND: { code: 3, status: 404, message: 'Producto con ID "{id}" no encontrado.' },
    CART_ITEM_NOT_FOUND: { code: 4, status: 404, message: 'Artículo del carrito con ID "{id}" no encontrado.' },
};

export default errorMessages;