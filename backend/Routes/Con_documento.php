<?php
require_once("./Models/cls_documento.php");

class Con_documento extends cls_documento
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
            $rutaDestino = "documentos/" . $imagenNombreOriginal;
            // Mueve el archivo temporal a la ubicación deseada
            if (move_uploaded_file($imagenRutaTemporal, $rutaDestino)) {
                $resultado = $this->SaveImg($rutaDestino);
                Response($resultado, 200);
            }
        }
    }
}

?>