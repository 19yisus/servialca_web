<?php
require_once("./Models/cls_cliente.php");
class Con_cliente extends cls_cliente
{
    public function __construct()
    {
        parent::__construct();
    }

    public function Cumple()
    {
        $resultado = $this->cumpleanero();
        Response($resultado, 200);
    }

    public function ConsultarTodos()
    {
        $resultado = $this->GetAll();
        Response($resultado, 200);
    }

    public function ConsultarTodosTitular()
    {
        $resultado = $this->GetAllTitular();
        Response($resultado, 200);
    }

    public function consultarCedulaCliente()
    {
        $resultado = $this->consultarByCedula($_POST['cedula']);
        Response($resultado["data"], $resultado['code']);
    }

    public function consultarCedulaTitular()
    {
        $resultado = $this->consultarByDedulaTitular($_POST['cedula']);
        Response($resultado["data"], $resultado['code']);
    }
}
