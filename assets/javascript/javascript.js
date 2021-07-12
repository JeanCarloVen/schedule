const d = document,
        $selectSupplier = d.getElementById("select-supplier"),
        $selectService = d.getElementById("select-service"),
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
//            data = sessionStorage.getItem('data');
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
    date = new Date(year, month, day);   
    return date;      
} 

//function validateDay(day){
//    if("MON-FRI" === day){
//        
//    }
//    if("TUE-SUN" === ){
//        
//    }
//    
//}

function loadSelectedDay(e){
    //Valida si se previamente se seleccionó el proveedor
    if($selectSupplier.value !== "" && $selectService.value !== ""){
        //Valida si se click es sobre área del calendario
        if(e.target.matches(".calendar-day-hover")){
            let $daySelected = e.target.innerText ? e.target.innerText : "No hay día Seleccionado",
                $supplier = $selectSupplier.selectedOptions[0].value ? $selectSupplier.selectedOptions[0].value : "No hay proveedor Seleccionado",
                $service = $selectService.selectedOptions[0].value ? $selectService.selectedOptions[0].value : "No hay servicio Seleccionado",
                year = $selectYear.textContent,
                month = $selectMonth.textContent,
                date;
        
            //Generamos la fecha en formato DAYOFWEEK MONTH DAY YEAR 00:00:00 TIMEZONE, que se puede manipular con métodos DATE     
            date = generateDate(year, month, $daySelected);    
           
            //console.log(date);
        
            //Obtenemos el día de la semana del usuario
            //console.log(date.getDay());
        
            //Validamos si se encuentra el día seleccionado en el día de servico del proveedor
            //MON-FRI => 1-5
            //TUE-SUN => 2-0
            //TUE-SAT => 2-6
            //validateDay(date.getDay());

            //validateDay(date.getDay());
            let dat = JSON.parse(data);
            console.log(dat);
            console.log(dat[0].Day);
            console.log(dat[0].Start);
            console.log(dat[0].End);

            //console.log(JSON.parse(data[0].Start));
            //console.log(JSON.parse(data[0].End));


            //console.log($supplier);
            //console.log($service);
        }
    }else{
        alert("Selecciona un proveedor o servicio");
    }
    
}
            
d.addEventListener("DOMContentLoaded",loadSupplier());
$selectSupplier.addEventListener("change", e => {
        //Carga los servicios del proveedor seleccionado
        loadServices(e.target.value);
    });
$selectDay.addEventListener("click", e => loadSelectedDay(e));



