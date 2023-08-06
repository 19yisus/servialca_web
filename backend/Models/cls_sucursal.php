<?php
require_once("cls_db.php");

abstract class cls_sucursal extends cls_db
{
    protected $nombre, $estatus;

    public function __construct()
    {
        parent::__construct();
        $this->nombre = $this->estatus = null;
    }

    protected function registrar()
    {
        echo "Registrar";
        // $this->db->prepare()
    }

    protected function update()
    {
        echo "Actualizar";
    }

    protected function eliminar()
    {
        echo "Eliminar";
    }

    protected function consultar()
    {
        echo "Consultar";
    }

    protected function consultar_todo()
    {
        echo "consultar todo";
    }
}
