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
}

?>