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

  public function SetAndSaveImages()
  {
    $img_files_name = [];
    $i = 0;
    foreach ($_FILES as $fieldName => $fileInfo) {
      if ($fileInfo["tmp_name"] != "") {
        $tmp_name = $fileInfo["tmp_name"];
        $fechaHoraActual = date("YmdHis");
        $name = $fechaHoraActual . "_(" . $i . ")_" . basename($fileInfo["name"]);
        move_uploaded_file($tmp_name, "ImgPanel/$name");
        array_push($img_files_name, ["name" => $name, "tag" => $fieldName]);
        $i++;
      }
    }
  }
}
