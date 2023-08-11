const DateTime = luxon.DateTime
let fecha = document.getElementById("fecha")



let perfumesDiv = document.getElementById("perfumes")
let verCatalogo = document.getElementById("verCatalogo")
let ocultarCatalogo = document.getElementById("ocultarCatalogo")
let selectOrden = document.getElementById("selectOrden")
let buscador = document.getElementById("buscador")
let coincidencia = document.getElementById("coincidencia")
let modalBodyCarrito = document.getElementById("modal-bodyCarrito")
let botonCarrito = document.getElementById("botonCarrito")
let precioTotal = document.getElementById("precioTotal")



let productosEnCarrito;
 if (localStorage.getItem("carrito")) {
    productosEnCarrito = JSON.parse(localStorage.getItem("carrito"));
} else {
    productosEnCarrito = [];
    localStorage.setItem("carrito", JSON.stringify(productosEnCarrito));
}



function mostrarCatalogo(array){
   perfumesDiv.innerHTML = ``
    for(let perfume of array ){

      let nuevoPerfumeDiv = document.createElement("div")
      nuevoPerfumeDiv.className = "col-12 col-md-6 col-lg-4 my-2"
      nuevoPerfumeDiv.innerHTML = `<div id="${perfume.id}" class="card" style="width: 18rem;">
                                 <img class="card-img-top img-fluid" style="height: 200px;"src="assets/${perfume.imagen}" alt="${perfume.nombre} de ${perfume.creador}">
                                 <div class="card-body">
                                    <h4 class="card-title">${perfume.nombre}</h4>
                                    <p>De: ${perfume.creador}</p>
                                    <p class="${perfume.precio}">Precio:${perfume.precio}</p>
                                 <button id="agregarBtn${perfume.id}" class="btn">Agregar al carrito</button>
                                 </div>
                              </div>`
      perfumesDiv.appendChild(nuevoPerfumeDiv)

   let agregarBtn = document.getElementById(`agregarBtn${perfume.id}`)
        agregarBtn.addEventListener("click", () => {
         agregarAlCarrito(perfume)
      })
   }
}



function agregarAlCarrito(perfume){
   let perfumeAgregado = productosEnCarrito.find((elem)=>elem.id == perfume.id) 

     if(perfumeAgregado == undefined){
      productosEnCarrito.push(perfume)
      localStorage.setItem("carrito", JSON.stringify(productosEnCarrito))
      console.log(productosEnCarrito)

       Swal.fire({
         title: `Ha agregado un producto al carrito`,
         text:`El perfume ${perfume.nombre} de ${perfume.creador} ha sido agregado`,
         confirmButtonColor: "violet",
         imageUrl: `assets/${perfume.imagen}`,
         imageHeight: 200
      })

   }else{

      Swal.fire({
         title: `El producto ya se encuentra en el carrito`,
         timer: 2001,
         showConfirmButton: false

      })
   }
}



function cargarProductosCarrito(array){
   modalBodyCarrito.innerHTML = ``
   array.forEach((productoCarrito)=>{
      modalBodyCarrito.innerHTML += `
        <div class="card border-primary mb-3" id ="productoCarrito${productoCarrito.id}" style="max-width: 540px;">
                 <img class="card-img-top" height="300px" src="assets/${productoCarrito.imagen}" alt="">
                 <div class="card-body">
                        <h4 class="card-title">${productoCarrito.nombre}</h4>
                        <p class="card-text">${productoCarrito.creador}</p>
                        <p class="card-text">Precio unitario $${productoCarrito.precio}</p>
                        <button class= "btn btn-danger" id="botonEliminar${productoCarrito.id}"><i class="fas fa-trash-alt"></i></button>
                 </div>    
            </div>
      
   `
   })

   array.forEach((productoCarrito) => {
      document.getElementById(`botonEliminar${productoCarrito.id}`).addEventListener("click", () => {
         console.log(`Eliminar producto`)
         let cardProducto = document.getElementById(`productoCarrito${productoCarrito.id}`)
         cardProducto.remove()
         let productoEliminar = array.find((perfume) => perfume.id == productoCarrito.id)
         console.log(productoEliminar)
         let posicion = array.indexOf(productoEliminar)
         console.log(posicion)
         array.splice(posicion,1)
         console.log(array)
         localStorage.setItem("carrito", JSON.stringify(array))
   
         calcularTotal(array)
      })
   })

   calcularTotal(array)
}



function calcularTotal(array){
   let total = array.reduce((acc, productoCarrito)=> acc + productoCarrito.precio , 0)
   total == 0 ? precioTotal.innerHTML= `No hay productos en el carrito` : precioTotal.innerHTML = `El total es <strong>${total}</strong>`
   return total
}



