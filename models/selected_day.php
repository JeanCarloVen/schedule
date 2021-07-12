<?php
//Conexión a la BDD
include_once '../config/db.php';

//Instancia del objeto pdo
$pdo = new Database();
    
if($_SERVER['REQUEST_METHOD'] == 'GET'){
    if(isset($_GET['day']))
    {
        $sql = $pdo->prepare("SELECT * FROM booking WHERE id_supplier=:id_supplier");
        $sql->bindValue(':id_supplier', $_GET['id_supplier']);
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