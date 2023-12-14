<?php
require_once("./Models/cls_hotel.php");

class Con_hotel extends cls_hotel
{

    public function __construct()
    {
        parent::__construct();
        $this->cedula = isset($_POST["Cedula"]) ? $_POST["Cedula"] : null;
        $this->nombre_cliente = isset($_POST["Nombre"]) ? $_POST["Nombre"] : null;
        $this->apellido_cliente = isset($_POST["Apellido"]) ? $_POST["Apellido"] : null;
        $this->placa = isset($_POST["Placa"]) ? $_POST["Placa"] : null;
        $this->modelo = isset($_POST["Modelo"]) ? $_POST["Modelo"] : null;
        $this->color = isset($_POST["Color"]) ? $_POST["Color"] : null;
        $this->habitacion = isset($_POST["Habitacion"]) ? $_POST["Habitacion"] : null;
        $this->horaSalida = isset($_POST["horaSalida"]) ? $_POST["horaSalida"] : null;
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
