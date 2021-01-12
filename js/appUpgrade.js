///////////////////////////////////////////////////
////////////////Variables//////////////////////////
///////////////////////////////////////////////////
const formulario = document.getElementById('profile');
const tabla = document.getElementById('profilesTable');
let numeroPerfiles = 0;

////////////////////////////////////////////////////
////////////////Event listeners/////////////////////
////////////////////////////////////////////////////
//Event para inicilizar los campos del modelo

cargarEventlisteners();

function cargarEventlisteners(){
    formulario.addEventListener('change', colocarPrecio);

    formulario.addEventListener('submit', crearPerfiles);

    document.addEventListener('DOMContentLoaded', cargarPrecioValoresLS);

    document.addEventListener('click', removerFilasPerfil);

}

///////////////////////////////////////////////////
////////////////Clases/////////////////////////////
///////////////////////////////////////////////////
class CostosProductos {
    constructor(region){this.region = region}
    crear(){
    const xhr = new XMLHttpRequest();

    switch(this.region){
        case '1':
            xhr.open('GET', 'costdata2.txt', true);
            break;
        case '2':
            xhr.open('GET', 'costdataLatam.txt', true);
            break;
    }

    xhr.onload = function() {
        if(this.status === 200){
            const costos = JSON.parse(this.responseText);

            costos.forEach(function(costo,index) {
                switch(costo.Family){
                    case 'Conduit':
                        borrarCosto('CtPathways');
                        break;
                    case 'PathWay':
                        borrarCosto('FPPathways');
                }
            });

            costos.forEach(function(costo,index) {
                switch(costo.Family){
                    case 'Conduit':
                        crearCosto('CtPathways',costos[index]);
                        break;
                    case 'PathWay':
                        crearCosto('FPPathways',costos[index]);
                        break;
                    case 'Cable':
                        crearCosto('CtFibercables',costos[index]);
                        break;
                    case 'Microcable':
                        crearCosto('FPFibercables',costos[index]);
                        break;
                    case 'Closers/terminals':
                        crearCosto('CtClosers',costos[index]);
                        crearCosto('FPClosers',costos[index]);
                        break;
                    case 'Pathway Installation':
                        crearCosto('CtPathwayinstallation',costos[index]);
                        crearCosto('FPPathwayinstallation',costos[index]);
                        break;
                    case 'Cable Installation':
                        crearCosto('CtCableinstallation',costos[index]);
                        break;
                    case 'MicroCable Installation':
                        crearCosto('FPCableinstallation',costos[index]);
                        break;
                }
            });

        }

    }

    xhr.send();
    }
}

///////////////////////////////////////////////////
////////////////Funciones//////////////////////////
///////////////////////////////////////////////////
function cargarPrecioValoresLS(){
    const regionValue = obtenerPerfilesLocalStorage('region'); //Uso la misma función de Perfil para leer el valor de region
    const costos = new CostosProductos(regionValue);
    costos.crear();

    leerPerfilesLocalStorage();
}

///////////////////Pendiente remover el LS de cada perfil que vaya borrando
function removerFilasPerfil(e){
    //e.preventDefault();  //si coloco esto, se bloquea el modeloBton.addEventlistener
        if(e.target && e.target.className === 'btn btn-danger btn_remove'){
            const botonrm = document.getElementById(e.target.id);
            console.log(e.target.parentElement.parentElement.parentElement.parentElement)
            botonrm.parentElement.parentElement.parentElement.parentElement.remove();
            idPerfil = e.target.id;
            borrarPerfilLocalStorage(idPerfil);
        }
}

function colocarPrecio(e){
    e.preventDefault(); 

    switch(e.target.id){
        case 'FPPathways':
            adicionarFilaPrecio(e.target,"FPPathwaysPrecio","Pathway - None");
            break;
        case 'CtPathways':
            adicionarFilaPrecio(e.target,"CtPathwaysPrecio","Conduit - None");
            break;
        case 'CtPathwayinstallation':
            adicionarFilaPrecio(e.target,"CtPathwayinstallationPrecio","NA");
            break; 
        case 'FPPathwayinstallation':
            adicionarFilaPrecio(e.target,"FPPathwayinstallationPrecio","NA");
            break;
        case 'CtFibercables':
            adicionarFilaPrecio(e.target,"CtFibercablesPrecio","NA");
            break;
        case 'FPFibercables':
            adicionarFilaPrecio(e.target,"FPFibercablesPrecio","NA");
            break;   
        case 'CtCableinstallation':
            adicionarFilaPrecio(e.target,"CtCableinstallationPrecio","Not Required");
            break; 
        case 'FPCableinstallation':
            adicionarFilaPrecio(e.target,"FPCableinstallationPrecio","Not Required");
            break;
        case 'CtClosers':
            adicionarFilaPrecio(e.target,"CtClosersDistance","NA");
            adicionarFilaPrecio(e.target,"CtClosersPrecio","NA");
            break; 
        case 'FPClosers':
            adicionarFilaPrecio(e.target,"FPClosersDistance","NA");
            adicionarFilaPrecio(e.target,"FPClosersPrecio","NA");
            break;
    }
}

