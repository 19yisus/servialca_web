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
}
