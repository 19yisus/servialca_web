<?php
require_once("./Models/cls_moroso.php");

class Con_moroso extends cls_moroso
{

    public function ConsultarTodos()
    {
        $resultado = $this->GetAll();
        Response($resultado, 200);
    }
}
