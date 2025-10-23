function cambiarPestaña(i){
			const tabs = document.querySelectorAll('.tab-content');
    			const buttons = document.querySelectorAll('.tab-button');
    
    			// Quitar clase 'active' de todas las pestañas y botones
    			tabs.forEach(tab => tab.classList.remove('active'));
    			buttons.forEach(btn => btn.classList.remove('active'));
    
   			// Activar la pestaña y botón seleccionados
    			document.getElementById('tab' + i).classList.add('active');
    			buttons[i].classList.add('active');
		}	
		
		const maquinaTuring = {
			estados: [],
			estadoInicial: "",
			estadosAceptacion: [],
			alfabetoEntrada: [],
			alfabetoCinta: [],
			simboloBlanco: "B",
			transiciones: {},
			cinta: [],
			cabeza: 0,
			estadoActual: "",
			ejecutando: false,
			historial: []
		};

		// Guardar configuración básica
	        function guardarConfiguracion() {
 	           const estados = document.getElementById('estados').value.split(',').map(e => e.trim());
        	    const estadoInicial = document.getElementById('estadoInicial').value.trim();
  	          const estadosAceptacion = document.getElementById('estadosAceptacion').value.split(',').map(e => e.trim());
	            const alfabetoEntrada = document.getElementById('alfabetoEntrada').value.split(',').map(e => e.trim());
   	         const alfabetoCinta = document.getElementById('alfabetoCinta').value.split(',').map(e => e.trim());
        	    const simboloBlanco = document.getElementById('simboloBlanco').value.trim();
            
 	           // Validaciones básicas
        	    if (estados.length === 0 || estadoInicial === "" || estadosAceptacion.length === 0 || 
        	        alfabetoEntrada.length === 0 || alfabetoCinta.length === 0 || simboloBlanco === "") {
 	               alert("Por favor, complete todos los campos de configuración.");
                	return;
            		}
            
            	if (!estados.includes(estadoInicial)) {
                	alert("El estado inicial debe estar en la lista de estados.");
               		return;
            	}
            
            	for (let estado of estadosAceptacion) {
                	if (!estados.includes(estado)) {
                    	alert("Los estados de aceptación deben estar en la lista de estados.");
                    	return;
                	}
            	}
            
            	for (let simbolo of alfabetoEntrada) {
                	if (!alfabetoCinta.includes(simbolo)) {
                    	alert("El alfabeto de entrada debe ser un subconjunto del alfabeto de cinta.");
                    	return;
                	}
            	}
            
            	if (!alfabetoCinta.includes(simboloBlanco)) {
                	alert("El símbolo blanco debe estar en el alfabeto de cinta.");
                	return;
            	}
            
            	// Guardar configuración
            	maquinaTuring.estados = estados;
            	maquinaTuring.estadoInicial = estadoInicial;
            	maquinaTuring.estadosAceptacion = estadosAceptacion;
            	maquinaTuring.alfabetoEntrada = alfabetoEntrada;
            	maquinaTuring.alfabetoCinta = alfabetoCinta;
            	maquinaTuring.simboloBlanco = simboloBlanco;
            
            	alert("Configuración guardada correctamente.");
            	cambiarPestaña(1); // Cambiar a pestaña de transiciones
        	}

		// Agregar una transición
        function agregarTransicion() {
            const estado = document.getElementById('transEstado').value.trim();
            const leer = document.getElementById('transLeer').value.trim();
            const nuevoEstado = document.getElementById('transNuevoEstado').value.trim();
            const escribir = document.getElementById('transEscribir').value.trim();
            const direccion = document.getElementById('transDireccion').value;
            
            // Validaciones
            if (estado === "" || leer === "" || nuevoEstado === "" || escribir === "" || direccion === "") {
                alert("Por favor, complete todos los campos de la transición.");
                return;
            }
            
            if (!maquinaTuring.estados.includes(estado)) {
                alert("El estado actual no está en la lista de estados.");
                return;
            }
            
            if (!maquinaTuring.estados.includes(nuevoEstado)) {
                alert("El nuevo estado no está en la lista de estados.");
                return;
            }
            
            if (!maquinaTuring.alfabetoCinta.includes(leer)) {
                alert("El símbolo a leer no está en el alfabeto de cinta.");
                return;
            }
            
            if (!maquinaTuring.alfabetoCinta.includes(escribir)) {
                alert("El símbolo a escribir no está en el alfabeto de cinta.");
                return;
            }
            
            // Agregar transición
            if (!maquinaTuring.transiciones[estado]) {
                maquinaTuring.transiciones[estado] = {};
            }
            
            maquinaTuring.transiciones[estado][leer] = {
                nuevoEstado: nuevoEstado,
                escribir: escribir,
                direccion: direccion
            };
            
            // Actualizar tabla
            const tabla = document.getElementById('tablaTransiciones').getElementsByTagName('tbody')[0];
            const nuevaFila = tabla.insertRow();
            
            nuevaFila.insertCell(0).textContent = estado;
            nuevaFila.insertCell(1).textContent = leer;
            nuevaFila.insertCell(2).textContent = nuevoEstado;
            nuevaFila.insertCell(3).textContent = escribir;
            nuevaFila.insertCell(4).textContent = direccion;
            
            const celdaAccion = nuevaFila.insertCell(5);
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = "Eliminar";
            btnEliminar.onclick = function() {
                eliminarTransicion(estado, leer);
                tabla.removeChild(nuevaFila);
            };
            celdaAccion.appendChild(btnEliminar);
            
            // Limpiar campos
            document.getElementById('transEstado').value = "";
            document.getElementById('transLeer').value = "";
            document.getElementById('transNuevoEstado').value = "";
            document.getElementById('transEscribir').value = "";
            document.getElementById('transDireccion').value = "L";
        }

	function eliminarTransicion(estado, leer) {
            if (maquinaTuring.transiciones[estado] && maquinaTuring.transiciones[estado][leer]) {
                delete maquinaTuring.transiciones[estado][leer];
                
                // Si no hay más transiciones para este estado, eliminar el estado
                if (Object.keys(maquinaTuring.transiciones[estado]).length === 0) {
                    delete maquinaTuring.transiciones[estado];
                }
            }
        }

	function iniciarSimulacion() {
            const cadenaEntrada = document.getElementById('cadenaEntrada').value;
            
            // Validar cadena de entrada
            for (let i = 0; i < cadenaEntrada.length; i++) {
                if (!maquinaTuring.alfabetoEntrada.includes(cadenaEntrada[i])) {
                    alert("La cadena contiene símbolos no válidos: " + cadenaEntrada[i]);
                    return;
                }
            }
            
            // Inicializar cinta
            maquinaTuring.cinta = cadenaEntrada.split('');
            maquinaTuring.cabeza = 0;
            maquinaTuring.estadoActual = maquinaTuring.estadoInicial;
            maquinaTuring.ejecutando = true;
            maquinaTuring.historial = [];
            
            // Habilitar/deshabilitar botones
            document.getElementById('btnPaso').disabled = false;
            document.getElementById('btnDetener').disabled = false;
            
            // Actualizar interfaz
            actualizarCinta();
            document.getElementById('estadoActual').textContent = "Estado: " + maquinaTuring.estadoActual;
            document.getElementById('estadoAceptacion').textContent = "";
            document.getElementById('estadoAceptacion').className = "status";
            
            // Agregar al historial
            agregarAlHistorial("Simulación iniciada. Estado: " + maquinaTuring.estadoActual);
        }

	function ejecutarPaso() {
            if (!maquinaTuring.ejecutando) return;
            
            const simboloActual = maquinaTuring.cinta[maquinaTuring.cabeza] || maquinaTuring.simboloBlanco;
            
            // Verificar si existe transición para el estado actual y símbolo leído
            if (!maquinaTuring.transiciones[maquinaTuring.estadoActual] || 
                !maquinaTuring.transiciones[maquinaTuring.estadoActual][simboloActual]) {
                
                maquinaTuring.ejecutando = false;
                const esAceptado = maquinaTuring.estadosAceptacion.includes(maquinaTuring.estadoActual);
                
                if (esAceptado) {
                    document.getElementById('estadoAceptacion').textContent = "CADENA ACEPTADA";
                    document.getElementById('estadoAceptacion').className = "status accepted";
                    agregarAlHistorial("Cadena aceptada. Estado final: " + maquinaTuring.estadoActual);
                } else {
                    document.getElementById('estadoAceptacion').textContent = "CADENA RECHAZADA";
                    document.getElementById('estadoAceptacion').className = "status rejected";
                    agregarAlHistorial("Cadena rechazada. No hay transición definida para (" + 
                                      maquinaTuring.estadoActual + ", " + simboloActual + ")");
                }
                
                document.getElementById('btnPaso').disabled = true;
                return;
            }
            
            // Obtener la transición
            const transicion = maquinaTuring.transiciones[maquinaTuring.estadoActual][simboloActual];
            
            // Ejecutar la transición
            // 1. Escribir en la cinta
            maquinaTuring.cinta[maquinaTuring.cabeza] = transicion.escribir;
            
            // 2. Mover la cabeza
            if (transicion.direccion === 'L') {
                maquinaTuring.cabeza--;
                if (maquinaTuring.cabeza < 0) {
                    maquinaTuring.cabeza = 0; // En una implementación real, se expandiría la cinta
                }
            } else if (transicion.direccion === 'R') {
                maquinaTuring.cabeza++;
                // En una implementación real, se expandiría la cinta si es necesario
            }
            // Para 'S' (permanecer), no se mueve la cabeza
            
            // 3. Cambiar estado
            const estadoAnterior = maquinaTuring.estadoActual;
            maquinaTuring.estadoActual = transicion.nuevoEstado;
            
            // Actualizar interfaz
            actualizarCinta();
            document.getElementById('estadoActual').textContent = "Estado: " + maquinaTuring.estadoActual;
            
            // Agregar al historial
            agregarAlHistorial("Transición: (" + estadoAnterior + ", " + simboloActual + ") → (" + 
                             transicion.nuevoEstado + ", " + transicion.escribir + ", " + transicion.direccion + ")");
            
            // Verificar si es estado de aceptación
            if (maquinaTuring.estadosAceptacion.includes(maquinaTuring.estadoActual)) {
                document.getElementById('estadoAceptacion').textContent = "CADENA ACEPTADA";
                document.getElementById('estadoAceptacion').className = "status accepted";
                maquinaTuring.ejecutando = false;
                document.getElementById('btnPaso').disabled = true;
                agregarAlHistorial("Cadena aceptada. Estado final: " + maquinaTuring.estadoActual);
            }
        }


	// Actualizar visualización de la cinta
        function actualizarCinta() {
            const cintaContainer = document.getElementById('cinta');
            cintaContainer.innerHTML = '';
            
            // Determinar rango de celdas a mostrar
            const inicio = Math.max(0, maquinaTuring.cabeza - 5);
            const fin = Math.max(maquinaTuring.cabeza + 6, maquinaTuring.cinta.length);
            
            for (let i = inicio; i < fin; i++) {
                const celda = document.createElement('div');
                celda.className = 'tape-cell';
                
                if (i === maquinaTuring.cabeza) {
                    celda.classList.add('active');
                }
                
                if (i < maquinaTuring.cinta.length) {
                    celda.textContent = maquinaTuring.cinta[i];
                } else {
                    celda.textContent = maquinaTuring.simboloBlanco;
                }
                
                cintaContainer.appendChild(celda);
            }
			}

			// Agregar entrada al historial
	        function agregarAlHistorial(mensaje) {
	            maquinaTuring.historial.push(mensaje);
	            const historialContainer = document.getElementById('historial');
	            
	            const item = document.createElement('div');
	            item.className = 'history-item';
	            item.textContent = mensaje;
	            
	            historialContainer.appendChild(item);
	            historialContainer.scrollTop = historialContainer.scrollHeight;
	        }

		// Detener simulación
        function detenerSimulacion() {
            maquinaTuring.ejecutando = false;
            document.getElementById('btnPaso').disabled = true;
            document.getElementById('btnDetener').disabled = true;
            agregarAlHistorial("Simulación detenida por el usuario.");
        }

        // Reiniciar simulación
        function reiniciarSimulacion() {
            iniciarSimulacion();
        }


