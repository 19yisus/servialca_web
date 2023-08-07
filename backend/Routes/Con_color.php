<?php
require_once("./Models/cls_color.php");

class Con_color extends cls_color
{

<<<<<<< HEAD
    public function ConsultarTodos()
    {
        $resultado = $this->GetAll();
        Response($resultado, 200);
    }
}

=======
	public function ConsultarTodos()
	{
		$resultado = $this->GetAll();
		Response($resultado, 200);
	}
}
>>>>>>> 70525dad285d7ff7a2cb25f9b9aff632356bc29d
