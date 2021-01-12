//////////////////////////////////////////////
////////////////variables/////////////////////
//////////////////////////////////////////////
const modelo = document.getElementById('calcular-modelo');
const addUpgradeBton = document.getElementById('addUpgrade');
const EraseLSBtn = document.getElementById('erase-data');
const regionSelector = document.getElementById('SelectRegion');
let perfiles = new Array();
let anioUpgrade = 0;
let chartBarCosto;
let chartBarDiferencia;

///////////////////////////////////////////////////
////////////////Clases/////////////////////////////
///////////////////////////////////////////////////
class CostosProductos {
    constructor(region){this.region = region}
    crear(){
        const xhr = new XMLHttpRequest();

        document.getElementById("SelectRegion").selectedIndex = parseInt(this.region)-1;

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

class Perfiles {
    constructor (idPerfil, CtPathways,CtPathwaysPrecio,FPPathways,FPPathwaysPrecio,CtFibercables,CtFibercablesPrecio,FPFibercables,FPFibercablesPrecio,CtClosers,CtClosersPrecio,CtClosersDistance,FPClosers,FPClosersPrecio,FPClosersDistance,CtPathwayinstallation,CtPathwayinstallationPrecio,FPPathwayinstallation,FPPathwayinstallationPrecio,CtCableinstallation,CtCableinstallationPrecio,FPCableinstallation,FPCableinstallationPrecio,CtNopathways,FPNopathways,CtNocables,FPNocables){
        this.idPerfil = idPerfil;
        this.CtPathways = CtPathways; this.CtPathwaysPrecio = CtPathwaysPrecio;
        this.FPPathways = FPPathways; this.FPPathwaysPrecio = FPPathwaysPrecio;
        this.CtFibercables = CtFibercables; this.CtFibercablesPrecio = CtFibercablesPrecio;
        this.FPFibercables = FPFibercables; this.FPFibercablesPrecio = FPFibercablesPrecio;
        this.CtClosers = CtClosers; this.CtClosersPrecio = CtClosersPrecio; this.CtClosersDistance = CtClosersDistance;
        this.FPClosers = FPClosers; this.FPClosersPrecio = FPClosersPrecio; this.FPClosersDistance = FPClosersDistance;
        this.CtPathwayinstallation = CtPathwayinstallation; this.CtPathwayinstallationPrecio = CtPathwayinstallationPrecio;
        this.FPPathwayinstallation = FPPathwayinstallation; this.FPPathwayinstallationPrecio = FPPathwayinstallationPrecio;
        this.CtCableinstallation = CtCableinstallation; this.CtCableinstallationPrecio = CtCableinstallationPrecio;
        this.FPCableinstallation = FPCableinstallation; this.FPCableinstallationPrecio = FPCableinstallationPrecio;
        this.CtNopathways = CtNopathways; this.FPNopathways = FPNopathways;
        this.CtNocables = CtNocables; this.FPNocables = FPNocables;
    }

    calculoCostoConduit(){
        let costoConduit;
        const Projectlength = document.querySelector('#Projectlength').value;
        let numberOfClosures;

        /*switch(this.CtClosers){
            case "Every250\'":
                numberOfClosures = parseInt(Projectlength)/250;
                break;
            case "Every500\'":
                numberOfClosures = parseInt(Projectlength)/500;
                break;
            case 'Every750\'':
                numberOfClosures = parseInt(Projectlength)/750;
                break;
            case 'NA':
                numberOfClosures = 0;
                break;
        }*/
        costoConduit = parseInt(Projectlength)*(
            this.CtPathwaysPrecio * parseInt(this.CtNopathways) + 
            parseFloat(this.CtFibercablesPrecio) * parseInt(this.CtNocables) +
            parseFloat(this.CtCableinstallationPrecio) * parseInt(this.CtNocables) +
            parseFloat(this.CtPathwayinstallationPrecio)) +
            parseInt(Projectlength)/parseInt(this.CtClosersDistance) * parseFloat(this.CtClosersPrecio);
            //numberOfClosures * parseFloat(this.CtClosersPrecio);
        return costoConduit.toFixed(2); //toFixed(n) retorna los n decimales solamente
    }

    calculoCostoFuturepath(){
        let costoFuturepath;
        const Projectlength = document.querySelector('#Projectlength').value;
        let numberOfClosures;

 /*       switch(this.FPClosers){
            case "Every250\'":
                numberOfClosures = parseInt(Projectlength)/250;
                break;
            case "Every500\'":
                numberOfClosures = parseInt(Projectlength)/500;
                break;
            case 'Every750\'':
                numberOfClosures = parseInt(Projectlength)/750;
                break;
            case 'NA':
                numberOfClosures = 0;
                break;
        }*/

        costoFuturepath = parseInt(Projectlength)*(
            this.FPPathwaysPrecio * parseInt(this.FPNopathways) + 
            parseFloat(this.FPFibercablesPrecio) * parseInt(this.FPNocables) +
            parseFloat(this.FPCableinstallationPrecio) * parseInt(this.FPNocables) +
            parseFloat(this.FPPathwayinstallationPrecio)) +
            parseInt(Projectlength)/parseInt(this.FPClosersDistance) * parseFloat(this.FPClosersPrecio);
            //numberOfClosures * parseFloat(this.FPClosersPrecio);
        return costoFuturepath.toFixed(2);
    }
}

class ChartCanvas {
    crearBarCosto(calculoPerfilesarreglo){
        var ctx = document.getElementById('barChartCostos').getContext('2d');
        if (chartBarCosto) {
            chartBarCosto.data.datasets[0].data = calculoPerfilesarreglo[0];
            chartBarCosto.data.datasets[1].data = calculoPerfilesarreglo[1];
            chartBarCosto.update();
          } else {        
            chartBarCosto = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['CAPEX', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10'],
                datasets: [{
                    label: 'Cost with Conduit [US]',
                    data: calculoPerfilesarreglo[0],//[dato1, dato1, 15, 5, 2, dato1, 10, 10, 10, 10],
                    backgroundColor: [
                        'rgba(242, 38, 19, 0.8)',
                        'rgba(242, 38, 19, 0.8)',
                        'rgba(242, 38, 19, 0.8)',
                        'rgba(242, 38, 19, 0.8)',
                        'rgba(242, 38, 19, 0.8)',
                        'rgba(242, 38, 19, 0.8)',
                        'rgba(242, 38, 19, 0.8)',
                        'rgba(242, 38, 19, 0.8)',
                        'rgba(242, 38, 19, 0.8)',
                        'rgba(242, 38, 19, 0.8)',
                        'rgba(242, 38, 19, 0.8)'
                    ],
                    borderColor: [
                        'rgba(150, 40, 27, 1)',
                        'rgba(150, 40, 27, 1)',
                        'rgba(150, 40, 27, 1)',
                        'rgba(150, 40, 27, 1)',
                        'rgba(150, 40, 27, 1)',
                        'rgba(150, 40, 27, 1)',
                        'rgba(150, 40, 27, 1)',
                        'rgba(150, 40, 27, 1)',
                        'rgba(150, 40, 27, 1)',
                        'rgba(150, 40, 27, 1)',
                        'rgba(150, 40, 27, 1)'
                    ],
                    borderWidth: 1
                    },{ label: 'Cost with FuturePath [US]',
                    data: calculoPerfilesarreglo[1],//[dato1, 19, 3, 5, 2, 3, 10, 10, 10, 10],
                    backgroundColor: [
                        'rgba(31, 58, 147, 0.8)',
                        'rgba(31, 58, 147, 0.8)',
                        'rgba(31, 58, 147, 0.8)',
                        'rgba(31, 58, 147, 0.8)',
                        'rgba(31, 58, 147, 0.8)',
                        'rgba(31, 58, 147, 0.8)',
                        'rgba(31, 58, 147, 0.8)',
                        'rgba(31, 58, 147, 0.8)',
                        'rgba(31, 58, 147, 0.8)',
                        'rgba(31, 58, 147, 0.8)',
                        'rgba(31, 58, 147, 0.8)'
                    ],
                    borderColor: [
                        'rgba(34, 49, 63, 1)',
                        'rgba(34, 49, 63, 1)',
                        'rgba(34, 49, 63, 1)',
                        'rgba(34, 49, 63, 1)',
                        'rgba(34, 49, 63, 1)',
                        'rgba(34, 49, 63, 1)',
                        'rgba(34, 49, 63, 1)',
                        'rgba(34, 49, 63, 1)',
                        'rgba(34, 49, 63, 1)',
                        'rgba(34, 49, 63, 1)',
                        'rgba(34, 49, 63, 1)'
                    ],
                    borderWidth: 1
                   }
                ]
            },
            options: {
                title: {
                    display: true,
                    fontSize : 20,
                    text: 'Investment comparisons over 10 yrs. period'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });}

    }

    crearBarDiferencia(calculoPerfilesarreglo){
        const diferencia = restarArreglos(calculoPerfilesarreglo[0], calculoPerfilesarreglo[1]);
        var ctx = document.getElementById('barChartDirefencia').getContext('2d');
        if (chartBarDiferencia) {
            chartBarDiferencia.data.datasets[0].data = diferencia;
            chartBarDiferencia.update();
        } else { 
            chartBarDiferencia = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['CAPEX', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10'],
                    datasets: [{
                        label: 'Difference between Conduit vs Futurepath costs [US]',
                        data: diferencia,
                        backgroundColor: [
                            'rgba(242, 38, 19, 0.8)',
                            'rgba(242, 38, 19, 0.8)',
                            'rgba(242, 38, 19, 0.8)',
                            'rgba(242, 38, 19, 0.8)',
                            'rgba(242, 38, 19, 0.8)',
                            'rgba(242, 38, 19, 0.8)',
                            'rgba(242, 38, 19, 0.8)',
                            'rgba(242, 38, 19, 0.8)',
                            'rgba(242, 38, 19, 0.8)',
                            'rgba(242, 38, 19, 0.8)',
                            'rgba(242, 38, 19, 0.8)'
                        ],
                        borderColor: [
                            'rgba(150, 40, 27, 1)',
                            'rgba(150, 40, 27, 1)',
                            'rgba(150, 40, 27, 1)',
                            'rgba(150, 40, 27, 1)',
                            'rgba(150, 40, 27, 1)',
                            'rgba(150, 40, 27, 1)',
                            'rgba(150, 40, 27, 1)',
                            'rgba(150, 40, 27, 1)',
                            'rgba(150, 40, 27, 1)',
                            'rgba(150, 40, 27, 1)',
                            'rgba(150, 40, 27, 1)'
                        ],
                        borderWidth: 1
                        }
                    ]
                },
                options: {
                    title: {
                        display: true,
                        fontSize : 20,
                        text: 'Project Savings'
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }
    }
}

class Interfaz {
    insertarChartBar(calculoPerfilesarreglo){
        const chartModelo = new ChartCanvas().crearBarCosto(calculoPerfilesarreglo);
    }

    insertarChartBarDiferencia(calculoPerfilesarreglo){
        const chartModelo = new ChartCanvas().crearBarDiferencia(calculoPerfilesarreglo);
    }

    imprimirMensaje(mensaje, tipo){
        const formulario = document.getElementById('cargando'); //document.getElementById('mensaje'); 
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

    imprimirspinner(calculoPerfilesarreglo,timeValue){
        const spinner = document.querySelector('#cargando img');
        spinner.style.display = 'block';
        const chartBar = document.getElementById('barChartCostos');
        chartBar.style.display = 'none';
        const chartBarDiferencia = document.getElementById('barChartDirefencia');
        chartBarDiferencia.style.display = 'none';
        const NPV = document.getElementById('NPV');
        NPV.style.display = 'none';
        const IRR = document.getElementById('IRR');
        IRR.style.display = 'none';
        const ROI = document.getElementById('ROI');
        ROI.style.display = 'none';
        var self = this;

        setTimeout(function(){
            spinner.style.display= 'none';
            chartBar.style.display = 'block';
            chartBarDiferencia.style.display = 'block';
            NPV.style.display = 'block';
            IRR.style.display = 'block';
            ROI.style.display = 'block';
            self.insertarChartBar(calculoPerfilesarreglo);
            self.insertarChartBarDiferencia(calculoPerfilesarreglo);
            insertarResultado("NPV", calculoPerfilesarreglo, timeValue);
            insertarResultado("IRR", calculoPerfilesarreglo, timeValue);
            insertarResultado("ROI", calculoPerfilesarreglo, timeValue);
        }, 3000);
    }
}

////////////////////////////////////////////////////
////////////////Event listeners/////////////////////
////////////////////////////////////////////////////
cargarEventlisteners();

function cargarEventlisteners(){
    modelo.addEventListener('change', colocarPrecio);

    modelo.addEventListener('submit', guardarDatosYCalcular);

    addUpgradeBton.addEventListener('click', addicionarYearsUpgrade);

    EraseLSBtn.addEventListener('click', borrarLS);

    document.addEventListener('DOMContentLoaded', cargarPrecioValoresLS);   //función para inicilizar los campos del modelo
 
    document.addEventListener('click', removerFilasUpgrade);

    regionSelector.addEventListener('change', cambiarRegion);
}

///////////////////////////////////////////////////
////////////////Funciones//////////////////////////
///////////////////////////////////////////////////
function cambiarRegion(e){
    e.preventDefault(); 

    const costos = new CostosProductos(e.target.value);
    costos.crear();
    localStorage.setItem('region',JSON.stringify(regionSelector.value)); //Actualiza el valor

}

function cargarPrecioValoresLS(){
    let region;
    if(localStorage.getItem('region')=== null){
        region = [];
        const costos = new CostosProductos("1"); //North America - US por defecto
        costos.crear();
    } else{
        region = JSON.parse(localStorage.getItem('region'));
        console.log(region)
        const costos = new CostosProductos(region); //North America - US por defecto
        costos.crear();
    }

    leerLocalStorage();
    
    leerUpgradesLocalStorage();

    localStorage.setItem('region',JSON.stringify(regionSelector.value)); //Almacena la región
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

 function guardarDatosYCalcular(e){
    e.preventDefault();

    const Projectlength = document.querySelector('#Projectlength').value;
    const Timevalue = document.querySelector('#Timevalue').value;
    const CtPathways = document.querySelector('#CtPathways').value;
    const FPPathways = document.querySelector('#FPPathways').value;
    const CtNopathways = document.querySelector('#CtNopathways').value;
    const FPNopathways = document.querySelector('#FPNopathways').value;
    const CtPathwayinstallation = document.querySelector('#CtPathwayinstallation').value;
    const FPPathwayinstallation = document.querySelector('#FPPathwayinstallation').value;   
    const CtFibercables = document.querySelector('#CtFibercables').value;
    const FPFibercables = document.querySelector('#FPFibercables').value;
    const CtNocables = document.querySelector('#CtNocables').value;
    const FPNocables = document.querySelector('#FPNocables').value;
    const CtCableinstallation = document.querySelector('#CtCableinstallation').value;
    const FPCableinstallation = document.querySelector('#FPCableinstallation').value;
    const CtClosers = document.querySelector('#CtClosers').value;
    const FPClosers = document.querySelector('#FPClosers').value;
 
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

    const arrayModelo=[Projectlength,Timevalue,CtPathways,CtPathwaysPrecio,FPPathways,FPPathwaysPrecio,CtFibercables,CtFibercablesPrecio,FPFibercables,FPFibercablesPrecio,CtClosers,CtClosersDistance,CtClosersPrecio,FPClosers,FPClosersDistance,FPClosersPrecio,CtPathwayinstallation,CtPathwayinstallationPrecio,FPPathwayinstallation,FPPathwayinstallationPrecio,CtCableinstallation,CtCableinstallationPrecio,FPCableinstallation,FPCableinstallationPrecio,CtNopathways,FPNopathways,CtNocables,FPNocables];

    localStorage.setItem('modelo',JSON.stringify(arrayModelo)); 

    const ui = new Interfaz();//(calculoTodosPerfiles,Timevalue);
    
    let errorValue;
    if(Projectlength === '') errorValue = "Please enter a value in Project length";
    if(Timevalue === '') errorValue = "Please enter a value in Time value of money";
    if(parseInt(FPNocables) > parseInt(FPPathways.slice(11,12))*parseInt(FPNopathways)) errorValue = "Number of cables in FP cannot be greater than the number of microducts"; //slice(11,12) 11 está el número del FP y en el 12 termina el array a devolver
    //if(CtPathwayinstallation.localeCompare(FPPathwayinstallation)) errorValue = "Installation method should be the same on both types of conduit";
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
        ui.imprimirMensaje(errorValue,"error");
    }else{
        const perfilModelo = new Perfiles(0,CtPathways,CtPathwaysPrecio,FPPathways,FPPathwaysPrecio,CtFibercables,CtFibercablesPrecio,FPFibercables,FPFibercablesPrecio,CtClosers,CtClosersDistance,CtClosersPrecio,FPClosers,FPClosersDistance,FPClosersPrecio,CtPathwayinstallation,CtPathwayinstallationPrecio,FPPathwayinstallation,FPPathwayinstallationPrecio,CtCableinstallation,CtCableinstallationPrecio,FPCableinstallation,FPCableinstallationPrecio,CtNopathways,FPNopathways,CtNocables,FPNocables);
        const yearsUpgradeLista = leerYearsUpgradeSelected();
        const perfilesUpgradeLista = leerPerfilesUpgradeSelected();
        const calculoTodosPerfiles = calcularArregloPerfiles(perfilesUpgradeLista,perfilModelo,yearsUpgradeLista);

        ui.imprimirMensaje("Calculating...","ok");
        ui.imprimirspinner(calculoTodosPerfiles,Timevalue);
    }
    
}

function addicionarYearsUpgrade(e){
    e.preventDefault();

    anioUpgrade += 1;
    const tabla = document.getElementById('yearUpgradeTable');
    const tr = document.createElement('tr');

    tr.innerHTML = `
    <tr id="row ${anioUpgrade}">
    <td><p>Upgrade No. ${anioUpgrade+1}</p> </td>
    <td><p>Select year: <select name="SelectYearUpgrade" id="SelectYearUpgrade ${anioUpgrade}">
    <option value="1">Year 1</option>
    <option value="2">Year 2</option>
    <option value="3">Year 3</option>
    <option value="4">Year 4</option>
    <option value="5">Year 5</option>
    <option value="6">Year 6</option>
    <option value="7">Year 7</option>
    <option value="8">Year 8</option>
    <option value="9">Year 9</option>
    <option value="10">Year 10</option>
    </select><br /></p> </td>
    <td><p>Select upgrade: <select name="SelectProfileUpgrade" id="SelectProfileUpgrade ${anioUpgrade}">
    </select><br /></p> </td>
    <td><button type="button" name="removeUpgrade" id="${anioUpgrade}" class="btn btn-danger btn_remove"> X</button></td>                         
    </tr>
    `;
    tabla.appendChild(tr);

    adicionarYearsUpgradePerfil("SelectProfileUpgrade" + ' ' + anioUpgrade);
}

////////////////////////////////////////////////////////////
////////////////Funciones de Apoyo//////////////////////////
////////////////////////////////////////////////////////////
function leerLocalStorage(){
    let modeloLS;

    if(localStorage.getItem('modelo')=== null){
        modeloLS = [];
    } else{
        modeloLS = JSON.parse(localStorage.getItem('modelo'));

        document.getElementById('Projectlength').value = modeloLS[0];
        document.getElementById('Timevalue').value = modeloLS[1];

        rellenarInfoModeloLS(modeloLS[2],modeloLS[3],'CtPathways','CtPathwaysPrecio',"Conduit - None");
        rellenarInfoModeloLS(modeloLS[4],modeloLS[5],'FPPathways','FPPathwaysPrecio',"Pathway - None");
        rellenarInfoModeloLS(modeloLS[6],modeloLS[7],"CtFibercables","CtFibercablesPrecio","NA");
        rellenarInfoModeloLS(modeloLS[8],modeloLS[9],"FPFibercables","FPFibercablesPrecio","NA");
        rellenarInfoModeloLS(modeloLS[10],modeloLS[11],"CtClosers","CtClosersDistance","NA");
        rellenarInfoModeloLS(modeloLS[10],modeloLS[12],"CtClosers","CtClosersPrecio","NA");

        rellenarInfoModeloLS(modeloLS[13],modeloLS[14],"FPClosers","FPClosersDistance","NA");
        rellenarInfoModeloLS(modeloLS[13],modeloLS[15],"FPClosers","FPClosersPrecio","NA");

        rellenarInfoModeloLS(modeloLS[16],modeloLS[17],"CtPathwayinstallation","CtPathwayinstallationPrecio","NA");
        rellenarInfoModeloLS(modeloLS[18],modeloLS[19],"FPPathwayinstallation","FPPathwayinstallationPrecio","NA");
        rellenarInfoModeloLS(modeloLS[20],modeloLS[21],"CtCableinstallation","CtCableinstallationPrecio","Not Required");
        rellenarInfoModeloLS(modeloLS[22],modeloLS[23],"FPCableinstallation","FPCableinstallationPrecio","Not Required");

        document.getElementById('CtNopathways').value = modeloLS[24];
        document.getElementById('FPNopathways').value = modeloLS[25];
        document.getElementById('CtNocables').value = modeloLS[26];
        document.getElementById('FPNocables').value = modeloLS[27];

    }

}

function leerUpgradesLocalStorage(){
    let upgradeLS;

    if(localStorage.getItem('perfiles')=== null){
        upgradeLS = [];
    } else{
        upgradeLS = JSON.parse(localStorage.getItem('perfiles'));

        upgradeLS.forEach(function(perfil,index) {
            
            perfiles.push(new Perfiles(perfil.idPerfil, perfil.CtPathways, perfil.CtPathwaysPrecio, perfil.FPPathways, perfil.FPPathwaysPrecio, perfil.CtFibercables, perfil.CtFibercablesPrecio, perfil.FPFibercables, perfil.FPFibercablesPrecio,  perfil.CtClosers, perfil.CtClosersDistance, perfil.CtClosersPrecio, perfil.FPClosers, perfil.FPClosersDistance, perfil.FPClosersPrecio, perfil.CtPathwayinstallation, perfil.CtPathwayinstallationPrecio, perfil.FPPathwayinstallation, perfil.FPPathwayinstallationPrecio, perfil.CtCableinstallation, perfil.CtCableinstallationPrecio, perfil.FPCableinstallation, perfil.FPCableinstallationPrecio,perfil.CtNopathways, perfil.FPNopathways,perfil.CtNocables, perfil.FPNocables));
        });
        adicionarYearsUpgradePerfil("SelectProfileUpgrade 0");
    }
}

//función para rellenar los campos del formulario
function crearCosto(idSelect,arreglo){
    const costosConduit = document.getElementById(idSelect);
    let option = document.createElement('option');
    option.innerHTML = arreglo.Product;
    //option.value = arreglo.Price;
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

//función para rellenar los profileUpgrade creados dinámicamente
function adicionarYearsUpgradePerfil(elementbyID){
    perfiles.forEach(function(perfil,index) {
        const perfilesList = document.getElementById(elementbyID);
        let option = document.createElement('option');
        option.innerHTML = `Upgrade ${index + 1}`;
        option.value = index;
        perfilesList.appendChild(option);
    })
}

//funcion para lectura de campos de años de Upgrade seleccionados que han sido creados dinámicamente
function leerYearsUpgradeSelected(){
    let yearsUpgrade = new Array();

    for (let index=0; index <= anioUpgrade; index++){
        const yearSelected = document.getElementById("SelectYearUpgrade " + index);
        if(yearSelected !== null)
            yearsUpgrade.push(yearSelected.value);
    }

    return yearsUpgrade;
}

//funcion para lectura de campos de perfiles de Upgrade seleccionados que han sido creados dinámicamente
function leerPerfilesUpgradeSelected(){
    let perfilesUpgrade = new Array();

    for (let index=0; index <= anioUpgrade; index++){
        const perfilSelected = document.getElementById("SelectProfileUpgrade " + index);
        if(perfilSelected !== "NA")
            perfilesUpgrade.push(perfiles[perfilSelected.value]);
    }
    
    return perfilesUpgrade;
}

//Genera los vectores de salida para graficar el bar
function calcularArregloPerfiles(listaPerfilesSelected,perfilModelo,yearsUpgradeLista){
    let calculoTotalAnoPerfilesCt = [0,0,0,0,0,0,0,0,0,0,0]
    let calculoTotalAnoPerfilesFP = [0,0,0,0,0,0,0,0,0,0,0]
    let calculoTotalAnoPerfiles = new Array();
    let calculoperfilCtanos = new Array();
    let calculoperfilFPanos = new Array();

    calculoperfilCtanos.push(perfilModelo.calculoCostoConduit());
    calculoperfilFPanos.push(perfilModelo.calculoCostoFuturepath());

    listaPerfilesSelected.forEach(function(perfil,index){
        if(typeof listaPerfilesSelected[index] != 'undefined'){
            calculoperfilCtanos.push(perfil.calculoCostoConduit());
            calculoperfilFPanos.push(perfil.calculoCostoFuturepath());
        }
    });

    calculoTotalAnoPerfilesCt[0] = calculoperfilCtanos[0];
    calculoTotalAnoPerfilesFP[0] = calculoperfilFPanos[0];

    if(typeof listaPerfilesSelected[0] != 'undefined'){     //En caso que el primer upgrade sea NA (i.e. es undefined el objeto en la posición 0)
        for (let i=1; i <= yearsUpgradeLista.length; i++){
            calculoTotalAnoPerfilesCt[yearsUpgradeLista[i-1]] = calculoperfilCtanos[i];
            calculoTotalAnoPerfilesFP[yearsUpgradeLista[i-1]] = calculoperfilFPanos[i];
        }
    }

    calculoTotalAnoPerfiles.push(calculoTotalAnoPerfilesCt);
    calculoTotalAnoPerfiles.push(calculoTotalAnoPerfilesFP);

    return calculoTotalAnoPerfiles;
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
        case 'CtCableinstallationPrecio':
            lineaDePrecio.innerHTML = `Price for "${idObjeto.value}" per cable per unit length: <input type="text" class="precio" id="${idFilaPrecio}" /> `;
            break;
        case 'FPCableinstallationPrecio':
            lineaDePrecio.innerHTML = `Price for "${idObjeto.value}" per cable per unit length: <input type="text" class="precio" id="${idFilaPrecio}" /> `;
            break;        
        default:
            lineaDePrecio.innerHTML = `Price for "${idObjeto.value}" per unit length: <input type="text" class="precio" id="${idFilaPrecio}" /> `;
               
    }

 /*   if(idObjeto.id === 'CtClosersPrecio' || idObjeto.id === 'FPClosersPrecio'){
        lineaDePrecio.innerHTML = `
        Price for Closure/Terminal: <input type="text" class="precio" id="${idFilaPrecio}" /> `;
    }else{
        lineaDePrecio.innerHTML = `
        Price for "${idObjeto.value}" per unit length: <input type="text" class="precio" id="${idFilaPrecio}" /> `;
    }*/
    
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

//función para cargar los datos del modelo del LS
function rellenarInfoModeloLS (valorAlmacenadoLS,valorAlmacenadoPrecioLS,idObjeto,idFilaPrecio,valueNone){
    if(valorAlmacenadoLS !== valueNone){
        document.getElementById(idObjeto).innerHTML = "<option>" + valorAlmacenadoLS + "</option>";
        adicionarFilaPrecio(document.getElementById(idObjeto),idFilaPrecio,valueNone);
        document.getElementById(idFilaPrecio).value = valorAlmacenadoPrecioLS;
    }
}

function removerFilasUpgrade(e){
    //e.preventDefault();  //si coloco esto, se bloquea el modeloBton.addEventlistener
        if(e.target && e.target.className === 'btn btn-danger btn_remove'){
            const botonrm = document.getElementById(e.target.id);
            botonrm.parentElement.parentElement.remove();
     }
}

//función para borrar el LocalStorage
function borrarLS(){
    localStorage.clear();
}

//funcion sumar/restar arreglos
function restarArreglos(array1, array2){
    let sum = array1.map(function (num, idx) {
        return num - array2[idx];
      });
    return sum;
}

function getNPV(rate, initialCost, cashFlows) {
    var npv = initialCost;

    for (var i = 0; i < cashFlows.length; i++) {
        npv += cashFlows[i] / Math.pow(rate / 100 + 1, i + 1);
    }

    return npv;
}

function IRRCalc (CArray) {
    var i,
    f=999, // initial value for f before any calculations are done is well outside our accept_margin_of_error
    fprime,
    r=0.2, //initial value:2 this is an initial guess, we will revise it with each iteration
    acceptable_margin_of_error = 0.005; //el valor era 0.005
    positive = false, negative = false;
    
    CArray.forEach(function (value) {
        if (value > 0) positive = true;
        if (value < 0) negative = true;
      })
      if (!positive || !negative) return 0;

    while(Math.abs(f) > acceptable_margin_of_error) {
        //console.log(‘r: ‘+r);
        // we are using Newton’s method http://en.wikipedia.org/wiki/Newton’s_method
        // function f = the sum of Ci / (1+r)^i for i=0 to n where n is the index of the last element in the array
        f = 0;
        fprime = 0;
        for (i=0; i<CArray.length; i++) {
            f += CArray[i]/Math.pow(1+r, i);
            fprime += -i*CArray[i]/Math.pow(1+r, i+1);
        }
        r = r - (f/fprime); // use the result of the equation f and the first derivative of f for the current r to iterate to the next r value
    }
    if(r < 0) r = Math.abs(r+2); //Añadí esto ya que cuando es < 0 converge a -2.
    r = Math.round((r*100 + Number.EPSILON) * 100)/100;
    return r;
}

function insertarResultado(parametro,perfiles,timevalue){

    const parametroObject = document.getElementById(parametro);
    if(parametroObject.children[0] !== undefined)
        parametroObject.children[0].remove(); //Elimino el existente y creo uno nuevo cada vez que se presiona submit
     
    let restarArray = restarArreglos(perfiles[0],perfiles[1]);

    if(parametro === "NPV"){
        const firstValueArray = restarArray[0];
        restarArray.shift();

        const valorNPV = document.createElement('p');
        valorNPV.innerHTML = ` <p> Net present value (Savings over last installation period) [US]:
                                ${Math.round(getNPV(timevalue,firstValueArray, restarArray))} </p> `;
        parametroObject.appendChild(valorNPV);
    }

    if(parametro === "IRR"){
        const valorIRR = document.createElement('p');
        valorIRR.innerHTML = ` <p> Internal Return Rate (IRR)[%]:
                                ${IRRCalc(restarArray)}% </p> `;
        parametroObject.appendChild(valorIRR);
    } 

    if(parametro === "ROI"){

        suma = restarArray.reduce((a, b) => a + b, 0);

        ROI = suma / (-restarArray[0]);
        ROI = Math.round((ROI*100 + Number.EPSILON) * 100)/100;

        const valorROI = document.createElement('p');
        valorROI.innerHTML = ` <p> Return of Investment (ROI)[%]:
                                ${ROI}% </p> `;
        parametroObject.appendChild(valorROI);
    } 

}