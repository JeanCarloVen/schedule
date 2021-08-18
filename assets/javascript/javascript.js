const d = document,
        $selectSupplier = d.getElementById("select-supplier"),
        $selectService = d.getElementById("select-service"),
        $open = d.getElementById("open"),
        $scheduleStart = d.getElementById("scheduleStart"),
        $scheduleEnd = d.getElementById("scheduleEnd"),
        $selectYear = d.getElementById("year"),
        $selectMonth = d.getElementById("month-picker"),
        $selectDay = d.querySelector(".calendar-days");
var wd = null; 

function loadSupplier(){
    fetch("models/suppliers.php")
        .then(res => res.ok ? res.json(): Promise.reject(res))
        .then(json => {
           //console.log(json);  
            //console.log(json[0].Working_Days);  
            //Declaración del JSON con los datos de los proveedores (Máximo 10 o 20 proveedores)
//            sessionStorage.setItem('data', JSON.stringify(json));
//            data = sessionStorage.getItem('data')            
            //Carga de Opciones
            let $options = `<option value="">Elige un proveedor</option>`;
            json.forEach(el => $options += `<option value="${el.id_Supplier}">${el.Supplier_Name}</option>`);
            $selectSupplier.innerHTML = $options;
        })
        .catch(err =>{
            console.log(err);
            let message = err.statusText || "Ocurrio un error";
            $selectSupplier.nextElementSibling.innerHTML = `
            Error ${err.status}: ${message}
            `;
        })                     
}

function loadServices(supplier){
    fetch(`models/services.php?id_supplier=${supplier}`)
            .then(res => res.ok ? res.json(): Promise.reject(res))
            .then(json => {
                //console.log(json);
                //Declaración del JSON con los datos de los proveedores (Máximo 10 o 20 proveedores)
                sessionStorage.setItem('data', JSON.stringify(json));
                data = sessionStorage.getItem('data');
                //console.log(JSON.parse(data));
                data = JSON.parse(data);
                                
                (typeof data[0]  !== 'undefined') ? $open.textContent = data[0].Day : $open.textContent = ""; 
                (typeof data[0]  !== 'undefined') ? $scheduleStart.textContent = data[0].Start : $scheduleStart.textContent = ""; 
                (typeof data[0]  !== 'undefined') ? $scheduleEnd.textContent = data[0].End : $scheduleEnd.textContent = ""; 
                
                
                //Carga de Opciones
                let $options = `<option value="">Elige un servicio</option>`;
                json.forEach(el => $options += `<option value="${el.ID_Service}">${el.Service_Name}</option>`);
                $selectService.innerHTML = $options;
            })
            .catch(err =>{
            console.log(err);
            let message = err.statusText || "Ocurrio un error";
            $selectService.nextElementSibling.innerHTML = `
            Error ${err.status}: ${message}
            `;
        })
}

generateDate = (year, month, day) =>{
    switch (month){
        case 'January':
            month = 0;
            break;
        case 'February':
            month = 1;
            break;    
        case 'March':
            month = 2;
            break;
        case 'April':
            month = 3;
            break;    
        case 'May':
            month = 4;
            break; 
        case 'June':
            month = 5;
            break;    
        case 'July':
            month = 6;
            break; 
        case 'August':
            month = 7;
            break;
        case 'September':
            month = 8;
            break;    
        case 'October':
            month = 9;
            break; 
        case 'November':
            month = 10;
            break;
        case 'December':
            month = 11;
            break;    
    };
    
    //Construir fecha en string:
    return  new Date(year, month, day);  
} 

//Valida si el día seleccionado por el usuario se encuentra dentro de los días de trabajo del proveedor
function isValidateDay(workingDay, daySelected){
    let isValidate;
   
    //console.log(workingDay, daySelected);
    
    let workDay = workingDay, 
        newWordDay = workDay.replace(/-/g,""); //Elimina los guiones
   
    const wd = {
        "SUNDAY" : 0,
        "MONDAY" : 1,
        "TUESDAY" : 2,
        "WEDNESDAY" : 3,
        "THURSDAY" : 4,
        "FRIDAY" : 5,
        "SATURDAY" : 6,
        "MONFRI" : [1,2,3,4,5],
        "TUESUN" : [2,3,4,5,6,0],
        "TUESAT" : [2,3,4,5,6],
        "FRISUN" : [5,6]
    };
    
    let valor = wd[`${newWordDay}`];
    
    //console.log(valor);
    
    //console.log(valor.includes(daySelected));
    
    //valor.includes(daySelected) ? alert("El día seleccionado esta en rango") : alert("Día seleccionado fuera de rango");
    valor.includes(daySelected) ? isValidate = true : isValidate = false;
    
    return isValidate;
}

function loadSelectedDay(e){
    //Valida si previamente se seleccionó el proveedor y el servicio
    if($selectSupplier.value !== "" && $selectService.value !== ""){
        //Valida si se click es sobre área del calendario
        if(e.target.matches(".calendar-day-hover")){
            let $daySelected = e.target.innerText ? e.target.innerText : "No hay día Seleccionado",
                $year = $selectYear.textContent,
                $month = $selectMonth.textContent,
                date = generateDate($year, $month, $daySelected); //Generamos la fecha en formato DAYOFWEEK MONTH DAY YEAR 00:00:00 TIMEZONE, que se puede manipular con métodos DATE     
           
            console.log("La fecha es: " + date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate());
            
            //Se compará si el día seleccionado se encuentra dentro del rango de los días de servicios del proveedor            
            if( isValidateDay(data[0].Day , date.getDay()) ){
                console.log("Día Válido");
                let supplier = $selectSupplier.selectedOptions[0].value ? $selectSupplier.selectedOptions[0].value : "No hay proveedor Seleccionado",
                    service = $selectService.selectedOptions[0].value ? $selectService.selectedOptions[0].value : "No hay servicio Seleccionado",
                    day = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
                
                console.log("Proveedor seleccionado: " + supplier);
                console.log("Servicio seleccionado: " + service);
                console.log("Dia Seleccionado: " + day);               
                
                //Carga la disponibilidad del día
                fetch(`models/booking.php?day=${day}&id_supplier=${supplier}&id_service=${service}`)
                    .then(res => res.ok ? res.json(): Promise.reject(res))
                    .then(json => {
                        console.log(json);
                    })
                    .catch(err => {
                        let message = err.statusText || "Ocurrio un error";
                        console.log(message);
                        console.log(err);
                    });
            }else{
                console.log("Día no Valido");
            }

        }
    }else{
        alert("Selecciona un proveedor y/o servicio");
    }
    
}

//Listener al Inicio, carga proveedores.
d.addEventListener("DOMContentLoaded",loadSupplier());

//Listener al cambiar el Proveedor, en consecuencia carga los servicios
$selectSupplier.addEventListener("change", e => {
        //Carga los servicios del proveedor seleccionado
        loadServices(e.target.value);
    });
    
//Listener al click, Valida y carga la disponibilidad del día.
$selectDay.addEventListener("click", e => loadSelectedDay(e));



