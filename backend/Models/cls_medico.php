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
        $sql = $this->db->prepare("SELECT medico.*, cliente.*, usuario.*, sucursal.*
        FROM medico
        INNER JOIN cliente ON cliente.cliente_id = medico.cliente_id
        INNER JOIN usuario ON usuario.usuario_id = medico.usuario_id
        INNER JOIN sucursal ON sucursal.sucursal_id = medico.sucursal_id ORDER BY medico_id DESC");
        if ($sql->execute())
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        else
            $resultado = [];
        return $resultado;
    }
}