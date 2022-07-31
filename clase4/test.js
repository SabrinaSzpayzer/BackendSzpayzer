const Contenedor = require ('./desafio4');

async function main () {
    const product = new Contenedor ('./productos.txt')

    await product.save("Lápiz", 45, "https://www.freepik.es/vector-gratis/diseno-lapiz-escribiendo_850418.htm#query=lapiz&position=0&from_view=keyword")
    await product.save("Goma de borrar", 20, "https://www.pexels.com/es-es/foto/borrador-pelikan-br-40-rojo-y-azul-sobre-superficie-blanca-35202/")

    const allProducts = await product.getAll()
    console.log("Get de Todos los productos:")
    console.log(allProducts)

    const productById = await product.getById(1)
    console.log("Get de Producto con id " + productById.id )
    console.log(productById)

    await product.deleteById(2)

    await product.deleteAll()

}

main();