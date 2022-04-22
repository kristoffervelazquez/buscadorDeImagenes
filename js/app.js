const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registrosPorPagina = 30;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e) {
    e.preventDefault();
    const terminoBusqueda = document.querySelector('#termino').value;

    if (terminoBusqueda === '') {
        mostrarAlerta('Agrega un termino de busqueda');
        return;
    }

    buscarImagenes();

}


function mostrarAlerta(mensaje) {

    const existeAlerta = document.querySelector('.bg-red-100')

    if (!existeAlerta) {
        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-100', 'border-red-400', 'px-4', 'text-red-700', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
        alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">${mensaje}</span>
        `
        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }

}

async function buscarImagenes() {
    const terminoBusqueda = document.querySelector('#termino').value;

    const key = '26789757-66badd75c78069a5bd8638fe1';
    const url = `https://pixabay.com/api/?key=${key}&q=${terminoBusqueda}&image_type=photo&per_page=${registrosPorPagina}&page=${paginaActual}`;
    
    try {
        cargarSpinner();
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        totalPaginas = calcularPaginas(resultado.totalHits);
        mostrarImagenes(resultado.hits);
    } catch (error) {
        console.log(error);

    }
}

// Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function* crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registrosPorPagina))
}

function mostrarImagenes(imagenes) {

    limpiarHTML();
    // Iterar sobre el resultado de imagenes
    imagenes.forEach((imagen) => {
        const { webformatURL, likes, views, largeImageURL } = imagen;

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${webformatURL}">
                    <div class="p-4">
                        <p class="font-bold"> ${likes} <span class="font-light"> Me gusta</span></p>
                        <p class="font-bold"> ${views} <span class="font-light"> Vistas</span></p>
                        <a 
                            class="block w-full bg-blue-800 hoover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                            href="${largeImageURL}" target="_blank" rel="noopener noreferrer"> Ver imagen 
                        </a>
                    </div>
                </div>

            </div>
            
        `;
    });

    imprmirPaginador();

}

function imprmirPaginador() {
    iterador = crearPaginador(totalPaginas);

    while (totalPaginas > 0) {
        const { value, done } = iterador.next();
        if (done) return;
        // Caso contrario, genera un boton por cada elemento en el generador
        const boton = document.createElement("a");
        boton.href = '#'
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded');

        boton.onclick = () => {
            paginaActual = value;
            buscarImagenes();
        }
        paginacionDiv.appendChild(boton);
    }
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
    while (paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild);

    }
}

function cargarSpinner() {
    limpiarHTML();
    const spinner = document.createElement('div');
    spinner.classList.add('sk-chase');
    spinner.innerHTML = `    
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
    
    `

    resultado.appendChild(spinner);

}