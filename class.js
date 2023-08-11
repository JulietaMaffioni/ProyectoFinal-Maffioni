 class Perfume{
    constructor(id, creador, nombre, precio, imagen){
       this.id = id,
       this.creador = creador,
       this.nombre = nombre,
       this.precio = precio,
       this.imagen = imagen
 
    }

    mostrarInfoProducto(){
       console.log(`El perfume ${this.nombre} es de ${this.creador} y su precio es ${this.precio} pesos`)
    }
 }
 
 

 const cargarProductos = async () =>{
    const res = await fetch("productos.json")
    const data = await res.json()


     for(let perfume of data){
         let perfumeData = new Perfume(perfume.id, perfume.creador, perfume.nombre, perfume.precio, perfume.imagen)
         productos.push(perfumeData)
     }
     localStorage.setItem("productos", JSON.stringify(productos))
 }
 

 let productos = [] 
 
 if(localStorage.getItem("productos")){

    productos = JSON.parse(localStorage.getItem("productos"))
  }else{
    cargarProductos()
 }

