<?php
require_once("./Models/cls_medico.php");

class Con_medico extends cls_medico
{
    public function __construct()
    {
        parent::__construct();
    }

    public function ConsultarTodos()
    {
        $resultado = $this->GetAll();
        Response($resultado, 200);
    }

    public function SetImg()
    {
        $imagenNombreOriginal = $_FILES["Imagen"]["name"];
        $imagenRutaTemporal = $_FILES["Imagen"]["tmp_name"];
        $rutaDestino = "fotosCliente/" . $imagenNombreOriginal;
        if (move_uploaded_file($imagenRutaTemporal, $rutaDestino)) {
            $resultado = $this->SaveImg($rutaDestino, $_POST["ID"]);
            Response($resultado, 200);
        }
    }

}