// Guardar Máquina
function guardarMaquina() {
    // Verificamos que la máquina tenga datos cargados
    if (!maquinaTuring || maquinaTuring.estados.length === 0) {
        alert("No hay ninguna máquina configurada para guardar.");
        return;
    }

    // Creamos un objeto con toda la configuración importante
    const data = {
        alfabeto: maquinaTuring.alfabeto || [],
        estados: maquinaTuring.estados || [],
        estadoInicial: maquinaTuring.estadoInicial || "",
        estadoAceptacion: maquinaTuring.estadosAceptacion || "",
        transiciones: maquinaTuring.transiciones || []
    };

    // Convertimos a JSON
    const json = JSON.stringify(data, null, 4);

    // Creamos un Blob para descargarlo como archivo
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Creamos un enlace temporal para forzar la descarga
    const a = document.createElement("a");
    a.href = url;
    a.download = "maquina_turing.json";
    a.click();

    // Liberamos la URL
    URL.revokeObjectURL(url);

    agregarAlHistorial("Máquina guardada como 'maquina_turing.json'.");
}


//Cargar Máquina
function cargarMaquina() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);

                // Validar estructura básica
                if (!data.estados || !data.estadoInicial || !data.estadosAceptacion) {
                    alert("El archivo no contiene una máquina de Turing válida.");
                    return;
                }

                // Cargamos la información en la máquina actual
                maquinaTuring.alfabeto = data.alfabeto || [];
                maquinaTuring.estados = data.estados || [];
                maquinaTuring.estadoInicial = data.estadoInicial;
                maquinaTuring.estadoAceptacion = data.estadoAceptacion;
                maquinaTuring.transiciones = data.transiciones || [];

                //Mostrar datos en pantalla
                document.getElementById("estados").value = (maquinaTuring.estados || []).join(", ");
                document.getElementById("estadoInicial").value = maquinaTuring.estadoInicial || "";
                document.getElementById("estadosAceptacion").value = (maquinaTuring.estadosAceptacion || []).join(", ");
                document.getElementById("alfabetoEntrada").value = (maquinaTuring.alfabeto || []).join(", ");
                document.getElementById("alfabetoCinta").value = (maquinaTuring.alfabeto || []).join(", ");
                document.getElementById("simboloBlanco").value = "B";

                // Reiniciar la cinta y actualizar interfaz
                maquinaTuring.cinta = [];
                maquinaTuring.cabeza = 0;
                maquinaTuring.estadoActual = maquinaTuring.estadoInicial;
                maquinaTuring.ejecutando = false;
                maquinaTuring.historial = [];

                actualizarCinta();
                document.getElementById('estadoActual').textContent = "Estado: " + maquinaTuring.estadoActual;
                document.getElementById('estadoAceptacion').textContent = "";
                document.getElementById('estadoAceptacion').className = "status";

                document.getElementById('btnPaso').disabled = true;
                document.getElementById('btnDetener').disabled = true;

                agregarAlHistorial(`Máquina cargada correctamente desde '${file.name}'.`);
                alert("Máquina cargada correctamente");
            } catch (error) {
                console.error("Error al leer el archivo:", error);
                alert("Error al cargar la máquina. Verifica el archivo JSON.");
            }
        };
        reader.readAsText(file);
    };
    
    input.click(); // Abrimos el selector de archivos
}





