import { firebaseConfig } from "./variables.js";

// let script = document.createElement("script");
// script.setAttribute("src","https://www.gstatic.com/firebasejs/6.3.0/firebase-app.js");
// document.querySelector("body").prepend(script);

window.onload = () => {

    // Iniciando la configuración de firebase con nuestra aplicación
    firebase.initializeApp(firebaseConfig);

    if (location.href.indexOf("index") >= 0) {
        // estamos en index.html
        $.notify("estamos en index.html", "info");

    }
    if (location.href.indexOf("platos") >= 0) {
        // estamos en platos.html
        $.notify("estamos en platos.html", "info");

        // Creando una referencia inicial al nodo "platos"
        let refPlatos = firebase.database().ref("platos");

        // Creando una referencia inicial al STORAGE
        let refStorage = firebase.storage();

        // evento onchange para el slider
        let slider = document.getElementById("inputCalorias");
        slider.oninput = () => {
            $("#sliderCantidad").html(slider.value);
        }


        /**
         * Funcion que recibe los datos del objeto de tipo Plato 
         * Y setea los valores de los inputs del modal
         */
        let actualizarModal = ({ key, nombre, descripcion, origen, calorias }) => {
            $("#inputNombre").val(nombre);
            $("#inputDescripcion").val(descripcion);
            $("#inputOrigen").val(origen);
            $("#inputCalorias").val(calorias);
            $("#sliderCantidad").html(calorias);

            $("#btnGuardarPlato").html("Actualizar Plato");
            // off() desvincula todos los listeners que tenia el boton
            // previamente configurados
            $("#btnGuardarPlato").off();
            $("#btnGuardarPlato").click(() => {
                createPlato(key);
            });


        }

        /**
         * Funcion que sube una imagen al storage
         */
        let subirFoto = key => {
            // SUBIENDO UNA IMAGEN AL STORAGE LUEGO DE CREAR
            // EL REGISTRO EN DATABASE
            /**
             * 1. obtener el File o archivo del input para subir
             * archivos
             */
            let foto = document.getElementById("inputFoto").files[0];
            /**
             * 2. obtener la referencia al STORAGE
             * A continuación hacemos referencia a una carpeta
             * denominada "platos", si la carpeta no existe,
             * será creada automáticamente
             */
            let refStoragePlatos = refStorage.ref().child("platos");
            /**
             * 3. Obtener el nombre del archivo
             * EJM> mi_foto.jpg
             */
            let nombre = foto.name;
            /**
             * 4. Generar un nuevo nombre que no pueda repetirse
             * para el nombre del archivo a subir
             */
            let nombreFinal = key + "-" + nombre;
            /**
             * 5. Crear la metadata indicando el tipo de archivo
             * que se envia al servidor
             */
            let metadata = {
                contentType: foto.type
            };
            /**
             * 6. Subir el archivo a la referencia con el nuevo nombre
             * a través de la función "put()"
             */
            refStoragePlatos.child(nombreFinal)
                .put(foto, metadata)
                .then(respuesta => {
                    // repuesta => informacion de la subida
                    // del archivo
                    // ref.getDownloadURL() => funcion que devuelve una
                    // promesa con la URL del archivo subido
                    return respuesta.ref.getDownloadURL();
                })
                .then(url => {
                    console.log(url);
                    // COn la URL recibida, se debe actualizar el registro
                    // del plato en la base de datos para agregar el campo
                    // url.
                    /**
                     * 1. Crear la referencia al nodo a actualizar
                     */
                    let refPlatoCreado = refPlatos.child(key);
                    /**
                     * 2. Usar la funcion update() para enviar el nuevo campo
                     * con la URL de la imagen recientemente creada
                     */
                    return refPlatoCreado.update({ imagen: url });
                })
                .then(() => {
                    // El registro de la base de datos ha sido actualizado 
                    // con el campo de la imagen correctamente. =)
                    
                    $.notify("Plato creado correctamente", "success");
                    $("#modalCrearPlato").modal("hide");
                    // reseteando el formulario luego de crear el registro
                    $("#formCrearPlato").trigger("reset");
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        /**
         * Funcion para crear un registro en la DB de firebase
         */
        let createPlato = (key) => {
            if (key) {
                // actualizar
                /**
                 * Funcion que actualiza un registro en firebase
                 * @param {*} key el id del nodo a actualizar
                 */
                /**
                 * 1. Crear la referencia al nodo con la llave indicada
                 */
                let refKey = refPlatos.child(key);
                refKey.update({
                    nombre: $("#inputNombre").val().trim(),
                    descripcion: $("#inputDescripcion").val().trim(),
                    calorias: $("#inputCalorias").val(),
                    origen: $("#inputOrigen").val().trim(),
                }, () => {

                    $.notify("El registro fue atualizado correctamente", "success");

                })
            } else {
                // crear
                /**
                 * 1. obtener una nueva clave o primary para el 
                 * registro que se va a insertar
                 */
                let key = refPlatos.push().key;
                /**
                 * 2. Referenciar al nodo que lleva por nombre
                 * la clave generada en el paso 1
                 */
                let referenciaKey = refPlatos.child(key);
                /**
                 * 3. Asignar atributos al nodo referenciado en 
                 * el paso [2] a partir del metodo "set()"
                 */
                referenciaKey.set({
                    nombre: $("#inputNombre").val().trim(),
                    calorias: $("#inputCalorias").val(),
                    origen: $("#inputOrigen").val(),
                    descripcion: $("#inputDescripcion").val()
                }).then(() => {

                    subirFoto(key);

                }).catch(error => {
                    $.notify("Error al crear el plato", "danger");
                    console.log(error);
                });
            }
        }
        /**
         * Funcion para eliminar un registro de la DB de firebase
         */
        let deletePlato = (key) => {
            /**
             * 1. Crear la referencia al nodo a eliminar
             */
            let refKey = refPlatos.child(key);
            // let refKey = firebase.database().ref("platos").child(key);
            // let refKey = firebase.database().ref(`platos/${key}`);
            refKey.remove()
                .then(() => {
                    $.notify("El elemento, se ha eliminado correctamente", "success")
                })
                .catch(error => {
                    $.notify("Ups! ocurrió un error", "danger");
                    console.log(error);
                });
        }
        /**
         * Funcion que recibe un snapshot de el nodo platos 
         * de Firebase para dibujarlos en el DOM en forma de Cards
         * @param {*} dataSnapshot 
         */
        let renderizarPlatos = (dataSnapshot) => {
            /**
             * 1. limpiar el conteneder de cards (main)
             */
            $("main").html("");
            /**
             * 2. crear una variable string que guardara
             * la estructura del contenido de main (cards)
             */

            let cardColumns = $(`<div class="card-columns"></div>`);

            dataSnapshot.forEach(plato => {
                let card = $(`<div class="card"></div`);
                let cardHeader = $(`<div class="card-header text-right"></div>`);
                let botonEliminar = $(`<button class="btn btn-danger" data-toggle="tooltip" data-placement="top" title="Eliminarsh">
                                            <i class="fa fa-trash"></i>
                                       </button>`);
                botonEliminar.tooltip({});

                let botonEditar = $(`<button class="btn btn-warning" data-toggle="tooltip" data-placement="top" title="Editarsh">
                                        <i class="fa fa-pen"></i>
                                    </button>`);

                let cardBody = $(`<div class="card-body"></div>`);
                let cardTitle = $(`<h5 class="card-title"></h5>`);
                let parrafo = $(`<p class="card-text"></p>`);

                parrafo.html(plato.val().descripcion);
                cardTitle.html(plato.val().nombre);

                cardHeader.append(botonEliminar);
                cardHeader.append(botonEditar);
                card.append(cardHeader);

                cardBody.append(cardTitle);
                cardBody.append(parrafo);

                card.append(cardBody);

                cardColumns.append(card);

                botonEliminar.click((e) => {
                    deletePlato(plato.key);
                });

                botonEditar.click((e) => {
                    $("#modalCrearPlato").modal('show');
                    let objPlato = {
                        key: plato.key,
                        nombre: plato.val().nombre,
                        descripcion: plato.val().descripcion,
                        calorias: plato.val().calorias,
                        origen: plato.val().origen,
                    };
                    actualizarModal(objPlato);
                });

            });

            $("main").append(cardColumns);
        }
        /**
         * Funcion que trae todos los platos de la base de datos de Firebase
         */
        let getPlatos = () => {
            $("main").html(`<div class="text-center">
                                <div class="spinner-border" role="status">
                                <span class="sr-only">Loading...</span>
                                </div>
                            </div>`);
            // Inicializar la base de datos en tiempo real
            // creando una referencia al nodo principal
            // database() => funcion disponible con el script de database firebase
            refPlatos.on("value", dataSnapshot => {
                // FORMA 1 PARA CONSUMIR LOS DATOS de dataSnapshot
                // let data = dataSnapshot.val();
                // for (const clave in data) {
                //     console.log(clave);
                //     console.log(data[clave].calorias);
                //     console.log(data[clave].origen);
                // }
                // FORMA 2 PARA CONSUMIR LOS DATOS de dataSnapshot
                // dataSnapshot.forEach(plato => {
                //     console.log(plato.key);
                //     console.log(plato.val().calorias);
                //     console.log(plato.val().origen);
                // });
                renderizarPlatos(dataSnapshot);
            });

        }

        // configurando click al boton de agregar plato
        // para aparecer modal
        $("#btnCrearPlato").click(() => {
            // desvincular todos los listeners anteriores
            $("#btnGuardarPlato").off();
            $("#btnGuardarPlato").html("Crear Plato");
            $("#btnGuardarPlato").click(() => {
                createPlato();
            });

            $("#formCrearPlato").trigger("reset");
            $("#modalCrearPlato").modal("show");

        });

        // asignando evento click al boton para crear un registro en firebase
        $("#btnGuardarPlato").click(() => {
            createPlato();
        });

        getPlatos();

    }

}









