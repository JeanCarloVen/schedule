<?php
//Se hace la consulta a la BDD para obtener los proveedores
//Conexión a la BDD
include_once '../config/db.php';
//Instancia de la Clase 
$pdo = new Database();

//Manejador de errores
function handle_sql_errors($query, $error_message)
{
    echo '<pre>';
    echo $query;
    echo '</pre>';
    echo $error_message;
    die;
}

//Validación de la petición    
if($_SERVER['REQUEST_METHOD'] == 'GET'){
    //validación del supplier
    if(isset($_GET['id_supplier']))
    {
        $query = "SELECT s.id AS ID_Supplier, s.code_supplier AS COD_Supplier, ser.id AS ID_Service, ser.code_service AS COD_Service, ser.service_name AS Service_Name , ser.lapse_time AS LT_Service, wds.start_wd AS Start, wds.end_wd AS End, wd.days AS Day
        FROM supplier AS s
        INNER JOIN service AS ser ON s.id = ser.id_supplier
        INNER JOIN working_days_schedule_supplier AS wds ON s.id = wds.id_supplier
        INNER JOIN working_days AS wd ON wds.id_working_days = wd.id
        WHERE s.id =:id_supplier;";
        
        //Validación de consulta
        try {
            $sql = $pdo->prepare($query);
            $sql->bindValue(':id_supplier', $_GET['id_supplier']);
            $sql->execute();
            $sql->setFetchMode(PDO::FETCH_ASSOC);
            header("HTTP/1.1 200 hay datos");
            $res = $sql->fetchAll();
            echo json_encode($res);
        } catch (Exception $ex) {
            handle_sql_errors($sql, $ex->getMessage());
        }
        exit;				
    } else {
        $query = "SELECT * FROM service";
        //Validación de la consulta
        try {
            $sql = $pdo->prepare($query);
            $sql->execute();
            $sql->setFetchMode(PDO::FETCH_ASSOC);
            header("HTTP/1.1 200 hay datos");
            $res = $sql->fetchAll();
            echo json_encode($res);
        } catch (Exception $ex) {
            handle_sql_errors($sql, $ex->getMessage());
        }
        exit;		
    }
}