//Funciones para limpiar campos en cada sección 
//Limpiar configuración
function limpiarConfiguracion() {
    const ids = ["estados", "estadoInicial", "estadosAceptacion", "alfabetoEntrada", "alfabetoCinta", "simboloBlanco"];

    ids.forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = "";
    });

    agregarAlHistorial("Campos de configuración limpiados.");
    alert("Campos de configuración limpiados");
}


//Limpiar Transiciones
function limpiarTransiciones() {
    const ids = ["transEstado", "transLeer", "transNuevoEstado", "transEscribir", "transDireccion"];
    
    ids.forEach(id => {
        const input = document.getElementById(id);
        if (input && input.tagName.toLowerCase() === "select") {
            input.selectedIndex = 0;
        } else if (input) {
            input.value = "";
        }
    });

    agregarAlHistorial("Campos de transiciones limpiados.");
    alert("Campos de transiciones limpiados");
}


//Limpiar Simulación
function limpiarSimulacion() {
    const inputCadena = document.getElementById("cadenaEntrada");
    if (inputCadena) inputCadena.value = "";

    // Limpiar cinta visual y datos de simulación
    if (maquinaTuring) {
        maquinaTuring.cinta = [];
        maquinaTuring.cabeza = 0;
        maquinaTuring.estadoActual = "";
        maquinaTuring.ejecutando = false;
        actualizarCinta();
    }

    // Restablecer texto de estado
    const estadoActual = document.getElementById("estadoActual");
    const estadoAceptacion = document.getElementById("estadoAceptacion");
    if (estadoActual) estadoActual.textContent = "No iniciado";
    if (estadoAceptacion) {
        estadoAceptacion.textContent = "";
        estadoAceptacion.className = "status";
    }

    // Desactivar botones de control
    document.getElementById("btnPaso").disabled = true;
    document.getElementById("btnDetener").disabled = true;

    agregarAlHistorial("Campos de simulación limpiados.");
    alert("Campos de simulación limpiados");
}
