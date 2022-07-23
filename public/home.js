window.onload = () => {

    let infoLibros = document.querySelector('.info-Libros');
    let titulosSeleccionado = document.querySelectorAll('.titulo-seleccionado');

    let todosLosLibros = [];

    fetch('https://localhost:44317/api/Libros').then(result => result.json())
        .then(listLibros => {
            todosLosLibros = listLibros;
            let disponibilidad;
            let botonAdquirir;
            for (let i = 0; i < listLibros.length; i++) {
                // LISTA DE LIBROS
                if (listLibros[i].disponibilidad) {
                    botonAdquirir = `<td>
                <div class="botonPedir btn btn-secondary" data-bs-toggle="modal"
                data-bs-target="#modal2">
                    <i class="fa-solid fa-circle-plus"></i>
                </div>
            </td>`
                    disponibilidad = 'Disponible'
                } else {
                    botonAdquirir = `<td></td>`
                    disponibilidad = 'No Disponible'
                }

                infoLibros.innerHTML += `<tr>
            <th scope="row">${listLibros[i].id}</th>
            <td>${listLibros[i].titulo}</td>
            <td>${disponibilidad}</td>
            <td>
                <div class="botonBusqueda btn btn-secondary" data-bs-toggle="modal"
                data-bs-target="#modal1">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>
            </td>
            ${botonAdquirir}
            </tr>`
                // titutloSeleccionado.innerHTML += `<strong>${listLibros[i].titulo}</strong><br><span>${disponibilidad}</span>`
            }

            // BOTONES
            let infoPedidos = document.querySelector('.info-pedidos');

            let botonBusqueda = document.querySelectorAll('.botonBusqueda');
            let botonPerdir = document.querySelectorAll('.botonPedir');

            let botonPedirLibro = document.querySelector('.pedirLibro');
            let botonEntregar = document.querySelector('.botonEntregar');

            // INPUTS
            let inputCedula = document.querySelector('.inputCedula');

            // EVENTOS DE LOS BOTONES 
            let idPrestamoLibro;
            for (let i = 0; i < botonBusqueda.length; i++) {
                botonBusqueda[i].addEventListener('click', () => {
                    titulosSeleccionado[0].innerHTML = `<strong>${todosLosLibros[i].titulo}</strong><br><span>${todosLosLibros[i].disponibilidad ? 'Disponible' : 'No disponible'}</span>`;
                    fetch(`https://localhost:44317/api/Prestamos?idLibro=${todosLosLibros[i].id}`).then(result => result.json())
                        .then(pedido => {
                            idPrestamoLibro = pedido.id;
                            // Asignando valores inputs
                            if (pedido.id === 0) {
                                infoPedidos.innerHTML = '<p>No hay registros</p>'
                            } else {
                                infoPedidos.innerHTML = `<ul>
                                <li>
                                    <p><strong>${pedido.idLibroNavigation.disponibilidad ? 'Fecha de entrega: ' : 'Fecha de préstamo: '}</strong>${pedido.idLibroNavigation.disponibilidad ? pedido.fechaEntrega.split('T')[0] : pedido.fechaPrestamo.split('T')[0]}</p>
                                </li>
                                <li>
                                    <p><strong>Prestamo a: </strong>${pedido.idEstudianteNavigation.nombre}</p>
                                </li>
                                <li>
                                    <p><strong>Cedula: </strong>${pedido.idEstudianteNavigation.cedula}</p>
                                </li>
                                <li>
                                    <p><strong>Correo: </strong>${pedido.idEstudianteNavigation.correo}</p>
                                </li>
                                <li>
                                    <p><strong>Celular: </strong>${pedido.idEstudianteNavigation.celular}</p>
                                </li>
                            </ul>`
                            }
                            if (pedido.idLibroNavigation.disponibilidad == true) {
                                botonEntregar.setAttribute('hidden', '')
                            }else{
                                botonEntregar.removeAttribute('hidden')
                            }

                        
                        })
                })
            }

            // Filtrar libros disponibles
            let filtarLibros = todosLosLibros.filter(libro =>{
                return libro.disponibilidad == true;
            })
            let libroId;
            for (let i = 0; i < botonPerdir.length; i++) {
                botonPerdir[i].addEventListener('click', ()=>{
                    libroId = filtarLibros[i].id;
                    titulosSeleccionado[1].innerHTML = `<strong>${filtarLibros[i].titulo}</strong><br><span>${filtarLibros[i].disponibilidad ? 'Disponible' : 'No disponible'}</span>`;
                })
            }

            let error = document.querySelector('.error');
            let contador = 0
            // GENERAR POST SOLICITAR LIBRO
            inputCedula.addEventListener('change', (e)=>{
                    
                botonPedirLibro.addEventListener('click', ()=>{
                    console.log('Soy este ', inputCedula.value);
                    fetch('https://localhost:44317/api/Prestamos/SolicitarPrestamoLibro', {
                    method: 'POST',
                    body: JSON.stringify({
                        idEstudiante: inputCedula.value,
                        idLibro: libroId
                    }),
                    headers:{
                        'Content-Type': 'application/json'
                    }
                }).then(result => result.json()).then(result=>{
                    if(result){
                        error.style.color = 'grey';
                        window.location.href = 'http://localhost:3030/';
                    }else{
                            error.style.color = 'red';
                            error.innerHTML = 'El estudiande no se encontro en los registros'
                    }
                })
                .catch(error => console.error('Error:', error))

                })
            })

            // GENERAR POST DEVOLVER LIBRO
            botonEntregar.addEventListener('click', (e)=>{
                    fetch(`https://localhost:44317/api/Prestamos/DevolverPrestamoLibro?idPrestamo=${idPrestamoLibro}`, 
                    {
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    }
                }).then(result => result.json()).then(result=>{
                    if(result){
                        window.location.href = 'http://localhost:3030/'
                    }else{
                        error.innerHTML = 'Se presento un error intentelo de nuevo'
                    }
                })
                .catch(error => console.error('Error:', error))
            })

        })

}

