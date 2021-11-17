const d = document,
        $selectSupplier = d.getElementById("select-supplier"),
        $selectService = d.getElementById("select-service"),
        $open = d.getElementById("open"),
        $scheduleStart = d.getElementById("scheduleStart"),
        $scheduleEnd = d.getElementById("scheduleEnd"),
        $ltService = d.getElementById("lapse_time");
        $selectYear = d.getElementById("year"),
        $selectMonth = d.getElementById("month-picker"),
        $selectDay = d.querySelector(".calendar-days"),
        $selectStaff = d.getElementById("select-staff"),
        $selectAvailable = d.getElementById("select-available");
        
var wd = null; 
var DateTimeLuxon = luxon.DateTime, 
        Interval = luxon.Interval,
        Duration = luxon.Duration;


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
                //(typeof data[0]  !== 'undefined') ? $ltService.textContent = data[0].LT_Service : $ltService.textContent = ""; 
                
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

//Lo ideal es que cada vez que cambie el servicio, se modifique la diponibilidad del miembro del Staff escogido
function loadLapseTime(e){    
    //La idea es que con el valor de e.target.value sea buscado dentro de las objetos del array 
    //Validación de existencia de data
    if(typeof data === 'undefined') return;
    
    //Se recorre el objeto data y cada objeto interno se valida si coincide con el valor del evento obtenido por el usuario.
    data.find( obj =>{
        if(obj.ID_Service === e.target.value){
            //Se coloca el LapseTime en el DOM
            $ltService.innerHTML = obj.LT_Service;
            //Duración del servicio
            LT_ServiceSelected = obj.LT_Service;  
            //Inicio del horario laboral
            Start_ServiceSelected = obj.Start;
            //Fin del horario laboral
            End_ServiceSelected = obj.End;
            
            //Es probable que la función de validación del horario se encuentre en este lugar
            //validateSchedule()
            
        }
    });
}

//Función generadora del día Laboral con separaciones de 15 minutos
function laborDayMaker(startLaborableDay, endLaborableDay){
    //Validación de existencia
        if( typeof startLaborableDay === 'undefined' ||
            typeof endLaborableDay === 'undefined' || 
            typeof date === 'undefined')return;
    
    let dateFromPicker = date,
        timeStartLaborableDayArr = startLaborableDay.split(':'),
        hourStartLaborableDay = parseInt(timeStartLaborableDayArr[0]),
        minuteStartLaborableDay = parseInt(timeStartLaborableDayArr[1]),
        timeEndLaborableDayArr = endLaborableDay.split(':'),
        hourEndLaborableDay = parseInt(timeEndLaborableDayArr[0]),
        minuteEndLaborableDay = parseInt(timeEndLaborableDayArr[1]),
        startLaborDay = DateTimeLuxon.fromJSDate(new Date (dateFromPicker.setHours(hourStartLaborableDay,minuteStartLaborableDay))), 
        endLaborDay = DateTimeLuxon.fromJSDate(new Date (dateFromPicker.setHours(hourEndLaborableDay,minuteEndLaborableDay))),
        laborDay = new Array();

    //Ahora debera ir generando todo el horario de disponibilidad 
    //Una función While usando startService y endService y que vaya generando cadad 15 minutos 
    //Se introduce la hora inicial dentro del arreglo
    laborDay.push(startLaborDay);
    
    //console.log("El día laboral es: ");
    //Se recorre el horario agregandolo al arreglo 
    while (startLaborDay < endLaborDay){
        startLaborDay = startLaborDay.plus({
            minutes: 15 
        });
        //Arreglo del día laboral.
        laborDay.push(startLaborDay);
        
        //console.log(startLaborDay.hour + ':' + startLaborDay.minute);
    }
    
    //console.log(laborDay);
    
    return laborDay;
    
}

//Funcion generadora de la disponibilidad, considera la jornada laboral y los bloques de ocupacion
function availabilityScheduleMaker(laborDay, dateArrayJoin){
    const availabilityScheduleFix = new Array();
    availabilityScheduleFix.push(laborDay.filter( scheduleLD => !dateArrayJoin.map( scheduleDAJ => scheduleDAJ.toISO()).includes(scheduleLD.toISO())));
    console.log(availabilityScheduleFix);
        
    return availabilityScheduleFix;
}


