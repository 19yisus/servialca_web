<?php
require_once("./Models/cls_color.php");

class Con_color extends cls_color
{

    public function ConsultarTodos()
    {
        $resultado = $this->GetAll();
        Response($resultado, 200);
    }
}


	public function ConsultarTodos()
	{
		$resultado = $this->GetAll();
		Response($resultado, 200);
	}
}

