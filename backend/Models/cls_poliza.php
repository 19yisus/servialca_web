<?php
error_reporting(E_ERROR | E_PARSE);
include("./QR/qrlib.php");
require_once("cls_db.php");

abstract class cls_poliza extends cls_db
{
	protected $id, $sucursal, $usuario,
	// Contratante 
	$nombre, $apellido, $cedula, $fechaNacimiento, $telefono, $correo, $direccion,
	// Titular 
	$nombreTitular, $apellidoTitular, $cedulaTitular,
	// Vehiculo
	$placa, $puesto, $ano, $serialMotor, $serialCarroceria, $peso, $capacidad,
	// Vehiculo extra
	$color, $modelo, $marca, $uso, $clase, $tipo,
	// Contrato
	$fechaInicio, $fechaVencimiento, $tipoContrato,
	$tipoTransporte, $estado,
	$danoCosas, $danoPersonas, $fianza, $asistencia, $apov,
	$muerte, $invalidez, $medico, $grua,
	// Pago
	$metodoPago, $referencia, $cantidadDolar, $monto,
	// ID
	$vehiculo, $cliente, $precioDolar, $debitoCredito, $cobertura, $idTitular,
	$idColor, $idModelo, $idMarca,
	// Medico
	$edad, $fechaInicioMedico, $fechaVencimientoMedico, $sangre, $lente;