//La función devolverá, únicamente las horas disponibles considerando el tiempo de servicio señalado por el usuario
function validateSchedule(serviceSelected, startServiceSelected, endServiceSelected, scheduledArray){
    //Validación de entradas
    if( typeof serviceSelected === 'undefined' ||
        typeof startServiceSelected === 'undefined' ||
        typeof endServiceSelected === 'undefined' || 
        typeof date === 'undefined')return;
    
    console.log(startServiceSelected);
    console.log(endServiceSelected);
    console.log(serviceSelected);
    
    let scheduledArraySort = scheduledArray.sort(), //Ordenamiento del horario en orden ascendente
        timeServiceArr = serviceSelected.split(':'),
        hourService = parseInt(timeServiceArr[0]),
        minuteService = parseInt(timeServiceArr[1]),
        durationService = Duration.fromObject({ hours: hourService, minutes: minuteService}), //Duración del servicio
        dateArr = new Array(), //Se crea el arreglo de fechas y horarios
        blockToAdd = new Array(),
        dateArrayJoin,
        dateFromPicker = date; //Toma la fecha de la variable global "date" y la guardamos en una nueva variable local
    
    //Al cargar el tiempo del servicio deberá ir validando
    //Aumentando de 15 en 15 minutos 
    
    //Comienza a recorrer el arreglo de horarios agendados
    for(let i=0; i<scheduledArraySort.length ; i++){
        let timeFromScheduled = scheduledArraySort[i], //Hora agendada del Staff
            timeArr = timeFromScheduled.split(':'), //Crea un arreglo separado por ":" de un string
            hour = parseInt(timeArr[0]), //Toma el primer elemento (horas) del arreglo, convirtiendo el agumento cadena [timeArr] en un entero. 
            minute = parseInt(timeArr[1]); //Toma el segundo elemento (minutos) del arreglo, convirtiendo el agumento cadena [timeArr] en un entero. 
            
        //Se va guardando en un nuevo arreglo "dateArr" cada horario ocupado del estaff
        dateArr.push(DateTimeLuxon.fromJSDate(new Date (dateFromPicker.setHours(hour,minute)))); //Juntamos la hora con la fecha y la convertimos a formato LUXON y la metemos al Arreglo DateArr
        
        //Valida que consideré el segundo miembro del arreglo
        if(typeof dateArr[1] === 'undefined')continue;
        
        let afterTime = dateArr[i], 
            beforeTime = dateArr[i-1];
        
        //Si el intervalo es mayor de 15 minutos, se debería de entrar en una validación del servicio
        //esto debido a que se encuentra un hueco.
        //Se compone de dos pasos: 
        // 1) El servicio cabe dentro del hueco
        // 2) Si cabe dentro del hueco debera de generar un bloque adicional para considerar ese espacio.
        interval = Interval.fromDateTimes(beforeTime, afterTime);
        
        if(interval.length('minutes') > 15 && durationService.as('minutes') <= interval.length('minutes')){
            console.log('intervalo mayor de 15 minutos y servicio menor o igual al hueco');
           
            //Agrega horas al bloque
            //Regresa la duración del servicio
            let afterTimeBlock = afterTime.minus({
               hours: durationService.hours,
               minutes: durationService.minutes
            });
            //Inicio del bloque
            console.log(afterTimeBlock.toLocaleString(afterTimeBlock.DATETIME)); //2) esto es, {16:00}
            //Fin del bloque
            console.log(afterTime.get('hour'));
            
            //Se agrega el elemento al bloque temporal
            blockToAdd.push(afterTimeBlock);
            //Se genera el bloque de 15 en 15 hasta el afterTIme.hour
            while (afterTimeBlock < afterTime){
                //Aumento de 15 en 15
                afterTimeBlock = afterTimeBlock.plus({
                   minutes: 15 
                });
                //Se agrega elementos al array blockToAdd
                blockToAdd.push(afterTimeBlock);                                       
            }
            //Elimina el último elemento del blockToAdd
            blockToAdd.pop();
            
            //junta los dos arreglos y los ordena 
            dateArrayJoin = dateArr.concat(blockToAdd).sort();
        }
    }
    
    //Función que genera todo el bloque completo del día
    //Debe tomar del inicio de la jornada laboral hasta el final
    let laborDay = laborDayMaker(startServiceSelected, endServiceSelected), 
        availabilitySchedule = availabilityScheduleMaker(laborDay, dateArrayJoin);
    
    
    return availabilitySchedule;
    
  }


