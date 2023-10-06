<?php
require_once("./Models/cls_panel.php");

class Con_panel extends cls_panel
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

  public function SetImgAll(){
      $i = 0;
      foreach($_FILES as $key => $item){
        if($item['tmp_name'] != ""){
          $tmp_name = $item["tmp_name"];
          $fechaHoraActual = date('YmdHis');
          $name = $fechaHoraActual."_($i)_".basename($item["name"]);

          move_uploaded_file($tmp_name,"Img/$name");
          $i++;
          return $name;
        }
      }


  }


  public function SetImg()
  {
      // Verifica que se haya enviado un archivo
      if (isset($_FILES["Imagen"]) && $_FILES["Imagen"]["error"] === 0) {
          $imagenNombreOriginal = $_FILES["Imagen"]["name"];
          $imagenRutaTemporal = $_FILES["Imagen"]["tmp_name"];
          // Define la ubicación donde deseas guardar el archivo
          $rutaDestino = "Img/" . $imagenNombreOriginal;
          // Mueve el archivo temporal a la ubicación deseada
          if (move_uploaded_file($imagenRutaTemporal, $rutaDestino)) {
              $resultado = $this->SaveImg($rutaDestino);
              Response($resultado, 200);
          }
      }
  }
}
