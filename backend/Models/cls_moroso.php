<?php
require_once("cls_db.php");

abstract class cls_moroso extends cls_db
{
    public function __construct()
    {
        parent::__construct();
    }

    protected function GetAll()
    {
        $sql = $this->db->prepare("SELECT moroso.*, poliza.*, cliente.*, vehiculo.* FROM moroso 
        INNER JOIN poliza on poliza.poliza_id = moroso.poliza_id
        INNER JOIN cliente on cliente.cliente_id = poliza.cliente_id
        INNER JOIN vehiculo on vehiculo.vehiculo_id = poliza.vehiculo_id");
        if ($sql->execute()) $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        else $resultado = [];
        return $resultado;
    }

    protected function GetAllUser()
    {
        $sql = $this->db->prepare("SELECT poliza.*, debitocredito.*, usuario.*, sucursal.*, morosoUsuario.* FROM morosoUsuario INNER JOIN poliza ON poliza.poliza_id = morosoUsuario.poliza_id
            INNER JOIN usuario ON usuario.usuario_id = poliza.usuario_id
            INNER JOIN sucursal ON sucursal.sucursal_id = poliza.sucursal_id
            INNER JOIN debitocredito ON debitocredito.nota_id = poliza.debitoCredito
            WHERE morosoU_estatus = 0");
    }
}