function crearPerfiles(e){
    e.preventDefault();

    const CtPathways = document.querySelector('#CtPathways').value;
    const FPPathways = document.querySelector('#FPPathways').value;
    const CtNopathways = document.querySelector('#CtNopathways').value;
    const FPNopathways = document.querySelector('#FPNopathways').value;   
    const CtFibercables = document.querySelector('#CtFibercables').value;
    const FPFibercables = document.querySelector('#FPFibercables').value;
    const CtNocables = document.querySelector('#CtNocables').value;
    const FPNocables = document.querySelector('#FPNocables').value;
    const CtClosers = document.querySelector('#CtClosers').value;
    const FPClosers = document.querySelector('#FPClosers').value;
    const CtPathwayinstallation = document.querySelector('#CtPathwayinstallation').value;
    const FPPathwayinstallation = document.querySelector('#FPPathwayinstallation').value;
    const CtCableinstallation = document.querySelector('#CtCableinstallation').value;
    const FPCableinstallation = document.querySelector('#FPCableinstallation').value;

    let CtPathwaysPrecio,FPPathwaysPrecio,CtPathwayinstallationPrecio,FPPathwayinstallationPrecio,CtFibercablesPrecio,FPFibercablesPrecio,CtCableinstallationPrecio,FPCableinstallationPrecio,CtClosersDistance,FPClosersDistance,CtClosersPrecio,FPClosersPrecio;

    CtPathwaysPrecio = validarInputPrecio("CtPathways","CtPathwaysPrecio","Conduit - None");
    FPPathwaysPrecio = validarInputPrecio("FPPathways","FPPathwaysPrecio","Pathway - None");
    CtPathwayinstallationPrecio = validarInputPrecio("CtPathwayinstallation","CtPathwayinstallationPrecio","NA");
    FPPathwayinstallationPrecio = validarInputPrecio("FPPathwayinstallation","FPPathwayinstallationPrecio","NA");
    CtFibercablesPrecio = validarInputPrecio("CtFibercables","CtFibercablesPrecio","NA");
    FPFibercablesPrecio = validarInputPrecio("FPFibercables","FPFibercablesPrecio","NA");
    CtCableinstallationPrecio = validarInputPrecio("CtCableinstallation","CtCableinstallationPrecio","Not Required");
    FPCableinstallationPrecio = validarInputPrecio("FPCableinstallation","FPCableinstallationPrecio","Not Required");
    CtClosersDistance = validarInputPrecio("FPClosers","CtClosersDistance","NA");
    FPClosersDistance = validarInputPrecio("FPClosers","FPClosersDistance","NA");
    CtClosersPrecio = validarInputPrecio("CtClosers","CtClosersPrecio","NA");
    FPClosersPrecio = validarInputPrecio("FPClosers","FPClosersPrecio","NA");

    let errorValue;
    //if(CtNocables > CtNopathways) errorValue = "Number of cables cannot be greater than the number of ducts";
    if(CtPathwaysPrecio === '') errorValue = "Please enter conduit price";
    if(FPPathwaysPrecio === '') errorValue = "Please enter FuturePath price";
    if(CtPathwayinstallationPrecio === '') errorValue = "Please enter conduit installation price";
    if(FPPathwayinstallationPrecio === '') errorValue = "Please enter FuturePath installation price";
    if(CtFibercablesPrecio === '') errorValue = "Please enter conduit cable price";
    if(FPFibercablesPrecio === '') errorValue = "Please enter FuturePath cable price";
    if(CtCableinstallationPrecio === '') errorValue = "Please enter conduit cable installation price";
    if(FPCableinstallationPrecio === '') errorValue = "Please enter FuturePath cable installation price";
    if(CtClosersPrecio === '') errorValue = "Please enter conduit closure/terminal price";
    if(FPClosersPrecio === '') errorValue = "Please enter FuturePath closure/terminal price";
    

    if(errorValue !== undefined){
        imprimirMensaje(errorValue,"error");
    } else {
        const tablaDinamica = document.createElement('table');

        tablaDinamica.innerHTML = `
        <table style="width:100%" id="table${numeroPerfiles}">
        <tr>
        <td><h4> Upgrade No. ${numeroPerfiles+1} </h4></td>
        </tr> 
        <tr>
        <td><h4> Standard Conduit </h4></td> <td></td>
        <td> <h4>Futurepath </h4></td> <td></td>
        </tr>
        <tr>
        <td><p>Pathway: ${CtPathways}<br/></p> </td> <td><p>Price: ${CtPathwaysPrecio}<br/></p> </td>
        <td><p>Pathway: ${FPPathways}<br/></p> </td> <td><p>Price: ${FPPathwaysPrecio}<br/></p> </td>
        </tr>
        <tr>
        <td><p>No Pathways: ${CtNopathways} </p> </td> <td></td>
        <td><p>No Pathways: ${FPNopathways} </p> </td> <td></td>
        </tr>
        <tr>
        <td><p>Pathway installation: ${CtPathwayinstallation} <br/></p> </td> <td><p>Price: ${CtPathwayinstallationPrecio}<br/></p> </td>
        <td><p>Pathway installation: ${FPPathwayinstallation} <br /></p> </td> <td><p>Price: ${FPPathwayinstallationPrecio}<br/></p> </td>
        </tr>
        <tr>
        <td><p>Fiber Cables: ${CtFibercables} <br/></p> </td> <td><p>Price: ${CtFibercablesPrecio}<br/></p> </td>
        <td><p>Fiber Cables: ${FPFibercables} <br/></p></td> <td><p>Price: ${FPFibercablesPrecio}<br/></p> </td>
        </tr>
        <tr>
        <td> <p>No of Cables: ${CtNocables} </p> </td> <td></td>
        <td> <p>No of Cables: ${FPNocables} </p> </td> <td></td>
        </tr>
        <tr>
        <td><p>Cable installation: ${CtCableinstallation} <br/></p> </td> <td><p>Price: ${CtCableinstallationPrecio}<br/></p> </td>
        <td><p>Cable installation: ${FPCableinstallation} <br/></p> </td> <td><p>Price: ${FPCableinstallationPrecio}<br/></p> </td>
        </tr>
        <tr>
        <td><p>Closures/Terminals/Pathway Splicing/Other:  ${CtClosers} <br/></p></td> <td><p>Price: ${CtClosersPrecio}<br/></p> </td> <td><p>Distance:  ${CtClosersDistance} <br/></p></td>
        <td><p>Closures/Terminals/Pathway Splicing/Other:  ${FPClosers} <br/></p></td> <td><p>Price: ${FPClosersPrecio}<br/></p> </td>  <td><p>Distance: ${FPClosersDistance}<br/></p> </td>
        <td><button type="button" name="removeUpgrade" id="${numeroPerfiles}" class="btn btn-danger btn_remove"> X</button></td> 
        </tr>
        `;
        tabla.appendChild(tablaDinamica);
    
        const perfil = {
            idPerfil: numeroPerfiles,
            CtPathways: CtPathways,
            CtPathwaysPrecio: CtPathwaysPrecio,
            FPPathways: FPPathways,
            FPPathwaysPrecio: FPPathwaysPrecio,
            CtFibercables: CtFibercables,
            CtFibercablesPrecio: CtFibercablesPrecio,
            FPFibercables: FPFibercables,
            FPFibercablesPrecio: FPFibercablesPrecio,
            CtClosers: CtClosers,
            CtClosersDistance: CtClosersDistance,
            CtClosersPrecio: CtClosersPrecio,
            FPClosers: FPClosers,
            FPClosersDistance: FPClosersDistance,
            FPClosersPrecio: FPClosersPrecio,
            CtPathwayinstallation: CtPathwayinstallation,
            CtPathwayinstallationPrecio: CtPathwayinstallationPrecio,
            FPPathwayinstallation: FPPathwayinstallation,
            FPPathwayinstallationPrecio: FPPathwayinstallationPrecio,
            CtCableinstallation: CtCableinstallation,
            CtCableinstallationPrecio: CtCableinstallationPrecio,
            FPCableinstallation: FPCableinstallation,
            FPCableinstallationPrecio: FPCableinstallationPrecio,
            CtNopathways: CtNopathways,
            FPNopathways: FPNopathways,
            CtNocables: CtNocables,
            FPNocables: FPNocables}
    
        guardaPerfilLocalStorage(perfil);
        numeroPerfiles += 1;
    }


}

