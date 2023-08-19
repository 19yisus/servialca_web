<?php
require_once("./Models/cls_proveedor.php");

class Con_proveedor extends cls_proveedor
{
	public function __construct()
	{
		parent::__construct();
	}

	public function registrar()
	{
		echo "Registrar";
		// $this->cedula = $_POST['cedula'];
		// $this->nombre = $_POST['nombre'];
		// $this->registrar();
	}

	public function update()
	{
		echo "Actualizar";
	}

	public function eliminar()
	{
		echo "Eliminar";
	}

	public function consultar()
	{
		echo "Consultar";
		// $_GET['cedula'];
	}

	public function consultar_todo()
	{
		echo "consultar todo";
	}
}
