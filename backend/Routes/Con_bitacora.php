<?php
require_once("./Models/cls_bitacora.php");

class Con_bitacora extends cls_bitacora
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
