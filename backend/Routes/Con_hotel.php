<?php
require_once("./Models/cls_hotel.php");

class Con_hotel extends cls_hotel
{

    public function __construct()
    {
        parent::__construct();
        $this->cedula = isset($_POST["Cedula"]) ? $_POST["Cedula"] : null;
        $this->placa = isset($_POST["Placa"]) ? $_POST["Placa"] : null;
        $this->habitacion = isset($_POST["Habitacion"]) ? $_POST["Habitacion"] : null;
    }


    public function registrar()
    {
        $resultado = $this->save();
        Response($resultado, 200);
    }

    public function ConsultarTodos()
    {
        $resultado = $this->GetAll();
        Response($resultado, 200);
    }
}
