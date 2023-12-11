<?php

require_once("./Models/cls_poliza.php");

class Con_poliza extends cls_poliza
{
    public function __construct()
    {
        parent::__construct();
        //ID
        $this->cliente = isset($_POST["idCliente"]) ? $_POST["idCliente"] : null;
        $this->idTitular = isset($_POST["idTitular"]) ? $_POST["idTitular"] : null;
        $this->idColor = isset($_POST["idColor"]) ? $_POST["idColor"] : null;
        $this->vehiculo = isset($_POST["idVehiculo"]) ? $_POST["idVehiculo"] : null;
        $this->debitoCredito = isset($_POST["idCobertura"]) ? $_POST["idCobertura"] : null;
        $this->id = isset($_POST["ID"]) ? $_POST["ID"] : null;
        $this->sucursal = isset($_POST["Sucursal"]) ? $_POST["Sucursal"] : null;
        $this->usuario = isset($_POST["Usuario"]) ? $_POST["Usuario"] : null;
        // Contratante
        $this->nombre = isset($_POST["Nombre"]) ? $_POST["Nombre"] : null;
        $this->apellido = isset($_POST["Apellido"]) ? $_POST["Apellido"] : null;
        $this->cedula = isset($_POST["Cedula"]) ? $_POST["Cedula"] : null;
        $this->fechaNacimiento = isset($_POST["fechaNacimiento"]) ? $_POST["fechaNacimiento"] : null;
        $this->telefono = isset($_POST["Telefono"]) ? $_POST["Telefono"] : null;
        $this->correo = isset($_POST["Correo"]) ? $_POST["Correo"] : null;
        $this->direccion = isset($_POST["Direccion"]) ? $_POST["Direccion"] : null;
        // Titular
        $this->cedulaTitular = isset($_POST["cedulaTitular"]) ? $_POST["cedulaTitular"] : null;
        $this->nombreTitular = isset($_POST["nombreTitular"]) ? $_POST["nombreTitular"] : null;
        $this->apellidoTitular = isset($_POST["apellidoTitular"]) ? $_POST["apellidoTitular"] : null;
        // Vehiculo
        $this->placa = isset($_POST["Placa"]) ? $_POST["Placa"] : null;
        $this->puesto = isset($_POST["Puesto"]) ? $_POST["Puesto"] : null;
        $this->ano = isset($_POST["Ano"]) ? $_POST["Ano"] : null;
        $this->serialMotor = isset($_POST["serialMotor"]) ? $_POST["serialMotor"] : null;
        $this->serialCarroceria = isset($_POST["serialCarroceria"]) ? $_POST["serialCarroceria"] : null;
        $this->peso = isset($_POST["Peso"]) ? $_POST["Peso"] : null;
        $this->capacidad = isset($_POST["Capacidad"]) ? $_POST["Capacidad"] : null;
        $this->color = isset($_POST["Color"]) ? $_POST["Color"] : null;
        $this->modelo = isset($_POST["Modelo"]) ? $_POST["Modelo"] : null;
        $this->marca = isset($_POST["Marca"]) ? $_POST["Marca"] : null;
        $this->uso = isset($_POST["Uso"]) ? $_POST["Uso"] : null;
        $this->clase = isset($_POST["Clase"]) ? $_POST["Clase"] : null;
        $this->tipo = isset($_POST["Tipo"]) ? $_POST["Tipo"] : null;
        // Contrato
        $this->fechaInicio = isset($_POST["fechaInicio"]) ? $_POST["fechaInicio"] : null;
        $this->fechaVencimiento = isset($_POST["fechaVencimiento"]) ? $_POST["fechaVencimiento"] : null;
        $this->tipoContrato = isset($_POST["tipoContrato"]) ? $_POST["tipoContrato"] : null;
        $this->estado = isset($_POST["Estado"]) ? $_POST["Estado"] : null;
        $this->danoCosas = isset($_POST["danoCosas"]) ? $_POST["danoCosas"] : null;
        $this->danoPersonas = isset($_POST["danoPersonas"]) ? $_POST["danoPersonas"] : null;
        $this->fianza = isset($_POST["Fianza"]) ? $_POST["Fianza"] : null;
        $this->apov = isset($_POST["Apov"]) ? $_POST["Apov"] : null;
        $this->muerte = isset($_POST["Muerte"]) ? $_POST["Muerte"] : null;
        $this->invalidez = isset($_POST["Invalidez"]) ? $_POST["Invalidez"] : null;
        $this->medico = isset($_POST["Medico"]) ? $_POST["Medico"] : null;
        $this->grua = isset($_POST["Grua"]) ? $_POST["Grua"] : null;
        //Cobertura
        $this->danoCosas = isset($_POST["danoCosas"]) ? $_POST["danoCosas"] : null;
        $this->danoPersonas = isset($_POST["danoPersonas"]) ? $_POST["danoPersonas"] : null;
        $this->fianza = isset($_POST["fianza"]) ? $_POST["fianza"] : null;
        $this->asistencia = isset($_POST["asistencia"]) ? $_POST["asistencia"] : null;
        $this->apov = isset($_POST["apov"]) ? $_POST["apov"] : null;
        $this->muerte = isset($_POST["muerte"]) ? $_POST["muerte"] : null;
        $this->invalidez = isset($_POST["invalidez"]) ? $_POST["invalidez"] : null;
        $this->medico = isset($_POST["medico"]) ? $_POST["medico"] : null;
        $this->grua = isset($_POST["grua"]) ? $_POST["grua"] : null;
        $this->monto = isset($_POST["monto"]) ? $_POST["monto"] : null;
        // Pago
        $this->metodoPago = isset($_POST["metodoPago"]) ? $_POST["metodoPago"] : null;
        $this->referencia = isset($_POST["Referencia"]) ? $_POST["Referencia"] : null;
        $this->cantidadDolar = isset($_POST["cantidadDolar"]) ? $_POST["cantidadDolar"] : null;
        $this->monto = isset($_POST["Monto"]) ? $_POST["Monto"] : null;
        // medico
        $this->edad = isset($_POST["Edad"]) ? $_POST["Edad"] : null;
        $this->sangre = isset($_POST["tipoSangre"]) ? $_POST["tipoSangre"] : null;
        $this->lente = isset($_POST["Lente"]) ? $_POST["Lente"] : null;
        $this->cliente = isset($_POST["idCliente"]) ? $_POST["idCliente"] : null;
        $this->idTitular = isset($_POST["idTitular"]) ? $_POST["idTitular"] : null;
        $this->vehiculo = isset($_POST["idVehiculo"]) ? $_POST["idVehiculo"] : null;
        //Licencia
        $this->correoLicencia = isset($_POST["correoLicencia"]) ? $_POST["correoLicencia"] : null;
        $this->licencia = isset($_POST["Licencia"]) ? $_POST["Licencia"] : null;
        $this->licenciaRestante = isset($_POST["licenciaRestante"]) ? $_POST["licenciaRestante"] : null;
        $this->montoTotal = isset($_POST["montoTotal"]) ? $_POST["montoTotal"] : null;
        $this->abonado = isset($_POST["Abonado"]) ? $_POST["Abonado"] : null;
        $this->restante = isset($_POST["Restante"]) ? $_POST["Restante"] : null;
    }

