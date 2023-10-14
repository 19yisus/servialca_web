<?php
require_once("./Models/cls_medico.php");

class Con_medico extends cls_medico
{
    public function __construct()
    {
        parent::__construct();
        //ID 
        $this->cliente = isset($_POST["idCliente"]) ? $_POST["idCliente"] : null;
        $this->medico = isset($_POST["idMedico"]) ? $_POST["idMedico"] : null;
        $this->cobertura = isset($_POST["idCobertura"]) ? $_POST["idCobertura"] : null;
        $this->cedula = isset($_POST["Cedula"]) ? $_POST["Cedula"] : null;
        $this->nombre = isset($_POST["Nombre"]) ? $_POST["Nombre"] : null;
        $this->apellido = isset($_POST["Apellido"]) ? $_POST["Apellido"] : null;
        $this->fechaNacimiento = isset($_POST["fechaNacimiento"]) ? $_POST["fechaNacimiento"] : null;
        $this->edad = isset($_POST["Edad"]) ? $_POST["Edad"] : null;
        $this->sangre = isset($_POST["tipoSangre"]) ? $_POST["tipoSangre"] : null;
        $this->lente = isset($_POST["Lente"]) ? $_POST["Lente"] : null;
        $this->metodo = isset($_POST["metodoPago"]) ? $_POST["metodoPago"] : null;
        $this->refrencia = isset($_POST["Referencia"]) ? $_POST["Referencia"] : null;
    }

    public function Editar()
    {
        $resultado = $this->Edit();
        Response($resultado, 200);
    }

    public function ConsultarTodos()
    {
        $resultado = $this->GetAll();
        Response($resultado, 200);
    }

    public function ConsultarUno()
    {
        $resultado = $this->GetOne($_POST["ID"]);
        Response($resultado, 200);
    }

    public function SetImg()
    {
        // Verifica que se haya enviado un archivo
        if (isset($_FILES["Imagen"]) && $_FILES["Imagen"]["error"] === 0) {
            $imagenNombreOriginal = $_FILES["Imagen"]["name"];
            $imagenRutaTemporal = $_FILES["Imagen"]["tmp_name"];
            // Define la ubicación donde deseas guardar el archivo
            $rutaDestino = "fotosCliente/" . $imagenNombreOriginal;
            // Mueve el archivo temporal a la ubicación deseada
            if (move_uploaded_file($imagenRutaTemporal, $rutaDestino)) {
                $resultado = $this->SaveImg($rutaDestino);
                Response($resultado, 200);
            }
        }
    }
}
