<?php
require_once("./Models/cls_estado.php");

class Con_estado extends cls_estado
{

    public function ConsultarTodos()
    {
        $resultado = $this->GetAll();
        Response($resultado, 200);
    }
}

