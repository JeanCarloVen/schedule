<?php
//Se hace la consulta a la BDD para obtener a los proveedores
include_once '../config/db.php';

$pdo = new Database();
    
if($_SERVER['REQUEST_METHOD'] == 'GET'){
    if(isset($_GET['id']))
    {
        $query = "SELECT s.id, s.supplier_name FROM supplier AS s WHERE id=:id;";
        try{
            $sql = $pdo->prepare($query);
            $sql->bindValue(':id', $_GET['id']);
            $sql->execute();
            $sql->setFetchMode(PDO::FETCH_ASSOC);
            header("HTTP/1.1 200 hay datos");
            echo json_encode($sql->fetchAll());
        }catch(Exception $ex){
            handle_sql_errors($sql, $ex->getMessage());
        }
        exit;				
    } else {
        $query = "SELECT s.id AS id_Supplier, s.supplier_name AS Supplier_Name FROM supplier AS s;";
        try {
            $sql = $pdo->prepare($query);
            $sql->execute();
            $sql->setFetchMode(PDO::FETCH_ASSOC);
            header("HTTP/1.1 200 hay datos");
            echo json_encode($sql->fetchAll());
        } catch (Exception $exc) {
            handle_sql_errors($query, $error_message);
        }
        exit;		
    }

}


        

