<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

if (is_file("vendor/autoload.php")) require "vendor/autoload.php";
if (!class_exists("cls_db")) require("cls_db.php");

class cls_Auth extends cls_db
{
  protected $id, $usuario, $nombre, $apellido, $cedula, $telefono, $direccion, $correo, $clave, $rol, $sucursal, $estatus, $modulo;

  protected $id_pregunta, $des_pregunta, $des_pregunta2, $des_respuesta, $des_respuesta2, $permiso;

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

    if (isset($resultado['usuario_id'])) {
      if ($resultado["usuario_estatus"] == 0) {
        return [
          'data' => [
            'res' => [
              'text' => "El usuario está desactivado",
              "code" => 400
            ]
          ],
          'code' => 400
        ];
        return false;
      }

      if ($resultado["intentos"] == 3) {
        return [
          "data" => [
            "res" => [
              'text' => "El usuario se encuenta bloqueado",
              "code" => 400
            ],
          ],
          "code" => 400
        ];
        return false;
      }

      if (!password_verify($this->clave, $resultado['usuario_clave'])) {
        // if (!password_verify($this->clave, $resultado['usuario_clave'])) {
        //   return [
        //     'data' => [
        //       'res' => "Su clave es invalida"
        //     ],
        //     'code' => 400
        //   ];
        // }
        $sql = $this->db->prepare("UPDATE usuario SET intentos = intentos +1 WHERE usuario_id = ?");
        $sql->execute([$resultado["usuario_id"]]);
        return [
          'data' => [
            'res' => [
              'text' => "Su clave es inválida",
              "code" => 400
            ]
          ],
          'code' => 400
        ];
        return false;
      } else {
        $PasswordUpdate = true;
      }



      // if ($this->clave != $resultado['usuario_clave']) {
      //   if (!password_verify($this->clave, $resultado['usuario_clave'])) {
      //     return [
      //       'data' => [
      //         'res' => "Su clave es invalida"
      //       ],
      //       'code' => 400
      //     ];
      //   }
      // }else{
      //   $PasswordUpdate = true;
      // }


      // $permisos = $this->Get_permisos_usuario($resultado["usuario_id"]);
      $dato = $this->GetOne($resultado["usuario_id"]);
      if (!empty($dato)) {
        // $lista = [];
        // foreach ($permisos as $per) {
        //   array_push($lista, $per["permiso_modulo"]);
        // }

        return [
          'data' => [
            'res' => ['text' => "Login exitoso", 'code' => 200],
            'usuario' => [
              'username' => $dato["usuario_usuario"],
              'user_id' => $dato["usuario_id"],
              'permisos' => $dato['permisos'],
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
      } else {
        return [
          'data' => [
            'res' => ['text' => "El usuario no posee permisos para acceder al sistema", 'code' => 400]
          ],
          'code' => 400
        ];
      }
    }

    return [
      'data' => [
        'res' => ['text' => "El usuario no existe o los datos ingresados son invalidos", 'code' => 400]
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

  public function encriptPasswords()
  {
    $datos = $this->db->query("SELECT * FROM usuario WHERE usuario_clave != '' ");
    $datos = $datos->fetchAll(PDO::FETCH_ASSOC);
    foreach ($datos as $item) {
      $id_usuario = $item['usuario_id'];
      $clave = password_hash($item['usuario_clave'], PASSWORD_BCRYPT, ['cost' => 12]);
      $this->db->query("UPDATE usuario SET usuario_clave = '$clave' WHERE usuario_id = $id_usuario");
    }
    if (isset($datos))
      return $datos;
  }

  protected function Save()
  {
    try {
      $result = $this->SearchByUsername($this->usuario);
      if (isset($result["usuario_usuario"])) {
        return [
          'data' => [
            'res' => "Este nombre de usuario ($this->usuario) ya existe",
            "code" => 400
          ],
          'code' => 400
        ];
      }

      $result = $this->SearchByCedula($this->cedula);
      if (isset($result["usuario_cedula"])) {
        return [
          'data' => [
            'res' => "La cédula de usuario ($this->cedula) ya existe",
            "code" => 400
          ],
          'code' => 400
        ];
      }
      $clave = password_hash((isset($this->clave) ? $this->clave : $this->cedula), PASSWORD_BCRYPT, ['cost' => 12]);

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
          usuario_estatus,
          permisos,
          intentos
      )VALUES(?,?,?,?,?,?,?,?,?,?,1,?,0)");
      $sql->execute([
        $this->usuario,
        $this->nombre,
        $this->apellido,
        $this->cedula,
        $this->telefono,
        $this->direccion,
        $this->correo,
        $this->clave,
        $this->rol,
        $this->sucursal,
        $this->permiso
      ]);
      $this->id = $this->db->lastInsertId();
      if ($sql->rowCount() > 0) {
        $this->reg_bitacora([
          'table_name' => "usuario",
          'des' => "Registro de datos de usuario ($this->usuario, $this->nombre, $this->apellido, $this->telefono)"
        ]);
        return [
          'data' => [
            'res' => "Registro exitoso"
          ],
          'code' => 200
        ];
      }
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
      usuario_cedula = ?,
      usuario_telefono = ?,
      usuario_direccion = ?,
      usuario_correo = ?,
      usuario_clave = ?,
      roles_id =?,
      sucursal_id =?,
      permisos = ?
      WHERE usuario_id = ?");
      $sql->execute([
        $this->usuario,
        $this->nombre,
        $this->apellido,
        $this->cedula,
        $this->telefono,
        $this->direccion,
        $this->correo,
        $this->clave,
        $this->rol,
        $this->sucursal,
        $this->permiso,
        $this->id,
      ]);


      if ($sql->rowCount() > 0) {

        // $this->reg_bitacora([
        //   'table_name' => "usuario",
        //   'des' => "Actualización de datos de usuario ($this->usuario, $this->nombre, $this->apellido, $this->telefono, $this->correo, $this->direccion"
        // ]);
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
      $sql->execute([$this->estatus, $this->id]);
      if ($sql->rowCount() > 0) {
        $this->reg_bitacora([
          'table_name' => "usuario",
          'des' => "Cambio de estatus del usuario ($this->id)"
        ]);
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

  protected function updatePass()
  {
    try {
      $this->clave = password_hash($this->clave, PASSWORD_BCRYPT, ['cost' => 12]);
      $sql = $this->db->prepare("UPDATE usuario SET usuario_clave = ? WHERE usuario_id = ?");
      $sql->execute([
        $this->clave,
        $this->id
      ]);

      if ($sql->rowCount() > 0) {
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

  protected function GetOne($id)
  {
    $sql = $this->db->prepare("SELECT usuario.*, roles.*, sucursal.*  FROM usuario 
      INNER JOIN roles ON roles.roles_id = usuario.roles_id
      INNER JOIN sucursal ON sucursal.sucursal_id = usuario.sucursal_id WHERE usuario_id = ?");
    $sql->execute([$id]);

    if ($sql->rowCount() > 0) $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    else $resultado = [];
    return $resultado;
  }

  protected function GetOneByUser($user)
  {
    $sql = $this->db->prepare("SELECT usuario.*, roles.*, sucursal.*  FROM usuario 
      INNER JOIN roles ON roles.roles_id = usuario.roles_id
      INNER JOIN sucursal ON sucursal.sucursal_id = usuario.sucursal_id WHERE usuario_usuario = ?");
    $sql->execute([$user]);

    if ($sql->rowCount() > 0) $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    else $resultado = [];
    return $resultado;
  }

  private function GetDuplicados()
  {
    $sql = $this->db->prepare("SELECT * FROM usuario WHERE 
      usuario_usuario = ? AND
      usuario_id != ?");
    $sql->execute([$this->usuario, $this->id]);

    if ($sql->rowCount() > 0) $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    else $resultado = [];
    return $resultado;
  }

  protected function SearchByUsername($username)
  {
    $sql = $this->db->prepare("SELECT * FROM usuario WHERE usuario_usuario = ?");
    $sql->execute([$username]);

    if ($sql->rowCount() > 0) $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    else $resultado = [];
    return $resultado;
  }

  protected function SearchByCedula($cedula)
  {
    $sql = $this->db->prepare("SELECT * FROM usuario WHERE usuario_cedula = ?");
    $sql->execute([$cedula]);

    if ($sql->rowCount() > 0) $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    else $resultado = [];
    return $resultado;
  }



  protected function GetAll()
  {
    $sql = $this->db->prepare("SELECT usuario.*, roles.*, sucursal.*  FROM usuario 
      INNER JOIN roles ON roles.roles_id = usuario.roles_id 
      INNER JOIN sucursal ON sucursal.sucursal_id = usuario.sucursal_id WHERE usuario_id > 56 AND usuario_usuario IS NOT NULL
      ORDER BY usuario.usuario_id DESC");

    if ($sql->execute())
      $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
    else
      $resultado = [];

    return $resultado;
  }

  protected function Save_respuestas()
  {
    try {
      $sql = $this->db->prepare("SELECT * FROM respuestas_user WHERE user_id_respuesta = ?");
      if ($sql->execute([$this->id])) {
        if ($sql->rowCount() > 0) {
          $sql = $this->db->prepare("UPDATE respuestas_user SET des_pregunta = ?, des_respuesta= ?, des_pregunta2=?, des_respuesta2= ? WHERE user_id_respuesta  = ?");
          if ($sql->execute([$this->des_pregunta, $this->des_respuesta, $this->des_pregunta2, $this->des_respuesta2, $this->id])) {
            return [
              "data" => [
                "res" => "Preguntas de seguridad actualizadas",
                "code" => 200
              ],
              "code" => 200
            ];
          }
        } else {
          $sql = $this->db->prepare("INSERT INTO respuestas_user(user_id_respuesta, des_pregunta, des_respuesta, des_pregunta2, des_respuesta2) 
          VALUES(?,?,?,?,?)");
          if ($sql->execute([
            $this->id,
            $this->des_pregunta,
            $this->des_respuesta,
            $this->des_pregunta2,
            $this->des_respuesta2
          ])) {
            return [
              "data" => [
                "res" => "Preguntas de seguridad registras",
                "code" => 200
              ],
              "code" => 200
            ];
          }
        }
      } else {
        return [
          "data" => [
            "res" => "Error de consulta",
            "code" => 400
          ],
          "code" => 400
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


  protected function getPreguntasFromUser()
  {
    $sql = $this->db->prepare("SELECT * FROM respuestas_user 
    INNER JOIN usuario ON usuario.usuario_id = respuestas_user.user_id_respuesta
    WHERE usuario_usuario = ?");
    if ($sql->execute([$this->usuario])) {
      $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
    } else {
      $resultado = [];
    }

    return $resultado;
  }

  protected function quitarLuz()
  {
    $sql = $this->db->prepare("UPDATE usuario SET usuario_estatus = FALSE WHERE usuario_id > 57");
    if ($sql->execute()) {
      return [
        'data' => [
          'res' => "Usuarios desactivados",
          "code" => 200
        ],
        'code' => 200
      ];
    } else {
      return [
        'data' => [
          'res' => "No se pudieron desactivar los usuarios",
        ],
        'code' => 400
      ];
    }
  }

  protected function DeleteUser()
  {
    $sql = $this->db->prepare("UPDATE usuario SET usuario_usuario = NULL, permisos = NULL, usuario_estatus = NULL WHERE usuario_id = ?");
    if ($sql->execute([$this->id])) {
      return [
        "data" => [
          "res" => "Usuario eliminado",
          "code" => 200
        ],
        "code" => 200
      ];
    } else {
      return [
        "data" => [
          "res" => "No se pudo eliminar el usuario",
        ],
        "code" => 400
      ];
    }
  }

  protected function ChangeStatus($estatus)
  {
    $sql = $this->db->prepare("UPDATE usuario SET usuario_estatus = ? WHERE usuario_id = ?");
    if ($sql->execute([$estatus, $this->id])) {
      return [
        "data" => [
          "res" => "Estatus modificado",
          "code" => 200
        ],
        "code" => 200
      ];
    } else {
      return [
        "data" => [
          "res" => "No se pudo modificar el estatus",
          "code" => 400
        ],
        "code" => 400
      ];
    }
  }

  protected function ChangePassword()
  {
    $sql = $this->db->prepare("UPDATE usuario SET usuario_clave = ?, intentos = 0 WHERE usuario_id = ?");
    if ($sql->execute([$this->clave, $this->id])) {
      return [
        "data" => [
          "res" => "Contraseña modificada",
          "code" => 200
        ],
        "code" => 200
      ];
    } else {
      return [
        "data" => [
          "res" => "No se pudo modiciar la contraseña",
          "code" => 400
        ],
        "code" => 400
      ];
    };
  }

  // public function Make_code_recovery($id_user)
  // {
  //   $code = $this->generateRandomString();

  //   $result = $this->db->query("SELECT * FROM codigos_recuperacion WHERE char_code = '$code';");

  //   if ($result->rowCount() === 0) {
  //     $datos = $result->fetch(PDO::FETCH_ASSOC);
  //     $this->db->query("UPDATE codigos_recuperacion SET status_code = 0 WHERE id_user = $id_user;");

  //     $this->db->query("INSERT INTO codigos_recuperacion(date_cod, status_code, char_code, id_user) VALUES (NOW(),'1','$code',$id_user);");
  //     return $code;
  //   }

  //   $this->Make_code_recovery($id_user);
  // }

  public function SendEmail($code, $email)
  {
    if ($_ENV['MAILTO_EMAIL']  == '') die("Debes de tener configurada una cuenta de Correo electronico");

    $mail = new PHPMailer(true);
    $email_user = strtolower($email);

    try {
      ini_set('display_errors', 1);
      error_reporting(E_ALL);

      $mail->SMTPDebug = 0;                              //Enable verbose debug output
      $mail->isSMTP();                                   //Send using SMTP
      $mail->Host       = 'smtp.gmail.com';              //Set the SMTP server to send through
      $mail->SMTPAuth   = true;                          //Enable SMTP authentication
      $mail->Username   = $_ENV['MAILTO_EMAIL'];    //SMTP username
      $mail->Password   = $_ENV['MAILTO_TOKEN'];    //SMTP password
      $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;   //Enable implicit TLS encryption
      $mail->Port       = $_ENV['MAILTO_PORT'];

      //Recipients
      $mail->setFrom($_ENV['MAILTO_EMAIL'], 'Mailer');
      $mail->addAddress($email_user);     //Add a recipient

      //Content
      $mail->isHTML(true);                                  //Set email format to HTML
      $mail->Subject = 'Codigo de recuperacion';
      $mail->Body    = "Esta es su nueva clave de acceso: <b>$code</b>";

      if (!$mail->send()) return false;
      else return true;
    } catch (Exception $e) {
      echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
  }

  function generateRandomString($length = 8)
  {
    return substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, $length);
  }

  public function ValidacionCodigo($datos)
  {
    $code = $datos['code'];
    $id_user = $datos['id'];

    $result = $this->db->query("SELECT * FROM codigos_recuperacion WHERE char_code = '$code' AND id_user = $id_user AND status_code = 1;");

    if ($result->rowCount() > 0) {

      return [
        'status' => true,
        'next' => 3,
        'id_user' => $id_user,
        'message' => [
          'code' => 'success',
          'msg' => "Código verificado!",
        ]
      ];
    }
    return [
      'status' => false,
      'next' => 2,
      'id_user' => $id_user,
      'message' => [
        'code' => 'error',
        'msg' => "Código incorrecto o invalido",
      ]
    ];
  }
}


