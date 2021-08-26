<?php
//Se hace la consulta a la BDD para obtener los proveedores
include_once '../config/db.php';

//Intancia de la librería PDO
$pdo = new Database();

//Función que realiza una copia del array original y sirvirá para obtener los arreglos únicos
$array_copy = array();
Function duplicateArray($array){
   foreach($array as $data){
       unset($data['DateBooked_Start']);
       unset($data['DateBooked_End']);
       $array_copy[] = $data;
   }
   return $array_copy;
}

//Función que elimina arreglos duplicados, dejando sólo un arreglo multidimensional
function super_unique($array)
{
  $result = array_map("unserialize", array_unique(array_map("serialize", $array)));

  foreach ($result as $key => $value)
  {
    if ( is_array($value) )
    {
      $result[$key] = super_unique($value);
    }
  }
  return $result;
}

function reindexMultiArrayByIdStaff($multiarray){
    //Sustituye la llave con el valor que se encuentra dentro del arreglo
    foreach ($multiarray as $key => $value){
        $multiarray[$value[0]] = $multiarray[$key];
        unset($multiarray[$key]);
        unset($multiarray[$value[0]][0]);
    }
    return $multiarray;
}

//Función generadora de arreglos con llave del id_staff
function joinArrays($uniqueArrays, $availability){
    
    //Availability debe de entrar a la función con el id_staff como key
    $sortLenghtSchedule = count($uniqueArrays);
    $sortLenghtUnique = count($availability);
    
    if($sortLenghtSchedule !== $sortLenghtUnique) return;

    foreach($uniqueArrays as $key => $value){
        //Sustituye la llave con el valor que se encuentra dentro del arreglo
        $uniqueArrays[$value['id_staff']] = $uniqueArrays[$key];
        
        //Elimina el arreglo con la llave anterior
        unset($uniqueArrays[$key]);    
    }    
    
    
    //Se unen cuando las llaves son las mismas
    foreach($uniqueArrays as $key => $value){
        $jointArrays[] = array_merge($uniqueArrays[$key], $availability[$key]);
    }
    
    //Retorna la union de las matrices
    return $jointArrays;
}

//Funcion generadora de horarios únicos
function getScheduleByStaff($multiArray){
    //Creación de arreglos secundarios que toma elementos de $array
    $arrayIdStaff = array_column($multiArray, 'id_staff');
    $arrayDbStart = array_column($multiArray, 'DateBooked_Start');
    $arrayDbEnd = array_column($multiArray, 'DateBooked_End');
    
    //Creación del arreglo principal que integra a a los secundarios
    $joinArrays = array_map(null, $arrayIdStaff, $arrayDbStart, $arrayDbEnd );
    
    $length = count($joinArrays);
    //Mecanismo de validación de horarios.
    //Compara horario actual con el previo y en caso de ser igual los une en una sola entrada, de lo contrario lo deja intacto
    for($index=1; $index<$length; $index++){
        $array1 = $joinArrays[$index][0];
        $array2 = $joinArrays[$index-1][0];
        if($array1 == $array2 ){
            //Une el array actual con el anterior
            $merge = array_merge($joinArrays[$index], $joinArrays[$index-1]);

            //Elimina entradas repetidas (Aquí convierte el string id_staff a un int
            $merge = array_keys(array_flip($merge));

            //Dado que array_keys convierte a int es necesario regresarlo a String
            $merge[0] = strval(reset($merge));

            //Une al arreglo principal
            $joinArrays[$index] = $merge;

            //Elimina la entrada previa del arreglo principal
            unset($joinArrays[$index-1]);
        }
    }
    return $joinArrays;
}

function reIndex($array){
        //Reindexación de los arrays, para evitar tener index con saltos
        $reIndex = array_values($array);
    return $reIndex;
}


//Función generadora de horario del staff
Function makeSchedule($typeTime, $id_staff, $start_wd, $end_wd){
    //Definición de Variables
    $begin_wd = new DateTime($start_wd);
    $finish_wd = new DateTime($end_wd);
    
    //Es necesario agregarle 30 minutos porque al generar los intervalos lo elimina el último registro
    $finish_wd = $finish_wd->modify('+ 30 minute');
    
    //Intervalo de medias para el horario
    if($typeTime == 'isHalfTime'){
        //Definición del intervalo para los horarios
        $interval = DateInterval::createFromDateString('30minute');
        // Periodo del día de trabajo
        $period_wd = new DatePeriod($begin_wd, $interval, $finish_wd);
        
        $schedule[] = $id_staff;    
        //Generación del horario del día considerando el inicio y termino del día laboral
        foreach ($period_wd as $dt) {
            $schedule[] = $dt->format("H:i");

        }
        
    }
    
    //Devuelve el horario disponible por miembro del Staff
    return $schedule;
};

function makeSchedulesArrays($multiArray, $typeTime){
    foreach($multiArray as $key => $value){
        $start_wd = $value['Start_Wd'];
        $end_wd = $value['End_Wd'];
        $id_staff = $value['id_staff'];
        //Se obtiene el horario completo por cada miembro del Staff
        $schedule[] = makeSchedule($typeTime, $id_staff, $start_wd, $end_wd);
    }
    //Devuelve el horario laboral de cada miembro del staff en un multiarray
    return $schedule;
}


