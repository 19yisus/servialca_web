<?php
require_once("./Models/cls_hotel.php");

class Con_hotel extends cls_hotel
{

    public function __construct()
    {
        parent::__construct();
        $this->id = isset($_POST["ID"]) ? $_POST["ID"] : null;
        $this->cedula = isset($_POST["Cedula"]) ? $_POST["Cedula"] : null;
        $this->nombre_cliente = isset($_POST["Nombre"]) ? $_POST["Nombre"] : null;
        $this->apellido_cliente = isset($_POST["Apellido"]) ? $_POST["Apellido"] : null;
        $this->placa = isset($_POST["Placa"]) ? $_POST["Placa"] : null;
        $this->modelo = isset($_POST["Modelo"]) ? $_POST["Modelo"] : null;
        $this->color = isset($_POST["Color"]) ? $_POST["Color"] : null;
        $this->habitacion = isset($_POST["Habitacion"]) ? $_POST["Habitacion"] : null;
        $this->horaSalida = isset($_POST["horaSalida"]) ? $_POST["horaSalida"] : null;
        $this->observacion = isset($_POST["Observacion"]) ? $_POST["Observacion"] : null;
    }


    public function registrar()
    {
        $resultado = $this->save();
        Response($resultado, 200);
    }

    public function consultarOcupados()
    {
        $resultado = $this->GetOcup();
        Response($resultado, 200);
    }

    public function ConsultarTodos()
    {
        $resultado = $this->GetAll();
        Response($resultado, 200);
    }

    public function ConsultarHabitaciones()
    {
        $resultado = $this->GetRooms();
        Response($resultado, 200);
    }

    public function registrarObser()
    {
        if (isset($_FILES["Foto"]) && $_FILES["Foto"]["error"] == 0) {
            $imagenNombreOriginal = $_FILES["Foto"]["name"];
            $imagenRutaTemporal = $_FILES["Foto"]["tmp_name"];
            $rutaDestino = "fotosHotel/" . $imagenNombreOriginal;
            if (move_uploaded_file($imagenRutaTemporal, $rutaDestino)) {
                $this->foto = $rutaDestino;
            }
        }
        $resultado = $this->SaveObs();
        Response($resultado, 200);
    }

    public function HabilitarHabit()
    {
        $resultado = $this->HabiLib();
        Response($resultado, 200);
    }

    public function ConsultarUno()
    {
        $resultado = $this->GetOne($_POST["ID"]);
        Response($resultado, 200);
    }
}
