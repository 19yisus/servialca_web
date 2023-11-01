<?php
date_default_timezone_set("America/Caracas");
error_reporting(E_ERROR | E_PARSE);

require("./QR/qrlib.php");
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
		$edad, $fechaInicioMedico, $fechaVencimientoMedico, $sangre, $lente,
		//Licencia
		$correoLicencia, $licencia, $licenciaRestante, $montoTotal, $abonado, $restante;


	protected function renovar_poliza($dolar, $tipoIngreso, $motivo)
	{
		if (empty($this->fechaNacimiento)) {
			$this->fechaNacimiento = "0000-00-00";
		}
		if (empty($this->fechaInicio)) {
			$this->fechaInicio = date("Y-m-d");
		}
		if (empty($this->fechaVencimiento)) {
			$fechaInicioObj = new DateTime($this->fechaInicio);
			$fechaInicioObj->modify('+1 year');
			$this->fechaVencimiento = $fechaInicioObj->format('Y-m-d');
		} else {
			$fechaVenicimiento = strtotime($this->fechaVencimiento);
			$fechaActual = strtotime(date("Y-m-d"));
			if ($fechaActual > $fechaVenicimiento) {
				return [
					'data' => [
						'res' => "No es posible renovar, aun no se vence el contrato"
					],
					'code' => 400
				];
			} else {
			}
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
					'res' => "Ocurrión un error en la transacción",
					"code" => 200
				],
				'code' => 400
			];
		}
		$fechaInicio = new DateTime(); // Fecha actual
		$fechaVencimiento = new DateTime();
		$fechaVencimiento->add(new DateInterval('P1Y')); // Sumar 1 año
		// Formatear las fechas en el formato deseado
		$this->fechaInicio = $fechaInicio->format('Y-m-d');
		$this->fechaVencimiento = $fechaVencimiento->format('Y-m-d');
		$sql = $this->db->prepare("UPDATE poliza SET
		poliza_fechaInicio = ?,
		poliza_fechaVencimiento = ?,
        poliza_renovacion = poliza_renovacion+1,
        debitoCredito =?
        WHERE poliza_id = ?");
		$sql->execute([
			$this->fechaInicio,
			$this->fechaVencimiento,
			$this->debitoCredito,
			$this->id
		]);

		if ($sql->rowCount() > 0) {
			return [
				'data' => [
					'res' => "Contrato renovado",
					"code" => 200,
					'id' => $this->id // Agregar el ID en la respuesta
				],
				'code' => 200
			];
		} else {
			return [
				'data' => [
					'res' => "Hubo un problema en renovacion"
				],
				'code' => 400
			];
		}
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
			$result = $this->Security();
			if ($result) {
				return $result;
			}
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
			$result = $this->SearchByUso();
			if (!$result) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "Ocurrión un error en la transacción"
					],
					'code' => 400
				];
			}
			$result = $this->SearchByClase();
			if (!$result) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "Ocurrión un error en la transacción"
					],
					'code' => 400
				];
			}
			$result = $this->SearchByTipo();
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

			$this->cobertura = $this->db->lastInsertId();
			$result = $this->db->query("SELECT * FROM poliza WHERE cliente_id = $this->cliente AND vehiculo_id = $this->vehiculo");
			// SI ESTA OPERACIÓN FALLA, SE HACE UN ROLLBACK PARA REVERTIR LOS CAMBIOS Y FINALIZAR LA OPERACIÓN
			if ($result->rowCount() > 0) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "El registro ha fallado, verifica que no hallas duplicado el usuario de alguien mas o tus datos sean correctos"
					],
					'code' => 400
				];
			}
			$this->SearchbyContrato();
			$this->SearchByUsuario();
			$this->SearchBySucursal();
			$result = $this->RegistrarPoliza();
			$this->id = $this->db->lastInsertId();
			$this->generarQR($this->id);
			// SI ESTA ULTIMA OPERACIÓN SALIÓ BIEN, SE HACE COMMIT PARA APLICAR LOS CAMBIOS
			if ($result) {
				$this->db->commit();
				return [
					'data' => [
						'res' => "Registro exitoso",
						"code" => "200",
						'id' => $this->id // Agregar el ID en la respuesta
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
	protected function Edit()
	{
		try {
			$this->db->beginTransaction();
			$result = $this->editarCliente($this->cliente);
			if (!$result) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "Ocurrión un error en la transacción"
					],
					'code' => 400
				];
			}
			$result = $this->editarTitular($this->idTitular);
			if (!$result) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "Ocurrión un error en la transacción"
					],
					'code' => 400
				];
			}
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
			$result = $this->SearchByUso();
			if (!$result) {
				$this->db->rollback();
				return [
					"data" => [
						"res" => "Ocurrio un error en la transacción"
					],
					"code" => 400
				];
			}
			$result = $this->SearchByClase();
			if (!$result) {
				$this->db->rollback();
				return [
					"data" => [
						"res" => "Ocurrio un error en la transacción"
					],
					"code" => 400
				];
			}
			$result = $this->SearchByTipo();
			if (!$result) {
				$this->db->rollback();
				return [
					"data" => [
						"res" => "Ocurrio un error en la transacción"
					],
					"code" => 400
				];
			}
			$result = $this->editarDebito($this->debitoCredito);
			if (!$result) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "Ocurrión un error en la transacción"
					],
					'code' => 400
				];
			}
			$result = $this->editarVehiculo($this->vehiculo);
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
						'res' => "Contrato editado",
						"code" => 200,
						'id' => $this->id // Agregar el ID en la respuesta
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
			$result = $this->SecurityMedico();
			if ($result) {
				return $result;
			}
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
			$this->SearchByUsuario();
			$this->SearchBySucursal();
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
						'res' => "Registro exitoso",
						"code" => 200,
						"id" => $this->id
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

	protected function SaveLicencia($dolar, $tipoIngreso, $motivo)
	{
		try {
			if (empty($this->fechaNacimiento)) {
				$this->fechaNacimiento = "0000-00-00";
			}
			if (!$this->db->inTransaction()) {
				$this->db->beginTransaction();
			}

			// $result = $this->SecurityLicencia();
			// if (!$result) {
			// 	$this->db->rollback();
			// 	return [
			// 		'data' => [
			// 			'res' => "Ocurrión un error en la transacción cliente"
			// 		],
			// 		'code' => 400
			// 	];
			// }
			$result = $this->SearchByCliente();
			// SI ESTA OPERACIÓN FALLA, SE HACE UN ROLLBACK PARA REVERTIR LOS CAMBIOS Y FINALIZAR LA OPERACIÓN
			if (!$result) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "Ocurrión un error en la transacción",
						"code" => 400
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
						'res' => "Ocurrión un error en la transacción",
						"code" => 400
					],
					'code' => 400
				];
			}
			$this->SearchByUsuario();
			$this->SearchBySucursal();
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

			$result = $this->RegistrarLicenciaConducir();
			$this->id = $this->db->lastInsertId();
			if ($result) {
				$this->db->commit();
				$this->saveMedicoExecuted = true; // Marcar la función como ejecutada
				return [
					'data' => [
						'res' => "Registro exitoso",
						"code" => 200,
						"id" => $this->id
					],
					'code' => 200
				];
			}
			$this->db->rollback();
			return [
				'data' => [
					'res' => "Registro fallido",
					"code" => 400
				],
				'code' => 400
			];
		} catch (PDOException $e) {
			return [
				'data' => [
					'res' => "Error de consulta: " . $e->getMessage(),
					"code" => 400
				],
				'code' => 400
			];
		}
	}


	protected function RegistrarLicenciaConducir()
	{
		if ($this->abonado == "" || $this->abonado == null) {
			$abonado = 0;
		} else {
			$abonado = $this->abonado;
		}
		$sql = $this->db->prepare("INSERT INTO licencia(
			cliente_id,
			licencia_correo,
			licencia_sangre,
			licencia_lente,
			licencia_licencia,
			licencia_montoTotal,
			licencia_abonado,
			licencia_restante,
			sucursal_id,
			usuario_id
		)values(?,?,?,?,?,?,?,?,?,?)");
		if (
			$sql->execute([
				$this->cliente,
				$this->correoLicencia,
				$this->sangre,
				$this->lente,
				$this->licencia,
				$this->montoTotal,
				$abonado,
				$this->restante,
				$this->sucursal,
				$this->usuario
			])
		) {
			return $this->db->lastInsertId();
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
				tipoContrato_id, estado_id,usuario_id,sucursal_id,cobertura_id,poliza_renovacion,debitoCredito ) 
				VALUES(?,?,?,?,?,?,?,?,?,?,0,?)");
				$result = $sql->execute([
					$this->cliente,
					$this->idTitular,
					$this->vehiculo,
					$this->fechaInicio,
					$this->fechaVencimiento,
					$this->tipoContrato,
					$this->estado,
					$this->usuario,
					$this->sucursal,
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
				$this->usuario,
				$this->sucursal
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
	protected function SearchByUso()
	{
		$sql = $this->db->prepare("SELECT * FROM usoVehiculo 
		WHERE usoVehiculo_nombre = ?");
		$sql->execute([$this->uso]);
		$resultado = $sql->fetch(PDO::FETCH_ASSOC);
		return $this->uso = $resultado["usoVehiculo_id"];
	}

	protected function SearchByClase()
	{
		$sql = $this->db->prepare("SELECT * FROM clasevehiculo 
		WHERE clase_nombre = ?");
		$sql->execute([$this->clase]);
		$resultado = $sql->fetch(PDO::FETCH_ASSOC);
		return $this->clase = $resultado["claseVehiculo_id"];
	}
	protected function SearchByTipo()
	{
		$sql = $this->db->prepare("SELECT * FROM tipovehiculo
		WHERE tipoVehiculo_nombre = ?");
		$sql->execute([$this->tipo]);
		$resultado = $sql->fetch(PDO::FETCH_ASSOC);
		return $this->tipo = $resultado["tipoVehiculo_id"];
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
	protected function SearchbyContrato()
	{
		$sql = $this->db->prepare("SELECT * FROM tipocontrato WHERE contrato_nombre = ?");
		$sql->execute([$this->tipoContrato]);
		$resultado = $sql->fetch(PDO::FETCH_ASSOC);
		$this->tipoContrato = $resultado["contrato_id"];
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

	protected function SearchByUsuario()
	{
		$sql = $this->db->prepare("SELECT * FROM usuario WHERE usuario_usuario = ?");
		if ($sql->execute([$this->usuario])) {
			$rowCount = $sql->rowCount();
			if ($rowCount > 0) {
				$resultado = $sql->fetch(PDO::FETCH_ASSOC);
				$this->usuario = $resultado["usuario_id"];
			}
		}
		return $this->usuario;
	}

	protected function SearchBySucursal()
	{
		$sql = $this->db->prepare("SELECT * FROM sucursal WHERE sucursal_nombre = ?");
		if ($sql->execute([$this->sucursal])) {
			$rowCount = $sql->rowCount();
			if ($rowCount > 0) {
				$resultado = $sql->fetch(PDO::FETCH_ASSOC);
				$this->sucursal = $resultado["sucursal_id"];
			}
		}
		return $this->sucursal;
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
        tipocontrato.*, usovehiculo.*,coberturas.*,debitocredito.*, sucursal.* 
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
        INNER JOIN clasevehiculo ON clasevehiculo.claseVehiculo_id = vehiculo.clase_id
        INNER JOIN coberturas ON coberturas.cobertura_id = poliza.cobertura_id
        INNER JOIN debitocredito ON debitocredito.nota_id = poliza.debitoCredito
		INNER JOIN sucursal on sucursal.sucursal_id = poliza.sucursal_id
        WHERE poliza.poliza_id = $id");
		if ($sql->execute()) {
			$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		} else {
			$resultado = [];
		}
		return $resultado;
	}
	protected function editarDebito($id)
	{
		$sql = $this->db->prepare("UPDATE debitocredito SET
		nota_referencia = ?,
		nota_tipoPago = ?,
		nota_monto =? 
		WHERE nota_id = ?");
		$sql->execute([
			$this->referencia,
			$this->metodoPago,
			$this->cantidadDolar,
			$id
		]);
		return true;
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
				$this->idColor,
				$this->idModelo,
				$this->idMarca,
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
		debitoCredito_id)
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

	public function generarQr($id)
	{
		set_time_limit(30000);
		// URL de la página a la que deseas redirigir
		$paginaWeb = "https://servialcarcv.com/servialca2/Controlador/reporteRCVWEB.php?ID=5608";

		$QRcodeImg = "../Controlador/ImgQr/" . $id . ".png";
		QRcode::png($paginaWeb, $QRcodeImg);

		$sql2 = $this->db->prepare("UPDATE poliza SET poliza_qr = ? WHERE poliza_id = ?");
		$sql2->execute([$QRcodeImg, $id]);
	}
	public function reporteIngresoEgreso($notaIE, $idSu, $idU, $fechaInicio, $fechaFinal)
	{
		// Consulta SQL con marcadores de posición
		$sql = "SELECT * FROM poliza WHERE poliza_fechaInicio BETWEEN :fechaInicio AND :fechaFinal ";

		// Arreglo de parámetros para la consulta preparada
		$params = array(
			':fechaInicio' => $fechaInicio,
			':fechaFinal' => $fechaFinal
		);


		// Preparar la consulta
		$stmt = $this->db->prepare($sql);

		// Ejecutar la consulta con los parámetros
		$stmt->execute($params);

		// Verificar si se encontraron resultados
		if ($stmt->rowCount() > 0) {
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} else {
			return [];
		}
	}

	public function Reporte($data, $desde, $hasta)
	{
		$resultado = null;
		$sql = $this->db->prepare("SELECT * FROM usuario WHERE usuario_nombre = ?");
		$sql->execute([$data]);
		$usuario = $sql->fetchAll(PDO::FETCH_ASSOC);
		if (!empty($usuario)) {
			$resultado = $usuario;
		} else {
			$sql = $this->db->prepare("SELECT * FROM usuario WHERE usuario_usuario = ?");
			$sql->execute([$data]);
			$usuario = $sql->fetchAll(PDO::FETCH_ASSOC);
			$resultado = $usuario;
		}

		if (!empty($resultado)) {
			$usuarioID = isset($resultado[0]["usuario_id"]) ? $resultado[0]["usuario_id"] : null;
			// $sucursalID = isset($resultado[0]["sucursal_id"]) ? $resultado[0]["sucursal_id"] : null;
			$sql = $this->db->prepare("SELECT poliza.*, usuario.*, sucursal.*, cliente.*, tipocontrato.*, vehiculo.*, usovehiculo.*, clasevehiculo.*, color.*,
            modelo.*, marca.*, tipovehiculo.*, debitocredito.* , coberturas.*, roles.*
            FROM poliza
            INNER JOIN sucursal ON sucursal.sucursal_id = poliza.sucursal_id
            INNER JOIN cliente ON cliente.cliente_id = poliza.cliente_id
            INNER JOIN usuario ON usuario.usuario_id = poliza.usuario_id
            INNER JOIN roles ON roles.roles_id = usuario.roles_id
            INNER JOIN tipocontrato ON tipocontrato.contrato_id = poliza.tipoContrato_id
            INNER JOIN vehiculo ON vehiculo.vehiculo_id = poliza.vehiculo_id
            INNER JOIN usovehiculo ON usovehiculo.usoVehiculo_id = vehiculo.uso_id
            INNER JOIN clasevehiculo ON clasevehiculo.clase_id = vehiculo.clase_id
            INNER JOIN color ON color.color_id = vehiculo.color_id
            INNER JOIN modelo ON modelo.modelo_id = vehiculo.modelo_id
            INNER JOIN marca ON marca.marca_id = vehiculo.marca_id
            INNER JOIN tipovehiculo ON tipovehiculo.tipoVehiculo_id = vehiculo.tipo_id
            INNER JOIN debitocredito ON debitocredito.nota_id = poliza.debitoCredito
            INNER JOIN coberturas ON coberturas.cobertura_id = poliza.cobertura_id
            WHERE (poliza.usuario_id = ?) AND poliza_fechaInicio BETWEEN ? AND ?
            ORDER BY poliza_fechaInicio DESC"); // Ordenar en orden descendente por poliza_fechaInicio

			$sql->execute([$usuarioID, $desde, $hasta]);
			$dato = $sql->fetchAll(PDO::FETCH_ASSOC);
			return $dato;
		}
		return [];
	}
	public function consultaSemanal($desde, $hasta)
	{
		$sql = $this->db->prepare("SELECT usuario.usuario_nombre AS nombre_usuario, sucursal.sucursal_nombre AS nombre_sucursal, 
		SUM(debitocredito.nota_monto) AS total_monto_notas, 
		COUNT(DISTINCT debitocredito.nota_id) AS cantidad_poliza_id FROM usuario 
		INNER JOIN poliza ON usuario.usuario_id = poliza.usuario_id 
		INNER JOIN sucursal ON sucursal.sucursal_id = poliza.sucursal_id 
		INNER JOIN debitocredito ON debitocredito.nota_id = poliza.debitoCredito
		WHERE debitocredito.nota_fecha BETWEEN ? AND ? 
		AND usuario.usuario_id > 56
		GROUP BY usuario.usuario_id, sucursal.sucursal_nombre, usuario.usuario_nombre");
		$sql->execute([$desde, $hasta]);
		$dato = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $dato;
	}

	protected function Security()
	{
		//Contrato
		if (empty($this->tipoContrato)) {
			return [
				"data" => [
					"res" => "El tipo de contrato no puede estar vacío",
					"code" => 400
				],
			];
		}
		// Contratante
		if (empty($this->nombre)) {
			return [
				"data" => [
					"res" => "El nombre del contratante no puede estar vacío",
					"code" => 400
				],
			];
		}
		if (empty($this->apellido)) {
			return [
				"data" => [
					"res" => "El apellido del contratante no puede estar vacío",
					"code" => 400
				],
			];
		}
		if (empty($this->cedula)) {
			return [
				"data" => [
					"res" => "La cédula del contratante no puede estar vacío",
					"code" => 400
				],
			];
		}
		if (empty($this->direccion)) {
			return [
				"data" => [
					"res" => "La dirección del contratante no puede estar vacío",
					"code" => 400
				],
			];
		}
		if (empty($this->fechaNacimiento)) {
			return [
				"data" => [
					"res" => "La fecha de nacimiento no puede estar vacía",
					"code" => 400
				],
			];
		}
		//Titular
		if (empty($this->cedulaTitular)) {
			return [
				"data" => [
					"res" => "La cédula del titular no puede estar vacía",
					"code" => 400
				],
			];
		}
		if (empty($this->nombreTitular)) {
			return [
				"data" => [
					"res" => "El nombre del titular no puede estar vacía",
					"code" => 400
				],
			];
		}
		if (empty($this->apellidoTitular)) {
			return [
				"data" => [
					"res" => "El apellido del titular no puede estar vacía",
					"code" => 400
				],
			];
		}

		//Vehiculo
		if (empty($this->placa)) {
			return [
				"data" => [
					"res" => "La placa del vehiculo no puede estar vacía",
					"code" => 400
				],
			];
		}
		if (empty($this->puesto)) {
			return [
				"data" => [
					"res" => "La cantidad de puestos del vehiculo no puede estar vacía",
					"code" => 400
				],
			];
		}
		if (empty($this->ano)) {
			return [
				"data" => [
					"res" => "El año del vehiculo no puede estar vacía",
					"code" => 400
				],
			];
		}
		if (empty($this->serialMotor)) {
			return [
				"data" => [
					"res" => "El serial del motor no puede estar vacía",
					"code" => 400
				],
			];
		}
		if (empty($this->serialCarroceria)) {
			return [
				"data" => [
					"res" => "El serial de carroceria no puede estar vacía",
					"code" => 400
				],
			];
		}
		if (empty($this->color)) {
			return [
				"data" => [
					"res" => "El color del vehiculo no puede estar vacía",
					"code" => 400
				],
			];
		}
		if (empty($this->modelo)) {
			return [
				"data" => [
					"res" => "El modelo del vehiculo no puede estar vacía",
					"code" => 400
				],
			];
		}
		if (empty($this->marca)) {
			return [
				"data" => [
					"res" => "La marca del vehiculo no puede estar vacía",
					"code" => 400
				],
			];
		}
		if (empty($this->uso)) {
			return [
				"data" => [
					"res" => "El uso del vehiculo no puede estar vacía",
					"code" => 400
				],
			];
		}
		if (empty($this->clase)) {
			return [
				"data" => [
					"res" => "La clase del vehiculo no puede estar vacía",
					"code" => 400
				],
			];
		}
		if (empty($this->tipo)) {
			return [
				"data" => [
					"res" => "El tipo de vehiculo no puede estar vacía",
					"code" => 400
				],
			];
		}
		if (empty($this->cantidadDolar)) {
			return [
				"data" => [
					"res" => "No has ingresado un monto valido",
					"code" => 400
				],
			];
		}
	}

	protected function SecurityMedico()
	{
		if (empty($this->cedula)) {
			return [
				"data" => [
					"res" => "La cédula no puede estar vacío",
					"code" => 400
				],
			];
		}
		if (empty($this->nombre)) {
			return [
				"data" => [
					"res" => "El nombre no puede estar vacío",
					"code" => 400
				],
			];
		}
		if (empty($this->apellido)) {
			return [
				"data" => [
					"res" => "El apellido no puede estar vacío",
					"code" => 400
				],
			];
		}
		if (empty($this->fechaNacimiento)) {
			return [
				"data" => [
					"res" => "La fecha de nacimiento no puede estar vacío",
					"code" => 400
				],
			];
		}
		if (empty($this->edad)) {
			return [
				"data" => [
					"res" => "La edad no puede estar vacío o ser menor a 8",
					"code" => 400
				],
			];
		}
		if (empty($this->sangre)) {
			return [
				"data" => [
					"res" => "El tipo de sangre no puede estar vacío",
					"code" => 400
				],
			];
		}
	}


	protected function SecurityLicencia()
	{
		if (empty($this->cantidadDolar) || $this->cantidadDolar == 0) {
			return [
				"data" => [
					"res" => "El monto total no puede estar vacio",
					"code" => 400
				],
			];
		}
		if (empty($this->cedula)) {
			return [
				"data" => [
					"res" => "La cédula no puede estar vacío",
					"code" => 400
				],
			];
		}
		if (empty($this->nombre)) {
			return [
				"data" => [
					"res" => "El nombre no puede estar vacío",
					"code" => 400
				],
			];
		}
		if (empty($this->apellido)) {
			return [
				"data" => [
					"res" => "El apellido no puede estar vacío",
					"code" => 400
				],
			];
		}

		if (empty($this->correoLicencia)) {
			return [
				"data" => [
					"res" => "No has seleccionado una licencia",
					"code" => 400
				],
			];
		}
		if (empty($this->sangre)) {
			return [
				"data" => [
					"res" => "El tipo de sangre no puede estar vacío",
					"code" => 400
				],
			];
		}

		if (empty($this->montoTotal)) {
			return [
				"data" => [
					"res" => "El monto total no puede estar vacio",
					"code" => 400
				],
			];
		}

		if (empty($this->abonado)) {
			return [
				"data" => [
					"res" => "El monto abonado no puede estar vacio",
					"code" => 400
				],
			];
		}
	}


	public function reporteGeneral($motivo, $desde, $hasta)
	{
		if (is_numeric($motivo)) {
			if ($motivo == 0 || $motivo == 1 || $motivo == 2) {
				if ($motivo != 2) {
					$where = "nota_ingresoEgreso = ?  AND nota_fecha BETWEEN ? AND ?";
				} else {
					$where = "nota_fecha BETWEEN ? AND ?"; // Cuando $motivo es 2, no necesitas una condición WHERE
				}
			} else {
				$where = ""; // Trata $where como una cadena vacía en este caso
			}
		} else {
			$where = "nota_motivo = ? AND nota_fecha BETWEEN ? AND ?";
		}

		$sql = $this->db->prepare("SELECT *, usuario.* 
    FROM debitocredito 
    INNER JOIN usuario on usuario.usuario_id = debitocredito.usuario_id
    WHERE $where");
		if ($motivo == 2) {
			$a = $sql->execute([$desde, $hasta]);
		} else {
			$a = $sql->execute([$motivo, $desde, $hasta]);
		}
		if ($a) {
			$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		} else {
			$resultado = [];
		}

		return $resultado;
	}
}
