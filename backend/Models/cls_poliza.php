<?php

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
		$vehiculo, $cliente, $precioDolar, $debitoCredito, $cobertura, $idTitular;


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
		if ($sql->execute([
			$this->fechaInicio,
			$this->fechaVencimiento,
			$this->debitoCredito,
			$this->id
		]));
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

			$result = $this->SearchByTitular();
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

			$result = $this->RegistrarPoliza();
			$this->id = $this->db->lastInsertId();
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
	protected function RegistraCobertura()
	{

		$sql = $this->db->prepare("INSERT INTO coberturas(
			cobertura_danoCosas, cobertura_danoPersonas, cobertura_fianzaCuanti, cobertura_asistenciaLegal,
			cobertura_apov, cobertura_muerte, cobertura_invalidez, cobertura_gastosMedicos, cobertura_grua, totalPagar) 
			VALUES(?,?,?,?,?,?,?,?,?,?)");

		$result = $sql->execute([
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
		]);

		return $result;
	}

	protected function RegistrarPoliza()
	{
		$sql = $this->db->prepare("SELECT * FROM poliza WHERE cliente_id = ? AND vehiculo_id = ?");
		if ($sql->execute([$this->cliente, $this->vehiculo])) {
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
			if (!isset($resultado[0])) {

				$sql = $this->db->prepare("INSERT INTO poliza( cliente_id, titular_id, vehiculo_id, poliza_fechaInicio, poliza_fechaVencimiento,
				tipoContrato_id, estado_id, usuario_id, sucursal_id, cobertura_id, poliza_renovacion, debitoCredito ) 
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
		if ($sql->execute([
			$tipoIngreso,
			$motivo,
			$fecha,
			$hora,
			$this->metodoPago,
			$this->referencia,
			$this->cantidadDolar,
			$this->precioDolar,
			$this->usuario,
			$this->sucursal
		])) {
			$this->debitoCredito =  $this->db->lastInsertId();
			return true;
		} else return false;
	}

	protected function precioDolar($precio)
	{
		date_default_timezone_set('America/Caracas');
		$fecha = date("Y-m-d");
		$hora = date("H:i:s");
		$sql = $this->db->prepare("SELECT * FROM preciodolar WHERE dolar_monto = ? AND dolar_fecha = ?");
		if ($sql->execute([$precio, $fecha])) {
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
			if (isset($resultado[0])) $this->precioDolar = $resultado["dolar_id"];
			else {
				$sql = $this->db->prepare("INSERT INTO preciodolar(dolar_monto,dolar_hora,dolar_fecha) VALUES(?,?,?)");
				$sql->execute([$precio, $hora, $fecha]);
				$this->precioDolar = $this->db->lastInsertId();
			}
		} else return false;
		return true;
	}

	protected function SearchByVehiculo()
	{
		$sql = $this->db->prepare("SELECT * FROM vehiculo WHERE vehiculo_placa = ?");
		if ($sql->execute([$this->placa])) {
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
			if (count($resultado) > 0) {
				$this->vehiculo = $resultado["vehiculo_id"];
			} else {
				$sql = $this->db->prepare("INSERT INTO vehiculo(
                    vehiculo_placa,
                    vehiculo_puesto,
                    vehiculo_ano,
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
					$this->peso,
					$this->capacidad,
					$this->color,
					$this->modelo,
					$this->marca,
					$this->uso,
					$this->clase,
					$this->tipo
				]);
				$this->vehiculo = $this->db->lastInsertId();
			}
		} else return false;
		return $this->vehiculo;
	}

	protected function SearchByCliente()
	{
		$sql = $this->db->prepare("SELECT * FROM cliente WHERE cliente_cedula = ?");
		if ($sql->execute([$this->cedula])) {
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
			if (count($resultado) > 0) {
				$this->cliente = $resultado["cliente_id"];
			} else {
				$sql = $this->db->prepare("INSERT INTO cliente(
                    cliente_nombre, 
                    cliente_apellido, 
                    cliente_cedula, 
                    cliente_fechaNacimiento, 
                    cliente_telefono, 
                    cliente_correo, 
                    cliente_direccion)VALUES(?,?,?,?,?,?,?)");
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
		} else false;
		return $this->cliente;
	}

	protected function SearchByModelo()
	{
		$sql = $this->db->prepare("SELECT * FROM modelo WHERE modelo_nombre = ?");
		if ($sql->execute([$this->modelo])) {
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
			if (count($resultado) > 0) {
				$this->modelo = $resultado["modelo_id"];
			} else {
				$sql = $this->db->prepare("INSERT INTO modelo (modelo_nombre,modelo_estatus) VALUES(?,1)");
				$sql->execute([$this->modelo]);
				$this->modelo =  $this->db->lastInsertId();
			}
		} else false;
		return true;
	}

	protected function SearchByMarca()
	{
		$sql = $this->db->prepare("SELECT * FROM marca WHERE marca_nombre = ?");
		if ($sql->execute([$this->marca])) {
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
			if (count($resultado) > 0) {
				$this->marca = $resultado["marca_id"];
			} else {
				$sql = $this->db->prepare("INSERT INTO marca (marca_nombre,marca_estatus) VALUES(?,1)");
				$sql->execute([$this->marca]);
				$this->marca =  $this->db->lastInsertId();
			}
		} else false;
		return true;
	}

	protected function SearchByColor()
	{
		$sql = $this->db->prepare("SELECT * FROM color WHERE color_nombre = ?");
		if ($sql->execute([$this->color])) {
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
			if (count($resultado) > 0) {
				$this->color = $resultado["color_id"];
			} else {
				$sql = $this->db->prepare("INSERT INTO color (color_nombre,color_estatus) VALUES(?,1)");
				$sql->execute([$this->color]);
				$this->color =  $this->db->lastInsertId();
			}
		} else false;
		return true;
	}

	protected function SearchByTitular()
	{
		$sql = $this->db->prepare("SELECT * FROM titular WHERE titular_cedula = ?");
		if ($sql->execute([$this->cedulaTitular])) {
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
			if (count($resultado) > 0) {
				$this->idTitular = $resultado["titular_id"];
			} else {
				$sql = $this->db->prepare("INSERT INTO titular(titular_cedula,titular_nombre,titular_apellido) VALUES(?,?,?)");
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
            INNER JOIN vehiculo ON vehiculo.vehiculo_id = poliza.vehiculo_id");
		} else {
			$sql = $this->db->prepare("SELECT poliza.*, cliente.*, sucursal.*, usuario.*, vehiculo.* FROM poliza 
            INNER JOIN cliente ON cliente.cliente_id = poliza.cliente_id
            INNER JOIN sucursal ON sucursal.sucursal_id = poliza.sucursal_id
            INNER JOIN usuario ON usuario.usuario_id = poliza.usuario_id
            INNER JOIN vehiculo ON vehiculo.vehiculo_id = poliza.vehiculo_id
            WHERE usuario.usuario_id = $id");
		}

		if ($sql->execute()) $resultado = $sql->fetch(PDO::FETCH_ASSOC);
		else $resultado = [];
		return $resultado;
	}

	protected function GetOne($id)
	{

		$sql = $this->db->prepare("SELECT poliza.*, cliente.*, sucursal.*, usuario.*, vehiculo.* FROM poliza 
            INNER JOIN cliente ON cliente.cliente_id = poliza.cliente_id
            INNER JOIN sucursal ON sucursal.sucursal_id = poliza.sucursal_id
            INNER JOIN usuario ON usuario.usuario_id = poliza.usuario_id
            INNER JOIN vehiculo ON vehiculo.vehiculo_id = poliza.vehiculo_id WHERE poliza_id = ?");
		if ($sql->execute([$id])) $resultado = $sql->fetch(PDO::FETCH_ASSOC);
		else $resultado = [];
		return $resultado;
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
		if ($sql->execute([
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
		])){
			return true;
		}else return false;
	}

	protected function editarTitular($id)
	{
		$sql = $this->db->prepare("UPDATE titular SET
		titular_cedula = ?,
		titular_nombre = ?,
		titular_apellido = ?
		WHERE titular_id = ?");
		if ($sql->execute([
			$this->cedulaTitular,
			$this->nombreTitular,
			$this->apellidoTitular,
			$id
		])){
			return true;
		}else return false;
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
		if ($sql->execute([
			$this->cedula,
			$this->nombre,
			$this->apellido,
			$this->fechaNacimiento,
			$this->telefono,
			$this->correo,
			$this->direccion,
			$id
		])){
			return true;
		}else return false;
	}
}