////////////////////////////////////////////////////////////
////////////////Funciones de Apoyo//////////////////////////
////////////////////////////////////////////////////////////

function leerPerfilesLocalStorage(){

    let perfilesLS;

    perfilesLS = obtenerPerfilesLocalStorage('perfiles');

    perfilesLS.forEach(function(perfil,index){
        const tablaDinamica = document.createElement('table');

        tablaDinamica.innerHTML = `
        <table style="width:100%" id="table${perfil.idPerfil}">
        <tr>
        <td><h4> Upgrade No. ${perfil.idPerfil+1} </h4></td>
        </tr> 
        <tr>
        <td><h4> Standard Conduit </h4></td> <td></td>
        <td> <h4>Futurepath </h4></td> <td></td>
        </tr>
        <tr>    
        <td><p>Pathway: ${perfil.CtPathways}<br/></p> </td> <td><p>Price: ${perfil.CtPathwaysPrecio}<br/></p> </td>
        <td><p>Pathway: ${perfil.FPPathways}<br/></p> </td> <td><p>Price: ${perfil.FPPathwaysPrecio}<br/></p> </td>
        </tr>
        <tr>
        <td><p>No Pathways: ${perfil.CtNopathways} </p> </td> <td></td>
        <td><p>No Pathways: ${perfil.FPNopathways} </p> </td> <td></td>
        </tr>
        <tr>
        <td><p>Pathway installation: ${perfil.CtPathwayinstallation} <br/></p> </td> <td><p>Price: ${perfil.CtPathwayinstallationPrecio}<br/></p> </td>
        <td><p>Pathway installation: ${perfil.FPPathwayinstallation} <br /></p> </td> <td><p>Price: ${perfil.FPPathwayinstallationPrecio}<br/></p> </td>
        </tr>
        <tr>
        <td><p>Fiber Cables: ${perfil.CtFibercables} <br/></p> </td> <td><p>Price: ${perfil.CtFibercablesPrecio}<br/></p> </td>
        <td><p>Fiber Cables: ${perfil.FPFibercables} <br/></p></td> <td><p>Price: ${perfil.FPFibercablesPrecio}<br/></p> </td>
        </tr>
        <tr>
        <td> <p>No of Cables: ${perfil.CtNocables} </p> </td> <td></td>
        <td> <p>No of Cables: ${perfil.FPNocables} </p> </td> <td></td>
        </tr>
        <tr>
        <td><p>Cable installation: ${perfil.CtCableinstallation} <br/></p> </td> <td><p>Price: ${perfil.CtCableinstallationPrecio}<br/></p> </td>
        <td><p>Cable installation: ${perfil.FPCableinstallation} <br/></p> </td> <td><p>Price: ${perfil.FPCableinstallationPrecio}<br/></p> </td>
        </tr>
        <tr>
        <td rowspan="2"><p>Closures/Terminals/Pathway Splicing/Other: ${perfil.CtClosers}<br/></p></td> <td><p>Distance:${perfil.CtClosersDistance}<br/></p></td> 
        <td rowspan="2"><p>Closures/Terminals/Pathway Splicing/Other: ${perfil.FPClosers}<br/></p></td> <td><p>Distance:${perfil.FPClosersDistance}<br/></p></td>  
        </tr>
        <tr>
        <td><p>Price: ${perfil.CtClosersPrecio}<br/></p> </td> <td><p>Price: ${perfil.FPClosersPrecio}<br/></p> </td>
        <td><button type="button" name="removeUpgrade" id="${index}" class="btn btn-danger btn_remove"> X</button></td> 
        </tr>
        `;

        tabla.appendChild(tablaDinamica);
        numeroPerfiles += 1;
    });

}

