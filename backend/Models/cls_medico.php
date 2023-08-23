<?php
require_once("cls_db.php");

abstract class cls_medico extends cls_db
{
    public function __construct()
    {
        parent::__construct();
    }

    protected function GetAll()
    {
        $sql = $this->db->prepare("SELECT medico.*, cliente.*
        FROM medico
        INNER JOIN cliente ON cliente.cliente_id = medico.cliente_id");
        if ($sql->execute()) {
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $resultado = [];
        }
        return $resultado;
    }
    public function Reporte($id)
    {
        $sql = $this->db->prepare("SELECT medico.*, cliente.*
        FROM medico
        INNER JOIN cliente ON cliente.cliente_id = medico.cliente_id
        WHERE medico_id = ?");
        $sql->execute([$id]);
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }
}
?>