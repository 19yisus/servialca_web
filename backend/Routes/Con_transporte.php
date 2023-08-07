<?php
require_once("./Models/cls_transporte.php");

class Con_transporte extends cls_transporte
{
	public function __construct()
	{
		parent::__construct();
		$this->id = isset($_POST["ID"]) ? $_POST["ID"] : null;
		$this->nombre = isset($_POST["Nombre"]) ? $_POST["Nombre"] : null;
		$this->estatus = isset($_POST["Estatus"]) ? $_POST["Estatus"] : null;
	}

	public function registrar()
	{
		$resultado = $this->Save();
		Response($resultado["data"], $resultado["code"]);
	}

	public function actualizar()
	{
		$resultado = $this->update();
		Response($resultado["data"], $resultado["code"]);
	}

	public function eliminar()
	{
		$resultado = $this->Delete();
		Response($resultado["data"], $resultado["code"]);
	}

	public function ConsultarUno()
	{
		$resultado = $this->GetOne($_GET['ID']);
		Response($resultado, 200);
	}

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
