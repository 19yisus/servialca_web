<?php
require_once("./Models/cls_tipo_vehiculo.php");

class Con_tipo_vehiculo extends cls_tipo_vehiculo
{
	public function __construct()
	{
		parent::__construct();
		$this->id = isset($_POST["ID"]) ? $_POST["ID"] : null;
		$this->nombre = isset($_POST["tipoVehiculo_nombre"]) ? $_POST["tipoVehiculo_nombre"] : null;
		$this->precio = isset($_POST["precio"]) ? $_POST["precio"] : null;
		$this->idContrato = isset($_POST["idContrato"]) ? $_POST["idContrato"] : null;
		$this->estatus = isset($_POST["Estatus"]) ? $_POST["Estatus"] : null;
		$this->sucursal = isset($_POST["Sucursal"]) ? $_POST["Sucursal"] : null;
	}

	public function registrar()
	{
		$resultado = $this->Save();
		Response($resultado["data"], $resultado["code"]);
	}

	public function precio()
	{
		$resultado = $this->savePrecio();
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

	public function ConsultarTodos()
	{
		$resultado = $this->GetAll($_GET["Sucursal"]);
		Response($resultado, 200);
	}

	public function ConsultarTipoVehiculo()
	{
		$resultado = $this->SearchByID($_GET["ID"],$_GET["sucursal"]);
		Response($resultado, 200);
	}

	public function EliminarPrecio(){
		$resultado = $this->DeletePrecio($_POST["ID_precio"]);
		Response($resultado, 200);
	}

	public function ConsultarPrecio()
	{
		$resultado = $this->SearchByPrecio($_POST["Contrato"], $_POST["Tipo"], $_POST["Sucursal"]);
		Response($resultado, 200);
	}
}