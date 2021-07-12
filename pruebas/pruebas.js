const d = document,
        $selectPrimary = d.getElementById("select-supplier"),
        $selectSecondary = d.getElementById("select-service");


//d.addEventListener("DOMContentLoaded",loadSupplier());

//$selectPrimary.addEventListener("change", e =>loadServices(e.target.value));

let dias_laborables = ["lun","mar","mie", "jue", "vie", "sab", "dom"],
        lunes = [30, 20, 50, 80, 120, 60, 30],
        mostrar_horarios = ["enteras", "medias", "cuartas"],
        lunes_horarios_ocupados_inicio = ["9:30", "10:00", "12:00"],
        lunes_horarios_ocupados_fin = ["10:00", "11:00", "13:00"],
        total_ocupado = 0,
        dia_cliente = "lun",
        duracion_de_servicio = 45,
        horario_inicio_servicio = 12,
        minuto_inicio_servicio = 30,
        horario_fin_servicio = 15,
        hora_inicio_establecimiento = 8,
        minuto_inicio_establecimiento = 0,
        hora_fin_establecimiento = 20;
        
        
//function validateWorkDay(dia_cliente, lunes, total_ocupado, duracion_de_cita, hora_fin_establecimiento){
//    
//}

//Convertidor de formato de hora ej. "9:30" a hora : 9 y minuto : 30



//El objetivo es ver la disponibilidad de la hora en la que se quiere hacer la cita, mostrará la lista de horarios disponibles:
//Lo mostrará al cliente en horas enteras, medias o cuartas.
//ej.   9:00 - 10:00
//      10:00 - 11:00
//      11:00 - 12:00

//Para mostrar se tiene que usar <select> y las options serán dinámicas de acuerdo al numero de entrdas del arreglo de JSON

//El cliente selecciona la tienda y el servicio

//Al seleccionar la tienda se solicitan los servicios que esta ofrece a la BDD.
//Al seleccionar el servicio esto producirá que se cargen los servicios del día actual
//Después se podrá seleccionar el día siguiente o cualquier otro en el calendario 

//El comportamiento por Default será el día actual
//Entonces al seleccionar el servicio:
// function selectedServiceByDay(current_day = DATE(NOW)){
//      solicita al servidor las citas del día actual
//      el servidor responde con un arreglo JSON con las citas del día
//      se muestran en el select solo los horarios disponibles
//      ej. 9:00 - 10:00
//          12:00 - 13:00
//          13:00 - 14:00
//          14:00 - 15:00
//          17:00 - 18:00
//}
      
//El objetivo será seleccionar el horario disponible 
//Suponemos que la cita sera:
// a) a las 10:00 
//      -con una duración de 1 hora
//      -con una duración de 15 minutos
// b) a las 15:00
//      -con una duracion de 2 horas
//      -con una duración de 30 minutos


//Estructura
// 1) Valida el día sea laborable, sino return => function validateDay(){}
// 2) Valida disponibilidad de tiempo del día de acuerdo al tiempo necesario del servicio=> function validateTimeDay(){}
// 3) Valida disponibilidad de la hora específica => function validateHour(){}


//Validación para guardar en la bdd el día seleccionado desde el front
dias_laborables.forEach( dia => {
    console.log(dia);
    if(dia_cliente === dia){
        console.log(`Si se labora el ${dia}`);
        //Se valida el espacio disponible del dias
        //calculo del total_ocupado 
        lunes.forEach(duracion => {
            total_ocupado += duracion;
        });        

        //console.log(total_ocupado);
        //Validación del tiempo de servicio en el día seleccionado
        if(duracion_de_servicio < total_ocupado){
            //Realiza la inserción en el horario seleccionado por el cliente
            //fetch(xxx.php).then().then.catch()
            
        }
        else{
            console.log("No hay tiempo disponible ese día");
        }
    }
    
});

        