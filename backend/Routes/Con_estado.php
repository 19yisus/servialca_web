<?php
require_once("./Models/cls_estado.php");

class Con_estado extends cls_estado
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