//Función que realiza la diferencia sobre los el horario laboral y lo agendado
function availability($scheduleArray, $scheduledArray ){
    $keysSchedule = array_keys($scheduleArray);
    
    foreach($scheduleArray as $key => $value){
        $availability[] = array_diff($scheduleArray[$key], $scheduledArray[$key]);
    }
    
    //Sustituye la llave con el valor que se encuentra dentro del arreglo
    foreach ($availability as $key => $value){
        $availability[$keysSchedule[$key]] = $availability[$key];
        unset($availability[$key]);
    }
    
    //Devuelve la disponibilidad por cada miembro del staff con el id_staff como key del arreglo
    return $availability;
}
    
//Consulta a la BDD, para obtener los datos de la agenda del día deseado.
if($_SERVER['REQUEST_METHOD'] == 'GET'){
    if( isset($_GET['day']) && isset($_GET['id_supplier']) && isset($_GET['id_service']))
    {
        $query = "SELECT b.dateBooked, b.working_day, time_format(b.dateBooked_start, '%H:%i') AS DateBooked_Start, time_format(b.dateBooked_end, '%H:%i') AS DateBooked_End, "
                . "s.lapse_time, sup.id, sup.code_supplier, sup.supplier_name, st.id AS id_staff, st.staff_name, s.id, s.id_supplier, s.service_name, "
                . "wd.id_working_days, time_format(wd.start_wd, '%H:%i') AS Start_Wd, time_format(wd.end_wd, '%H:%i') AS End_Wd "
                . "FROM service_staff AS ss "
                . "INNER JOIN booking AS b ON b.id_service_staff = ss.id "
                . "INNER JOIN service AS s ON s.id = ss.id_service "
                . "INNER JOIN supplier AS sup ON sup.id = s.id_supplier "
                . "INNER JOIN staff AS st ON st.id = ss.id_staff "
                . "INNER JOIN working_days_schedule_staff AS wd ON wd.id_staff = st.id "
                . "WHERE b.dateBooked =:day AND b.status ='ACT' AND sup.id=:id_supplier AND s.id=:id_service "
                . "GROUP BY b.id, b.dateBooked_start "
                . "ORDER BY st.id ASC, b.dateBooked_start ASC;";
        $sql = $pdo->prepare($query);
        $sql->bindValue(':day', $_GET['day'], PDO::PARAM_STR);
        $sql->bindValue(':id_supplier', $_GET['id_supplier'], PDO::PARAM_INT);
        $sql->bindValue(':id_service', $_GET['id_service'], PDO::PARAM_INT);
        $sql->execute();
        $sql->setFetchMode(PDO::FETCH_ASSOC);
        header("HTTP/1.1 200 hay datos");
        //Convertidor de ocupación a disponibilidad
        $arr[] = $sql->fetchAll();
        
        //Unique Arrays
        //Duplicación del array original y eliminación del Start y el End
        $cleanArray = duplicateArray($arr[0]);
        
        //Arreglo de entradas únicas con orden sobre id_Staff ascendente [1,2,3...]
        $getUniqueArrays = super_unique($cleanArray);
        
        //Reindexación del arreglo, dado el nuevo orden los indices son [0,1,2,...], respetando el id_staff
        $reindexUniqueArrays = reIndex($getUniqueArrays);
        
        //Schedule Arrays
        //Obtener arreglo de schedule por cada miembro del staff con orden del sobre id_staff ascendente [1,2,3,...]
        $getSchedule = getScheduleByStaff($arr[0]);
        
        //Reindexación del arreglo, dado el nuevo orden los indices son [0,1,2,...] respetando el id_staff
        $reindexSchedule = reIndex($getSchedule);
        
        //Reindexador por Id_staff el Schedule (Lo agendado)
        $reindexByStaff = reindexMultiArrayByIdStaff($reindexSchedule);
        
        //Obtiene disponibilidad 
        $typeTime = 'isHalfTime';
        
        //Obtiene los horarios laborales por cada miembro del staff en un arreglo de dos dimensiones, respendanto el id_staff [0,1,2,3,...]
        $scheduleArrays = makeSchedulesArrays($reindexUniqueArrays, $typeTime);
        
        //Reindexador por Id_staff el horario laboral 
        $reIndexScheduleByStaff = reindexMultiArrayByIdStaff($scheduleArrays);
        
        //Obtiene la Disponibilidad por cada miembro del staff, cada arreglo debe venir con el id_staff en el horario
        $availability = availability($reIndexScheduleByStaff, $reindexByStaff);
        
        //Join Arrays: Junta los Arrays Unicos con los arrays de Disponibilidad
        $staffArrays = joinArrays($reindexUniqueArrays, $availability);
        
        
        //Información General del Proveedor y Servicio
        $generalInfo = array(
                "Date_Booked" => $arr[0][0]['dateBooked'],
                "Working_Day" =>  $arr[0][0]['working_day'],
                "Service" => $arr[0][0]['service_name'],
                "Available_Time_General" => 'Tiempo General'
        );
        
        $general = array(
            "General_Info" => $generalInfo
        );
        
        
        
        //Formación del arreglo 
        $res[] = array_merge($general, $staffArrays);
        
        //header('Content-Type: application/json');
        echo json_encode($res);
        exit;				
    } else {
        $sql = $pdo->prepare("SELECT * FROM booking");
        $sql->execute();
        $sql->setFetchMode(PDO::FETCH_ASSOC);
        header("HTTP/1.1 200 hay datos");
        echo json_encode($sql->fetchAll());
        exit;		
    }
}