	protected function renovar()
	{
		if (empty($this->fechaInicio)) {
			$this->fechaInicio = date("Y-m-d");
		}
		if (empty($this->fechaVencimiento)) {
			$fechaInicioObj = new DateTime($this->fechaInicio);
			$fechaInicioObj->modify('+1 year');
			$this->fechaVencimiento = $fechaInicioObj->format('Y-m-d');
		}
		$sql = $this->db->prepare("UPDATE poliza SET
        poliza_fechaInicio = ?,
        poliza_fechaVencimiento = ?,
        poliza_renovacion = poliza_renovacion+1,
        debitoCredito =?
        WHERE poliza_if = ?");
		if (
			$sql->execute([
				$this->fechaInicio,
				$this->fechaVencimiento,
				$this->debitoCredito,
				$this->id
			])
		)
			;
	}

	protected function Vencer($id)
	{
		date_default_timezone_set('America/Caracas');
		$diaActual = date('Y-m-d'); // Obtener el día actual
		$diaCinco = date('Y-m-d', strtotime('+30 day')); // Obtener el quinto día 
		if ($id == 57) {
			$sql = $this->db->prepare("SELECT poliza.*, cliente.*, vehiculo.*, usuario.*, sucursal.*
            FROM poliza 
            INNER JOIN cliente ON cliente.cliente_id = poliza.cliente_id
            INNER JOIN sucursal ON sucursal.sucursal_id = poliza.sucursal_id
            INNER JOIN usuario ON usuario.usuario_id = poliza.usuario_id
            INNER JOIN vehiculo ON vehiculo.vehiculo_id = poliza.vehiculo_id
            WHERE poliza.poliza_fechaVencimiento > :diaActual AND 
            poliza.poliza_fechaVencimiento <= :diaCinco
            ORDER BY poliza.poliza_fechaVencimiento ASC");
		} else {
			$sql = $this->db->prepare("SELECT poliza.*, cliente.*, vehiculo.*, usuario.*, sucursal.*
            FROM poliza 
            INNER JOIN cliente ON cliente.cliente_id = poliza.cliente_id
            INNER JOIN sucursal ON sucursal.sucursal_id = poliza.sucursal_id
            INNER JOIN usuario ON usuario.usuario_id = poliza.usuario_id
            INNER JOIN vehiculo ON vehiculo.vehiculo_id = poliza.vehiculo_id
            WHERE usuario.usuario_id = :id AND 
            poliza.poliza_fechaVencimiento > :diaActual AND 
            poliza.poliza_fechaVencimiento <= :diaCinco
            ORDER BY poliza.poliza_fechaVencimiento ASC");
			$sql->bindParam(':id', $id, PDO::PARAM_INT);
		}
		$sql->bindParam(':diaActual', $diaActual, PDO::PARAM_STR);
		$sql->bindParam(':diaCinco', $diaCinco, PDO::PARAM_STR);
		if ($sql->execute()) {
			$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		} else {
			$resultado = [];
		}
		return $resultado;
	}

	protected function Save($dolar, $tipoIngreso, $motivo)
	{
		try {
			// INICIACMOS LA TRANSACCIÓN, TODO LO QUE SE EJECUTE APARTIR DE AHORA, ES PARTE DE LA TRANSACCIÓN
			// TODO CON EL OBJETO $THIS->DB;
			$this->db->beginTransaction();
			$result = $this->SearchByColor();
			// SI ESTA OPERACIÓN FALLA, SE HACE UN ROLLBACK PARA REVERTIR LOS CAMBIOS Y FINALIZAR LA OPERACIÓN
			if (!$result) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "Ocurrión un error en la transacción"
					],
					'code' => 400
				];
			}

			$result = $this->SearchByMarca();
			// SI ESTA OPERACIÓN FALLA, SE HACE UN ROLLBACK PARA REVERTIR LOS CAMBIOS Y FINALIZAR LA OPERACIÓN
			if (!$result) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "Ocurrión un error en la transacción"
					],
					'code' => 400
				];
			}

			$result = $this->SearchByModelo();
			// SI ESTA OPERACIÓN FALLA, SE HACE UN ROLLBACK PARA REVERTIR LOS CAMBIOS Y FINALIZAR LA OPERACIÓN
			if (!$result) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "Ocurrión un error en la transacción"
					],
					'code' => 400
				];
			}
			$result = $this->SearchByCliente();
			// SI ESTA OPERACIÓN FALLA, SE HACE UN ROLLBACK PARA REVERTIR LOS CAMBIOS Y FINALIZAR LA OPERACIÓN
			if (!$result) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "Ocurrión un error en la transacción"
					],
					'code' => 400
				];
			}
			$result = $this->SearchByTitular();
			// // SI ESTA OPERACIÓN FALLA, SE HACE UN ROLLBACK PARA REVERTIR LOS CAMBIOS Y FINALIZAR LA OPERACIÓN
			if (!$result) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "Ocurrión un error en la transacción"
					],
					'code' => 400
				];
			}

			$result = $this->SearchByVehiculo();

			$result = $this->precioDolar($dolar);
			// SI ESTA OPERACIÓN FALLA, SE HACE UN ROLLBACK PARA REVERTIR LOS CAMBIOS Y FINALIZAR LA OPERACIÓN
			if (!$result) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "Ocurrión un error en la transacción"
					],
					'code' => 400
				];
			}

			$result = $this->debitoCredito($tipoIngreso, $motivo);
			// SI ESTA OPERACIÓN FALLA, SE HACE UN ROLLBACK PARA REVERTIR LOS CAMBIOS Y FINALIZAR LA OPERACIÓN
			if (!$result) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "Ocurrión un error en la transacción"
					],
					'code' => 400
				];
			}

			$result = $this->RegistraCobertura();
			// SI ESTA OPERACIÓN FALLA, SE HACE UN ROLLBACK PARA REVERTIR LOS CAMBIOS Y FINALIZAR LA OPERACIÓN
			if (!$result) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "Ocurrión un error en la transacción"
					],
					'code' => 400
				];
			}

			// $this->cobertura = $this->db->lastInsertId();
			// $result = $this->db->query("SELECT * FROM poliza WHERE cliente_id = $this->cliente AND vehiculo_id = $this->vehiculo");
			// // SI ESTA OPERACIÓN FALLA, SE HACE UN ROLLBACK PARA REVERTIR LOS CAMBIOS Y FINALIZAR LA OPERACIÓN
			// if ($result->rowCount() > 0) {
			// 	$this->db->rollback();
			// 	return [
			// 		'data' => [
			// 			'res' => "El registro ha fallado, verifica que no hallas duplicado el usuario de alguien mas o tus datos sean correctos"
			// 		],
			// 		'code' => 400
			// 	];
			// }

			$result = $this->RegistrarPoliza();
			$this->id = $this->db->lastInsertId();
			$this->generarQR($this->id);
			// SI ESTA ULTIMA OPERACIÓN SALIÓ BIEN, SE HACE COMMIT PARA APLICAR LOS CAMBIOS
			if ($result) {
				$this->db->commit();
				return [
					'data' => [
						'res' => "Registro exitoso"
					],
					'code' => 200
				];
			}
			// SI NO SE REALIZÓ LA ULTIMA OPERACIÓN, SE REVIERTE ABSOLUTAMENTE TODO LO QUE YA SE HIZO EN LA DB
			$this->db->rollback();
			return [
				'data' => [
					'res' => "Registro fallida"
				],
				'code' => 400
			];
		} catch (PDOException $e) {
			return [
				"data" => [
					'res' => "Error de consulta: " . $e->getMessage()
				],
				"code" => 400
			];
		}
	}
	protected function Edit($idCliente, $idTitular, $idVehiculo)
	{
		try {
			$this->db->beginTransaction();
			$result = $this->editarCliente($idCliente);
			if (!$result) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "Ocurrión un error en la transacción"
					],
					'code' => 400
				];
			}
			$result = $this->editarTitular($idTitular);
			if (!$result) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "Ocurrión un error en la transacción"
					],
					'code' => 400
				];
			}
			$result = $this->editarVehiculo($idVehiculo);
			if (!$result) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "Ocurrión un error en la transacción"
					],
					'code' => 400
				];
			}
			if ($result) {
				$this->db->commit();
				return [
					'data' => [
						'res' => "Registro exitoso"
					],
					'code' => 200
				];
			}
			$this->db->rollback();
			return [
				'data' => [
					'res' => "Registro fallida"
				],
				'code' => 400
			];
		} catch (PDOException $e) {
			return [
				"data" => [
					'res' => "Error de consulta: " . $e->getMessage()
				],
				"code" => 400
			];
		}
	}
	protected $saveMedicoExecuted = false;

	protected function SaveMedico($dolar, $tipoIngreso, $motivo)
	{
		try {
			if (!$this->db->inTransaction()) {
				$this->db->beginTransaction();
			}

			$result = $this->SearchByCliente();
			// SI ESTA OPERACIÓN FALLA, SE HACE UN ROLLBACK PARA REVERTIR LOS CAMBIOS Y FINALIZAR LA OPERACIÓN
			if (!$result) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "Ocurrión un error en la transacción"
					],
					'code' => 400
				];
			}
			$result = $this->precioDolar($dolar);
			// SI ESTA OPERACIÓN FALLA, SE HACE UN ROLLBACK PARA REVERTIR LOS CAMBIOS Y FINALIZAR LA OPERACIÓN
			if (!$result) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "Ocurrión un error en la transacción"
					],
					'code' => 400
				];
			}
			$result = $this->debitoCredito($tipoIngreso, $motivo);
			// SI ESTA OPERACIÓN FALLA, SE HACE UN ROLLBACK PARA REVERTIR LOS CAMBIOS Y FINALIZAR LA OPERACIÓN
			if (!$result) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "Ocurrión un error en la transacción"
					],
					'code' => 400
				];
			}

			$result = $this->RegistrarCertificadoMedico();
			$this->id = $this->db->lastInsertId();
			if ($result) {
				$this->db->commit();
				$this->saveMedicoExecuted = true; // Marcar la función como ejecutada
				return [
					'data' => [
						'res' => "Registro exitoso"
					],
					'code' => 200
				];
			}
			$this->db->rollback();
			return [
				'data' => [
					'res' => "Registro fallido"
				],
				'code' => 400
			];
		} catch (PDOException $e) {
			return [
				'data' => [
					'res' => "Error de consulta: " . $e->getMessage()
				],
				'code' => 400
			];
		}
	}



	protected function RegistraCobertura()
	{

		$sql = $this->db->prepare("INSERT INTO coberturas(
			cobertura_danoCosas, cobertura_danoPersonas, cobertura_fianzaCuanti, cobertura_asistenciaLegal,
			cobertura_apov, cobertura_muerte, cobertura_invalidez, cobertura_gastosMedicos, cobertura_grua, totalPagar) 
			VALUES(?,?,?,?,?,?,?,?,?,?)");
		if (
			$sql->execute([
				$this->danoCosas,
				$this->danoPersonas,
				$this->fianza,
				$this->asistencia,
				$this->apov,
				$this->muerte,
				$this->invalidez,
				$this->medico,
				$this->grua,
				$this->monto
			])
		) {
			$this->cobertura = $this->db->lastInsertId();
		}
		return $this->cobertura;
	}

	protected function RegistrarPoliza()
	{
		$sql = $this->db->prepare("SELECT * FROM poliza WHERE cliente_id = ? AND vehiculo_id = ?");
		if ($sql->execute([$this->cliente, $this->vehiculo])) {
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
			if (!isset($resultado[0])) {
				$sql = $this->db->prepare("INSERT INTO poliza(cliente_id, titular_id, vehiculo_id, poliza_fechaInicio, poliza_fechaVencimiento,
				tipoContrato_id, estado_id,cobertura_id,poliza_renovacion,debitoCredito ) 
				VALUES(?,?,?,?,?,?,?,?,0,?)");
				$result = $sql->execute([
					$this->cliente,
					$this->idTitular,
					$this->vehiculo,
					$this->fechaInicio,
					$this->fechaVencimiento,
					$this->tipoContrato,
					$this->estado,
					$this->cobertura,
					$this->debitoCredito
				]);

				return $result;
			}
		}
	}

	protected function debitoCredito($tipoIngreso, $motivo)
	{
		date_default_timezone_set('America/Caracas');
		$fecha = date("Y-m-d");
		$hora = date("H:i:s");
		$sql = $this->db->prepare("INSERT INTO debitocredito(
            nota_IngresoEgreso,
            nota_motivo,
            nota_fecha,
            nota_hora,
            nota_tipoPago,
            nota_referencia,
            nota_monto,
            precioDolar_id,
            usuario_id,
            sucursal_id
        )VALUES(?,?,?,?,?,?,?,?,?,?)");
		if (
			$sql->execute([
				$tipoIngreso,
				$motivo,
				$fecha,
				$hora,
				$this->metodoPago,
				$this->referencia,
				$this->cantidadDolar = str_replace(',', '.', $this->cantidadDolar),
				$this->precioDolar,
				57,
				1
			])
		) {
			$this->debitoCredito = $this->db->lastInsertId();

		}
		return $this->debitoCredito;
	}

	protected function precioDolar($precio)
	{
		date_default_timezone_set('America/Caracas');
		$fecha = date("Y-m-d");
		$hora = date("H:i:s");
		$sql = $this->db->prepare("SELECT * FROM preciodolar WHERE dolar_monto = ? AND dolar_fecha = ?");
		if ($sql->execute([$precio, $fecha])) {
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
			if (isset($resultado[0]))
				$this->precioDolar = $resultado["dolar_id"];
			else {
				$sql = $this->db->prepare("INSERT INTO preciodolar(dolar_monto,dolar_hora,dolar_fecha) VALUES(?,?,?)");
				$sql->execute([$precio, $hora, $fecha]);
				$this->precioDolar = $this->db->lastInsertId();
			}
		}
		return $this->precioDolar;
	}

	protected function SearchByVehiculo()
	{
		$sql = $this->db->prepare("SELECT * FROM vehiculo WHERE vehiculo_placa = ?");
		if ($sql->execute([$this->placa])) {
			$rowCount = $sql->rowCount();
			if ($rowCount > 0) {
				$resultado = $sql->fetch(PDO::FETCH_ASSOC);
				$this->vehiculo = $resultado["vehiculo_id"];
			} else {
				$sql = $this->db->prepare("INSERT INTO vehiculo(
                    vehiculo_placa,
                    vehiculo_puesto,
                    vehiculo_año,
                    vehiculo_serialMotor,
                    vehiculo_serialCarroceria,
                    vehiculo_peso,
                    vehiculo_capTon,
                    color_id,
                    modelo_id,
                    marca_id,
                    uso_id,
                    clase_id,
                    tipo_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)");
				$sql->execute([
					$this->placa,
					$this->puesto,
					$this->ano,
					$this->serialMotor,
					$this->serialCarroceria,
					$this->peso = str_replace(',', '.', $this->peso),
					$this->capacidad = str_replace(',', '.', $this->capacidad),
					$this->idColor,
					$this->idModelo,
					$this->idMarca,
					$this->uso,
					$this->clase,
					$this->tipo
				]);
				$this->vehiculo = $this->db->lastInsertId();
			}
		} else
			return false;
		return $this->vehiculo;
	}

	protected function SearchByCliente()
	{
		$sql = $this->db->prepare("SELECT * FROM cliente WHERE cliente_cedula = ?");
		$sql->execute([$this->cedula]);
		$rowCount = $sql->rowCount();
		if ($rowCount > 0) {
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
			$this->cliente = $resultado["cliente_id"];
		} else {
			$sql = $this->db->prepare("INSERT INTO cliente(
            cliente_nombre, 
            cliente_apellido, 
            cliente_cedula, 
            cliente_fechaNacimiento, 
            cliente_telefono, 
            cliente_correo, 
            cliente_direccion) VALUES (?,?,?,?,?,?,?)");

			$sql->execute([
				$this->nombre,
				$this->apellido,
				$this->cedula,
				$this->fechaNacimiento,
				$this->telefono,
				$this->correo,
				$this->direccion
			]);

			$this->cliente = $this->db->lastInsertId();
		}

		return $this->cliente;
	}



	protected function SearchByModelo()
	{
		$sql = $this->db->prepare("SELECT * FROM modelo WHERE modelo_nombre = ?");
		if ($sql->execute([$this->modelo])) {
			$rowCount = $sql->rowCount();
			if ($rowCount > 0) {
				$resultado = $sql->fetch(PDO::FETCH_ASSOC);
				$this->idModelo = $resultado["modelo_id"];
			} else {
				$sql = $this->db->prepare("INSERT INTO modelo (modelo_nombre,modelo_estatus) VALUES(?,1)");
				$sql->execute([$this->modelo]);
				$this->idModelo = $this->db->lastInsertId();
			}
		} else
			false;
		return $this->idModelo;
	}

	protected function SearchByMarca()
	{
		$sql = $this->db->prepare("SELECT * FROM marca WHERE marca_nombre = ?");
		if ($sql->execute([$this->marca])) {
			$rowCount = $sql->rowCount();
			if ($rowCount > 0) {
				$resultado = $sql->fetch(PDO::FETCH_ASSOC);
				$this->idMarca = $resultado["marca_id"];
			} else {
				$sql = $this->db->prepare("INSERT INTO marca (marca_nombre,marca_estatus) VALUES(?,1)");
				$sql->execute([$this->marca]);
				$this->idMarca = $this->db->lastInsertId();
			}
		} else
			false;
		return $this->idMarca;
	}

	protected function SearchByColor()
	{
		$sql = $this->db->prepare("SELECT * FROM color WHERE color_nombre = ?");
		if ($sql->execute([$this->color])) {
			$rowCount = $sql->rowCount();
			if ($rowCount > 0) {
				$resultado = $sql->fetch(PDO::FETCH_ASSOC);
				$this->idColor = $resultado["color_id"];
			} else {
				$sql = $this->db->prepare("INSERT INTO color (color_nombre,color_estatus) VALUES(?,1)");
				$sql->execute([$this->color]);
				$this->idColor = $this->db->lastInsertId();
			}

		} else
			false;
		return $this->idColor;
	}

	protected function SearchByTitular()
	{
		$sql = $this->db->prepare("SELECT * FROM titular WHERE titular_cedula = ?");
		if ($sql->execute([$this->cedulaTitular])) {
			$rowCount = $sql->rowCount();
			if ($rowCount > 0) {
				$resultado = $sql->fetch(PDO::FETCH_ASSOC);
				$this->idTitular = $resultado["titular_id"];
			} else {
				$sql = $this->db->prepare("INSERT INTO titular(titular_cedula,titular_nombre,titular_apellido,titular_estatus) VALUES(?,?,?,1)");
				$sql->execute([
					$this->cedulaTitular,
					$this->nombreTitular,
					$this->apellidoTitular
				]);
				$this->idTitular = $this->db->lastInsertId();
			}
		} else {
			return false;
		}
		return $this->idTitular;
	}

	protected function GetAll($id)
	{
		if ($id == 57) {
			$sql = $this->db->prepare("SELECT poliza.*, cliente.*, sucursal.*, usuario.*, vehiculo.* FROM poliza 
				INNER JOIN cliente ON cliente.cliente_id = poliza.cliente_id
				INNER JOIN sucursal ON sucursal.sucursal_id = poliza.sucursal_id
				INNER JOIN usuario ON usuario.usuario_id = poliza.usuario_id
				INNER JOIN vehiculo ON vehiculo.vehiculo_id = poliza.vehiculo_id
				ORDER BY poliza_id DESC");
		} else {
			$sql = $this->db->prepare("SELECT poliza.*, cliente.*, sucursal.*, usuario.*, vehiculo.* FROM poliza 
				INNER JOIN cliente ON cliente.cliente_id = poliza.cliente_id
				INNER JOIN sucursal ON sucursal.sucursal_id = poliza.sucursal_id
				INNER JOIN usuario ON usuario.usuario_id = poliza.usuario_id
				INNER JOIN vehiculo ON vehiculo.vehiculo_id = poliza.vehiculo_id
				WHERE usuario.usuario_id = $id
				ORDER BY poliza_id DESC");
		}

		if ($sql->execute())
			$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		else
			$resultado = [];
		return $resultado;
	}

	public function GetOne($id)
	{
		$sql = $this->db->prepare("SELECT poliza.*,vehiculo.*, titular.*, cliente.*, marca.*, modelo.*, usovehiculo.*, color.*,tipovehiculo.*, usuario.*, clasevehiculo.*, 
        tipocontrato.*, usovehiculo.*,coberturas.*,debitocredito.* 
        FROM poliza 
        INNER JOIN vehiculo ON vehiculo.vehiculo_id = poliza.vehiculo_id
        INNER JOIN titular ON titular.titular_id = poliza.titular_id
        INNER JOIN cliente ON cliente.cliente_id = poliza.cliente_id
        INNER JOIN marca ON marca.marca_id = vehiculo.marca_id
        INNER JOIN modelo ON modelo.modelo_id = vehiculo.modelo_id
        INNER JOIN usovehiculo ON usovehiculo.usoVehiculo_id = vehiculo.uso_id
        INNER JOIN color ON color.color_id = vehiculo.color_id
        INNER JOIN tipovehiculo ON tipovehiculo.tipoVehiculo_id = vehiculo.tipo_id
        INNER JOIN usuario ON usuario.usuario_id = poliza.usuario_id
        INNER JOIN tipocontrato ON tipocontrato.contrato_id = poliza.tipoContrato_id
        INNER JOIN clasevehiculo ON clasevehiculo.clase_id = vehiculo.clase_id
        INNER JOIN coberturas ON coberturas.cobertura_id = poliza.cobertura_id
        INNER JOIN debitocredito ON debitocredito.nota_id = poliza.debitoCredito
        WHERE poliza_id = $id");
		if ($sql->execute()) {
			$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		} else {
			$resultado = [];
		}
		return $resultado;
	}



	// Editar
	protected function editarVehiculo($id)
	{
		$sql = $this->db->prepare("UPDATE vehiculo SET
		vehiculo_placa = ?,
		vehiculo_puesto = ?,
		vehiculo_año = ?,
		vehiculo_serialMotor = ?,
		vehiculo_serialCarroceria = ?,
		vehiculo_peso = ?,
		vehiculo_capTon =?,
		color_id = ?,
		modelo_id = ?,
		marca_id = ?,
		uso_id = ?,
		clase_id = ?,
		tipo_id = ?
		WHERE vehiculo_id = ?");
		if (
			$sql->execute([
				$this->placa,
				$this->puesto,
				$this->ano,
				$this->serialMotor,
				$this->serialCarroceria,
				$this->peso,
				$this->capacidad,
				$this->color,
				$this->modelo,
				$this->marca,
				$this->uso,
				$this->clase,
				$this->tipo,
				$id
			])
		) {
			return true;
		} else
			return false;
	}

	protected function editarTitular($id)
	{
		$sql = $this->db->prepare("UPDATE titular SET
		titular_cedula = ?,
		titular_nombre = ?,
		titular_apellido = ?
		WHERE titular_id = ?");
		if (
			$sql->execute([
				$this->cedulaTitular,
				$this->nombreTitular,
				$this->apellidoTitular,
				$id
			])
		) {
			return true;
		} else
			return false;
	}

	protected function editarCliente($id)
	{
		$sql = $this->db->prepare("UPDATE cliente SET
        cliente_cedula = ?,
        cliente_nombre = ?,
        cliente_apellido =?,
        cliente_fechaNacimiento = ?,
        cliente_telefono =?,
        cliente_correo =?,
        cliente_direccion = ?
        WHERE cliente_id = ?");
		if (
			$sql->execute([
				$this->cedula,
				$this->nombre,
				$this->apellido,
				$this->fechaNacimiento,
				$this->telefono,
				$this->correo,
				$this->direccion,
				$id
			])
		) {
			return true;
		} else
			return false;
	}

	protected function RegistrarCertificadoMedico()
	{
		// Obtener la fecha actual
		$fechaInicio = date('Y-m-d');
		// Calcular la fecha final (fecha actual + 5 años)
		$fechaFinal = date('Y-m-d', strtotime('+5 years'));
		$sql = $this->db->prepare("INSERT INTO medico (
		cliente_id,
        medico_edad, 
        medico_fechaInicio, 
        medico_fechaVencimiento, 
        medico_tipoSangre, 
        medico_lente,
		debitoCredito_id )
        VALUES(?, ?, ?, ?,?, ?,?)");
		if (
			$sql->execute([
				$this->cliente,
				$this->edad,
				$fechaInicio,
				$fechaFinal,
				$this->sangre,
				$this->lente,
				$this->debitoCredito
			])
		) {
			return $this->db->lastInsertId();
		}
	}

	protected function generarQR($id)
	{
		set_time_limit(30000);
		$sql = $this->db->prepare("SELECT
        poliza.*,
        cliente.*,
        vehiculo.*,
        marca.*,
        modelo.*
        FROM poliza
        INNER JOIN cliente ON cliente.cliente_id = poliza.cliente_id
        INNER JOIN vehiculo ON vehiculo.vehiculo_id = poliza.vehiculo_id
        INNER JOIN marca ON marca.marca_id = vehiculo.marca_id
        INNER JOIN modelo ON modelo.modelo_id = vehiculo.modelo_id
        WHERE poliza_id = ?");
		$sql->execute([$id]);
		$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);

		// Verifica si se encontró alguna póliza
		if (count($resultado) > 0) {
			$fila = $resultado[0]; // Obtén el primer resultado

			$contrato = "";
			if ($fila["poliza_renovacion"] < 10) {
				$contrato = "00000" . $fila["poliza_id"] . "-0" . $fila["poliza_renovacion"];
			} else {
				$contrato = "00000" . $fila["poliza_id"] . "-" . $fila["poliza_renovacion"];
			}

			$QR = "M° Contrato: " . $contrato .
				"\n" . "Vigente desde: " . $fila["poliza_fechaInicio"] .
				"\n" . "Vigente hasta: " . $fila["poliza_fechaVencimiento"] .
				"\n" . "Nombre: " . $fila["cliente_nombre"] .
				"\n" . "Apellido: " . $fila["cliente_apellido"] .
				"\n" . "Cédula: " . $fila["cliente_cedula"] .
				"\n" . "Placa del vehiculo" . $fila["vehiculo_placa"] .
				"\n" . "Marca: " . $fila["marca_nombre"] .
				"\n" . "Modelo: " . $fila["modelo_nombre"];

			$QRcodeImg = "./imagenesQr/" . $contrato . ".png";
			QRcode::png($QR, $QRcodeImg);
			$sql2 = $this->db->prepare("UPDATE poliza SET poliza_qr = ? WHERE poliza_id = ?");
			$sql2->execute([$QRcodeImg, $fila["poliza_id"]]);

			return $contrato;
		} else {
			// No se encontraron resultados para el ID de la póliza
			return false;
		}
	}

	public function reporteIngresoEgreso($notaIE, $idSu, $idU, $fechaInicio, $fechafinal){

		$sql = "SELECT * FROM poliza 
			INNER JOIN debitocredito ON poliza.debitoCredito = debitocredito.nota_id
			INNER JOIN coberturas ON poliza.cobertura_id = coberturas.cobertura_id
			INNER JOIN sucursal ON poliza.sucursal_id = sucursal.sucursal_id
			INNER JOIN usuario ON poliza.usuario_id = usuario.usuario_id 
			INNER JOIN tipocontrato ON tipocontrato.contrato_id = poliza.tipoContrato_id
			INNER JOIN cliente ON cliente.cliente_id = poliza.cliente_id
			WHERE poliza_fechaInicio BETWEEN $fechaInicio AND $fechafinal ";

		if($notaIE != "3"){
			$sql .= "AND debitocredito.nota_IngresoEgreso = $notaIE ";
		}else{
			$sql .= "AND debitocredito.nota_IngresoEgreso != '' ";
		}

		if($idSu != ""){
			$sql .= "AND sucursal.sucursal_id = $idSu ";
		}

		if($idU != ""){
			$sql .= "AND usuario.usuario_id = $idU ";
		}

		$result = $this->db->query($sql);

		if($result->RowCount() > 0)return $result->fetchAll(PDO::FETCH_ASSOC);
		else return [];
	}


}