function ordenarMenorMayor(array){
   const menorMayor = [].concat(array)
   console.log(menorMayor)
   menorMayor.sort((a,b) => a.precio - b.precio)
   mostrarCatalogo(menorMayor)
 }
 


function ordenarMayorMenor(array){
   const mayorMenor = [].concat(array)
   mayorMenor.sort((elem1 ,elem2) => elem2.precio - elem1.precio)
   mostrarCatalogo(mayorMenor)
 }

 

function ordenarAlfabeticamenteNombre(array){
   const arrayAlfabetico = [].concat(array)
    arrayAlfabetico.sort( (a,b) =>{
      if (a.nombre > b.nombre) {
         return 1
      }
      if (a.nombre < b.nombre) {
     
         return -1
      }
     
       return 0
   })
 
   mostrarCatalogo(arrayAlfabetico)
 }


 
function buscarInfo(buscado, array){
   let busqueda = array.filter(
      (dato) => dato.creador.toLowerCase().includes(buscado.toLowerCase())  || dato.nombre.toLowerCase().includes(buscado.toLowerCase()) 
   )

   busqueda.length == 0 ? 
   (coincidencia.innerHTML = `<h3>No hay coincidencias con la búsqueda ${buscado}</h3>`,
   mostrarCatalogo(busqueda)) :
   (coincidencia.innerHTML = "", mostrarCatalogo(busqueda)) 
 }

  verCatalogo.addEventListener("click", ()=>{
   mostrarCatalogo(productos)
})

  ocultarCatalogo.onclick = () => {
   perfumesDiv.innerHTML = ""
}



function finalizarCompra(array){
   Swal.fire({
      title: 'Desea confirmar su compra?',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      confirmButtonColor: 'violet',
      cancelButtonColor: 'grey',
  }).then((result) => {
      if(result.isConfirmed){
         let ventaHora = DateTime.now().toLocaleString(DateTime.TIME_24_WITH_SECONDS)
         let ventaDia = DateTime.now().toLocaleString(DateTime.DATE_FULL)
         let totalFinal = calcularTotal(array)
        Swal.fire({
            title: 'Compra realizada',
            icon: 'success',
            confirmButtonColor: 'violet',
            text: `Tu compra realizada el día ${ventaDia} a las ${ventaHora} horas fue un éxito. `,
            })
         productosEnCarrito = []
          localStorage.removeItem("carrito")

      }else{

         Swal.fire({
            title: 'Compra no realizada',
            text: ``,
            confirmButtonColor: 'violet',
            timer:3500
        })
      }
  } )
} 



 selectOrden.addEventListener("change", () => {
   console.log(selectOrden.value)
    switch(selectOrden.value){
      case "1":
         ordenarMayorMenor(productos)
      break
      case "2":
         ordenarMenorMayor(productos)
      break
      case "3":
         ordenarAlfabeticamenteNombre(productos)
      break
      default:
         mostrarCatalogo(productos)
      break
   }
})

 buscador.addEventListener("input", () => {
   buscarInfo(buscador.value, productos)
})

 botonCarrito.addEventListener("click", () => {
   cargarProductosCarrito(productosEnCarrito)
})

 botonFinalizarCompra.addEventListener("click", () =>{
   finalizarCompra(productosEnCarrito)
})

const registrarmeInputButton = document.getElementById('registrarmeInputButton');

  registrarmeInputButton.addEventListener('click', () => {
    Swal.fire({
        title: 'Ingrese su nombre',
        input: 'text',
        inputPlaceholder: 'Escribe tu nombre aquí...',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonColor: '#996ab8',
        cancelButtonColor: '#848888',
        confirmButtonText: 'Siguiente',
        cancelButtonText: 'Cancelar'
    }).then((resultadoNombre) => {
        if (!resultadoNombre.isConfirmed) {
            return;
        }

     const ingresoNombre = resultadoNombre.value;

        Swal.fire({
            title: 'Ingrese su correo electrónico',
            input: 'email',
            inputPlaceholder: 'Escribe tu correo electrónico aquí...',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonColor: '#996ab8',
            cancelButtonColor: '#848888',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar'
        }).then((emailRegistrado) => {
            if (emailRegistrado.isConfirmed) {
                 const suEmail = emailRegistrado.value;
                 Swal.fire({
                   title: `¡Hola, ${ingresoNombre}!`,
                   text: `Tu correo electrónico ${suEmail} ha sido registrado`,
                    icon: 'success',
                   confirmButtonColor: '#996ab8'});
             }
         });
      });
   });