    public function registrar()
    {

        $resultado = $this->Save($_POST["precioDolar"], 1, "RCV");
        Response($resultado['data'], $resultado['code']);
    }
    public function registrarCertificado()
    {
        $resultado = $this->SaveMedico($_POST["precioDolar"], 1, "Seguro");
        Response($resultado['data'], $resultado['code']);
    }

    public function registrarLicencia()
    {
        $resultado = $this->SaveLicencia($_POST["precioDolar"], 1, "Licencia");
        Response($resultado["data"], $resultado["code"]);
    }

    public function editar()
    {
        $resultado = $this->Edit();
        Response($resultado['data'], $resultado['code']);
    }

    public function renovar()
    {
        $resultado = $this->renovar_poliza($_POST["precioDolar"], 1, "Renovación");
        Response($resultado['data'], $resultado['code']);
    }

    public function encontrarContrato()
    {
        $resultado = $this->findContrato();
        Response($resultado['data'], $resultado['code']);
    }
    public function ConsultarUno()
    {
        $resultado = $this->GetOne($_GET['ID']);
        Response($resultado, 200);
    }

    public function ConsultarTodos()
    {
        $resultado = $this->GetAll($_POST['ID']);
        Response($resultado, 200);
    }

    public function ConsultarVencer()
    {
        $resultado = $this->Vencer($_POST['ID'],$_POST["Desde"],$_POST["Hasta"]);
        Response($resultado, 200);
    }

    public function Semanal()
    {
        $resultado = $this->consultaSemanal($_POST["Desde"], $_POST["Hasta"]);
        Response($resultado, 200);
    }

    public function ConsultarContrato(){
        $resultado = $this->findContrato();
        Response($resultado, 200);
    }

    public function ConsultarEncargado(){
        $resultado = $this->GetAllEncargado($_POST["Sucursal"],$_POST["Desde"],$_POST["Hasta"]);
        Response($resultado,200);
    }
}
