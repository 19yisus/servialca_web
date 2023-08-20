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
}