function guardaPerfilLocalStorage(perfil){
    let perfilesLS;

    perfilesLS = obtenerPerfilesLocalStorage('perfiles');

    perfilesLS.push(perfil);
    localStorage.setItem('perfiles',JSON.stringify(perfilesLS)); 
}

function borrarPerfilLocalStorage(idPerfil){
    let perfilesLS;

    perfilesLS = obtenerPerfilesLocalStorage('perfiles');
    perfilesLS.forEach(function(perfil, index){
        if(perfil.idPerfil === parseInt(idPerfil)){ //idPerfil está en string y el atributo idPerfil del objeto perfil está en integer
            perfilesLS.splice(index, 1);
        }
    });
    localStorage.setItem('perfiles',JSON.stringify(perfilesLS));
}

 //función para rellenar los campos del formulario
function crearCosto (idSelect,arreglo){
    const costosConduit = document.getElementById(idSelect);
    let option = document.createElement('option');
    option.innerHTML = arreglo.Product;
    costosConduit.appendChild(option);
}

function borrarCosto(idSelect){
    const costosConduit = document.getElementById(idSelect);
    if(costosConduit.options.length != 1){
        var length = costosConduit.options.length; //tomo length para pasar a borrar
        for (i = length-1; i >= 0; i--) {  //borro los valores antes de escribir las nuevas opciones
            costosConduit.options[i] = null;
        }
    }
}

