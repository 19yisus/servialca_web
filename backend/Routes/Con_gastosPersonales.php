<?php
require_once("./Models/cls_gastosPersonales.php");

class Con_gastosPersonales extends cls_gastosPersonales
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
