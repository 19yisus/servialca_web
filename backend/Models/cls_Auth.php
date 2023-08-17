<?php

require_once("cls_db.php");

class cls_Auth extends cls_db
{
  protected $id, $usuario, $nombre, $apellido, $cedula, $telefono, $direccion, $correo, $clave, $rol, $sucursal, $estatus, $modulo;

  public function __construct()
  {
    parent::__construct();
  }

  protected function sing_in()
  {
    $sql = $this->db->prepare("SELECT * FROM usuario WHERE usuario_usuario = ?");
    $PasswordUpdate = false;

    $sql->execute([$this->usuario]);
    $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    if (!empty($resultado)) {
      if ($resultado["usuario_estatus"] == 0) return [
        'data' => [
          'res' => "El usuario está desactivado"
        ],
        'code' => 400
      ];

      if ($this->clave != $resultado['usuario_clave']) {
        if (!password_verify($this->clave, $resultado['usuario_clave'])) {
          return [
            'data' => [
              'res' => "Su clave es invalida"
            ],
            'code' => 400
          ];
        }
      }else{
        $PasswordUpdate = true;
      }


      $permisos = $this->Get_permisos_usuario($resultado["usuario_id"]);
      $dato = $this->GetOne($resultado["usuario_id"]);

      if (!empty($permisos)) {
        $lista = [];
        foreach ($permisos as $per) {
          array_push($lista, $per["permiso_modulo"]);
        }

        return [
          'data' => [
            'res' => "Login exitoso",
            'usuario' => [
              'username' => $dato["usuario_nombre"] . " " . $dato["usuario_apellido"],
              'user_id' => $dato["usuario_id"],
              'permisos' => $lista,
              'rol' => $dato["roles_id"],
              'RequireUpdatePass' => $PasswordUpdate
            ],
            'sucursal' => [
              'id' => $dato["sucursal_id"],
              'name' => $dato["sucursal_nombre"]
            ]
          ],
          'code' => 200
        ];
      }
    }

    return [
      'data' => [
        'res' => "El usuario no existe o los datos ingresados son invalidos"
      ],
      'code' => 400
    ];
  }

  protected function Get_permisos_usuario($id)
  {
    $sql = $this->db->prepare("SELECT * FROM permisos_usuario WHERE usuario_id = ?");
    $sql->execute([$id]);
    $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
    return $resultado;
  }

  protected function encriptPasswords()
  {
    $datos = $this->db->query("SELECT * FROM usuario WHERE usuario_clave != '' ");
    $datos = $datos->fetchAll(PDO::FETCH_ASSOC);
    foreach ($datos as $item) {
      $id_usuario = $item['usuario_id'];
      $clave = password_hash($item['usuario_clave'], PASSWORD_BCRYPT, ['cost' => 12]);
      $this->db->query("UPDATE usuario SET usuario_clave = '$clave' WHERE usuario_id = $id_usuario");
    }
    if (isset($datos)) return $datos;
  }

  protected function Save()
  {
    try {
      $result = $this->SearchByUsername($this->usuario);
      if (isset($result[0])) {
        return [
          'data' => [
            'res' => "Este nombre de usuario ($this->usuario) ya existe"
          ],
          'code' => 400
        ];
      }

      $result = $this->SearchByCedula($this->cedula);
      if (isset($result[0])) {
        return [
          'data' => [
            'res' => "La cédula de usuario ($this->cedula) ya existe"
          ],
          'code' => 400
        ];
      }


      $clave = password_hash($this->clave, PASSWORD_BCRYPT, ['cost' => 12]);
      $sql = $this->db->prepare("INSERT INTO 
      usuario(
          usuario_usuario,
          usuario_nombre,
          usuario_apellido,
          usuario_cedula,
          usuario_telefono,
          usuario_direccion,
          usuario_correo,
          usuario_clave,
          roles_id,
          sucursal_id,
          usuario_estatus
      )VALUES(?,?,?,?,?,?,?,?,?,?,1)");
      $sql->execute([
        $this->usuario,
        $this->nombre,
        $this->apellido,
        $this->cedula,
        $this->telefono,
        $this->direccion,
        $this->correo,
        $clave,
        $this->rol,
        $this->sucursal
      ]);
      $this->id = $this->db->lastInsertId();
      if ($sql->rowCount() > 0) return [
        'data' => [
          'res' => "Registro exitoso"
        ],
        'code' => 200
      ];

      return [
        'data' => [
          'res' => "El registro ha fallado, verifica que no hallas duplicado el usuario de alguien mas o tus datos sean correctos"
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

  protected function update()
  {
    try {
      $res = $this->GetDuplicados();
      if (isset($res[0])) {
        return [
          'data' => [
            'res' => "Estas duplicando datos de otro usuario"
          ],
          'code' => 400
        ];
      }
      $sql = $this->db->prepare("UPDATE usuario SET 
      usuario_usuario = ?,
      usuario_nombre = ?,
      usuario_apellido = ?,
      usuario_telefono = ?,
      usuario_direccion = ?,
      usuario_correo = ?
      WHERE usuario_id = ?");
      if ($sql->execute([
        $this->usuario,
        $this->nombre,
        $this->apellido,
        $this->telefono,
        $this->direccion,
        $this->correo,
        $this->id
      ])) {
        return [
          'data' => [
            'res' => "Actualización de datos exitosa"
          ],
          'code' => 300
        ];
      }

      return [
        'data' => [
          'res' => "Actualización de datos fallia"
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

  protected function Delete()
  {
    try {
      $sql = $this->db->prepare("UPDATE usuario SET usuario_estatus = ? WHERE usuario_id = ?");
      if ($sql->execute([$this->estatus, $this->id])) {
        return [
          'data' => [
            'res' => "Usuario desactivado"
          ],
          'code' => 200
        ];
      }
    } catch (PDOException $e) {
      return [
        'data' => [
          'res' => "Error de consulta: " . $e->getMessage()
        ],
        'code' => 400
      ];
    }
  }

  protected function GetOne($id)
  {
    $sql = $this->db->prepare("SELECT usuario.*, roles.*, sucursal.*  FROM usuario 
      INNER JOIN roles ON roles.roles_id = usuario.roles_id
      INNER JOIN sucursal ON sucursal.sucursal_id = usuario.sucursal_id WHERE usuario_id = ?");

    if ($sql->execute([$id])) $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    else $resultado = [];
    return $resultado;
  }

  private function GetDuplicados()
  {
    $sql = $this->db->prepare("SELECT * FROM usuario WHERE 
      usuario_usuario = ? AND
      usuario_id != ?");

    if ($sql->execute([$this->usuario, $this->id])) $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    else $resultado = [];
    return $resultado;
  }

  protected function SearchByUsername($username)
  {
    $sql = $this->db->prepare("SELECT * FROM usuario WHERE usuario_usuario = ?");

    if ($sql->execute([$username])) $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    else $resultado = [];
    return $resultado;
  }

  protected function SearchByCedula($cedula)
  {
    $sql = $this->db->prepare("SELECT * FROM usuario WHERE usuario_cedula = ?");

    if ($sql->execute([$cedula])) $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    else $resultado = [];
    return $resultado;
  }

  protected function GetAll()
  {
    $sql = $this->db->prepare("SELECT usuario.*, roles.*, sucursal.*  FROM usuario 
      INNER JOIN roles ON roles.roles_id = usuario.roles_id 
      INNER JOIN sucursal ON sucursal.sucursal_id = usuario.sucursal_id WHERE usuario_id > 56");

    if ($sql->execute()) $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
    else $resultado = [];

    return $resultado;
  }
}