//Procedimiento para instear la fila de precio en cada campo del formulario
function adicionarFilaPrecio(idObjeto,idFilaPrecio,valueNone){
    const lineaDeTabla = idObjeto.parentElement;  
    const lineaDePrecio = document.createElement('p');

    switch(idFilaPrecio){
        case 'CtClosersDistance':
            lineaDePrecio.innerHTML = `Enter distance: <input type="text" class="precio" id="${idFilaPrecio}" /> `;
            break;
        case 'FPClosersDistance':
            lineaDePrecio.innerHTML = `Enter distance: <input type="text" class="precio" id="${idFilaPrecio}" /> `;
            break;       
        case 'CtClosersPrecio':
            lineaDePrecio.innerHTML = `Price for elements considered: <input type="text" class="precio" id="${idFilaPrecio}" /> `;
            break;
        case 'FPClosersPrecio':
            lineaDePrecio.innerHTML = `Price for elements considered: <input type="text" class="precio" id="${idFilaPrecio}" /> `;
            break;
        default:
            lineaDePrecio.innerHTML = `Price for "${idObjeto.value}" per unit length: <input type="text" class="precio" id="${idFilaPrecio}" /> `;
               
    }

   /* lineaDePrecio.innerHTML = `
        Price for "${idObjeto.value}": <input type="text" id="${idFilaPrecio}" />
        `;*/
    if(document.getElementById(idFilaPrecio) !== null){
        document.getElementById(idFilaPrecio).parentElement.remove();
        lineaDeTabla.appendChild(lineaDePrecio);
    }else{
        lineaDeTabla.appendChild(lineaDePrecio);
    }
    if(idObjeto.value === valueNone && document.getElementById(idFilaPrecio) !== null)
        document.getElementById(idFilaPrecio).parentElement.remove();
}

//funcion para validar el precio de un fila si fue digitado
function validarInputPrecio(campo,campoPrecio,validador){
    let precio;

    if(document.getElementById(campo).value !== validador) 
        precio = document.getElementById(campoPrecio).value;
    else
        precio = 0;
    return precio;
}

function obtenerPerfilesLocalStorage(keyLS){
    let perfilesLS;

    if(localStorage.getItem(keyLS)=== null){
        perfilesLS = [];
    } else{
        perfilesLS = JSON.parse(localStorage.getItem(keyLS));
    }
    return  perfilesLS;
}

function imprimirMensaje(mensaje, tipo){
    const formulario = document.getElementById('profilesTable'); //document.getElementById('mensaje'); 
        const divMensaje = document.createElement('div');
        //const divMensaje = document.getElementById('mensaje');
        divMensaje.classList = 'mensaje';
        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }
        divMensaje.innerHTML = `<p> ${mensaje} </p>`;
        //divMensaje.appendChild(document.createTextNode(mensaje)); //se creó un innerHTML a cambio de text node para asignar propiedades en CSS
        document.querySelector('.article').insertBefore(divMensaje, formulario); //insertBefore toma el mensaje y antes de dónde se va a insertar

        setTimeout(function(){
            document.querySelector('.article .mensaje').remove();
            //formulario.reset(); //luego del mensaje también hace reset
        },3000);
}
