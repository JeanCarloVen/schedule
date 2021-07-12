<?php
//Se hace la consulta a la BDD para obtener los proveedores
include_once '../config/db.php';

$pdo = new Database();
    
if($_SERVER['REQUEST_METHOD'] == 'GET'){
    if(isset($_GET['id_supplier']) && isset($_GET['id_service']) && isset($_GET['day']))
    {
        $sql = $pdo->prepare("SELECT * FROM booking WHERE id_supplier=:id_supplier AND id_service=:id_service AND day=:day");
        $sql->bindValue(':id_supplier', $_GET['id_supplier']);
        $sql->bindValue(':id_service', $_GET['id_service']);
        $sql->bindValue(':day', $_GET['day']);
        $sql->execute();
        $sql->setFetchMode(PDO::FETCH_ASSOC);
        header("HTTP/1.1 200 hay datos");
        echo json_encode($sql->fetchAll());
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