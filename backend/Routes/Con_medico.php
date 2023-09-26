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