class ProductDTO {
    constructor(info){
        this.title = info.title
        this.description = info.description
        this.category = info.category
        this.price = info.price
        this.code = info.code
        this.stock = info.stock
        this.thumbnail = info.thumbnail
    }
}

module.exports = ProductDTO