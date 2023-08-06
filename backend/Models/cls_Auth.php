<?php
require_once("cls_db.php");

abstract class cls_Auth extends cls_db
{
  protected $cedula, $nombre;

  public function __construct()
  {
    parent::__construct();
    $this->cedula = $this->nombre = null;
  }

  protected function registrar()
  {
    echo "Registrar";
    // $this->db->prepare()
  }

  protected function update()
  {
    echo "Actualizar";
  }

  protected function eliminar()
  {
    echo "Eliminar";
  }

  protected function consultar()
  {
    echo "Consultar";
  }

  protected function consultar_todo()
  {
    echo "consultar todo";
  }
}