function loadSelectedDay(e){
    //Valida si previamente se seleccionó el proveedor y el servicio
    if($selectSupplier.value !== "" && $selectService.value !== ""){
        //Valida si se click es sobre área del calendario
        if(e.target.matches(".calendar-day-hover")){
            let $daySelected = e.target.innerText ? e.target.innerText : "No hay día Seleccionado",
                $year = $selectYear.textContent,
                $month = $selectMonth.textContent;
                date = generateDate($year, $month, $daySelected); //Generamos la fecha en formato DAYOFWEEK MONTH DAY YEAR 00:00:00 TIMEZONE, que se puede manipular con métodos DATE     
           
            //console.log("La fecha es: " + date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate());
            
            //Se compará si el día seleccionado se encuentra dentro del rango de los días de servicios del proveedor            
            if( isValidateDay(data[0].Day , date.getDay()) ){
                //console.log("Día Válido");
                let supplier = $selectSupplier.selectedOptions[0].value ? $selectSupplier.selectedOptions[0].value : "No hay proveedor Seleccionado",
                    service = $selectService.selectedOptions[0].value ? $selectService.selectedOptions[0].value : "No hay servicio Seleccionado",
                    day = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
                
                //console.log("Proveedor seleccionado: " + supplier);
                //console.log("Servicio seleccionado: " + service);
                //console.log("Dia Seleccionado: " + day);               
                $selectStaff.innerHTML = "";
                //Carga la disponibilidad del día
                fetch(`models/booking.php?day=${day}&id_supplier=${supplier}&id_service=${service}`)
                    .then(res => res.ok ? res.json(): Promise.reject(res))
                    .then(json => {
                        //console.log(json);
                        //Carga opcion default
                        let $staffName,
                            $scheduleStaff,
                            scheduleArrDefault;
                        json.forEach(obj => {
                            for(const prop in obj){
                                if (obj.hasOwnProperty(prop)) {
                                    if(typeof obj[prop].staff_name === 'string'){
                                        //Carga los nombres del Staff en la lista $staffName
                                        $staffName += `<option value="${obj[prop].id_staff}">${obj[prop].staff_name}</option>`;
                                        //console.log(obj[0].ScheduleArray);
                                        //console.log(obj[prop].id_staff);
                                        //console.log(obj[prop].ScheduleArray);             
                                    } 
                                }
                            }
                        });
                        //Manda al DOM la lista del staff;
                        $selectStaff.innerHTML = $staffName;
                        
                        //Carga los horarios del 1er Staff por Default
                        scheduleArrDefault = json[0][0].ScheduleArray;
                        
                        //Valida tipos de datos
                        if(typeof LT_ServiceSelected !== 'undefined' && typeof Start_ServiceSelected !== 'undefined' && typeof End_ServiceSelected !== 'undefined'){
                            //funcion que valide el horario
                            scheduledArrDefaultSort = validateSchedule(LT_ServiceSelected, Start_ServiceSelected, End_ServiceSelected, scheduleArrDefault);
                            scheduledArrDefaultSort[0].forEach( schedule => {
                                //Se obtiene el formato de 24 hrs, ie. 13:00
                                schedule = schedule.toLocaleString(DateTimeLuxon.TIME_24_SIMPLE)
                                $scheduleStaff += `<option value="">${schedule}</option>`;
                            });      
                        }
                        
                        //Manda al DOM la lista de horarios
                        $selectAvailable.innerHTML = $scheduleStaff;
                        
                        
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



//Elimina el lapseTime del DOM, aunque la intención es agregar mas opciones si es necesario.
function clearOptions(){
    $ltService.innerHTML = '';
}

//Listener al Inicio, carga proveedores.
d.addEventListener("DOMContentLoaded",loadSupplier());

//Listener al cambiar el Proveedor, en consecuencia carga los servicios
$selectSupplier.addEventListener("change", e => {
    //Restablece todas las opciones a cero
    clearOptions();
    
    //Carga los servicios del proveedor seleccionado
    loadServices(e.target.value);
});

$selectService.addEventListener("change", e => {
   loadLapseTime(e);
});
    
//Listener al click, Valida y carga la disponibilidad del día.
$selectDay.addEventListener("click", e => loadSelectedDay(e));

//Listener al cambiar el staff, en consecuencia carga los horarios del miembro del staff
$selectStaff.addEventListener("change", e => {
    //Carga los horarios del staff seleccionado
    loadScheduleStaff(e);
});





