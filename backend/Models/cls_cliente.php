<?php
require_once("cls_db.php");

abstract class cls_cliente extends cls_db
{
    public function __construct()
    {
        parent::__construct();
    }

    protected function cumpleañero()
    {
        $dia = date("d");
        $mes = date("m");
        $sql = $this->db->prepare("SELECT * FROM cliente 
        WHERE MONTH(cliente_fechaNacimiento) = :mes 
        AND DAY(cliente_fechaNacimiento) = :dia");
        $sql->bindParam(":mes", $mes, PDO::PARAM_INT);
        $sql->bindParam(":dia", $dia, PDO::PARAM_INT);
        if ($sql->execute()) {
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $resultado = [];
        }
        return $resultado;
    }

    protected function GetAll()
    {
        $sql = $this->db->prepare("SELECT * FROM cliente WHERE 
        cliente_nombre IS NOT NULL
        AND cliente_apellido IS NOT NULL
        AND cliente_cedula IS NOT NULL");
        if ($sql->execute()) {
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $resultado = [];
        }
        return $resultado;
    }

    protected function GetAllTitular(){
        $sql = $this->db->prepare("SELECT * FROM titular");
        if ($sql->execute()){
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        }else{
            $resultado = [];
        }
        return $resultado;
    }

}


?>