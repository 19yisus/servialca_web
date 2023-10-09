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

    if (isset($_FILES["carrusel_1"])) {
      $item = $_FILES["carrusel_1"];

      if ($item["tmp_name"] != "") {
        $tmp_name = $item["tmp_name"];
        $fechaHoraActual = date("YmdHis");
        $name = $fechaHoraActual . "_(" . $i . ")_" . basename($item["name"]);
        move_uploaded_file($tmp_name, "Img/$name");
        array_push($img_files_name, ["name" => $name, "tag" => "carrusel_1"]);
        $this->reg_file_info($_POST, $img_files_name);
        $i++;
      }
    }
  }
  public function Guardar(){
    $resultado = $this->Save($_POST);
    // fsdfsdf
    Response($resultado['data'], $resultado['code']);
  }
}
