<?php
require_once("./Models/cls_sucursal.php");

class Con_proveedor extends cls_sucursal
{
    public function __construct()
    {
        parent::__construct();
    }

    public function registrar()
    {
        echo "Registrar";
        // $this->nombre = $_POST['nombre'];
        // $this->estatus = $_POST['estatus'];
        // $this->registrar();
    }

    public function update()
    {
        echo "Actualizar";
    }

    public function eliminar()
    {
        echo "Eliminar";
    }

    public function consultar()
    {
        echo "Consultar";
        // $_GET['nombre'];
    }

    public function consultar_todo()
    {
        echo "consultar todo";
    }
}
