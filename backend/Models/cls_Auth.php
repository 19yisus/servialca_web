<?php

require_once("cls_db.php");

class cls_Auth extends cls_db
{
  protected $id, $usuario, $nombre, $apellido, $cedula, $telefono, $direccion, $correo, $clave, $rol, $sucursal, $estatus, $modulo;

  protected $id_pregunta, $id_respuesta, $des_respuesta, $permiso;

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
      if ($resultado["usuario_estatus"] == 0)
        return [
          'data' => [
            'res' => "El usuario está desactivado"
          ],
          'code' => 400
        ];
      if ($this->clave != $resultado['usuario_clave']) {
        // if (!password_verify($this->clave, $resultado['usuario_clave'])) {
        //   return [
        //     'data' => [
        //       'res' => "Su clave es invalida"
        //     ],
        //     'code' => 400
        //   ];
        // }
        return [
          'data' => [
            'res' => "Su clave es inválida ($this->clave === )" . $resultado['usuario_clave']
          ],
          'code' => 400
        ];
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
              'username' => $dato["usuario_usuario"],
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
    if (isset($datos))
      return $datos;
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
          usuario_estatus,
          permisos
      )VALUES(?,?,?,?,?,?,?,?,?,?,1,?)");
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
        $this->sucursal,
        $this->permiso
      ]);
      $this->id = $this->db->lastInsertId();
      if ($sql->rowCount() > 0)
        return [
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
      usuario_correo = ?,
      permisos = ?
      WHERE usuario_id = ?");
      if (
        $sql->execute([
          $this->usuario,
          $this->nombre,
          $this->apellido,
          $this->telefono,
          $this->direccion,
          $this->correo,
          $this->permiso,
          $this->id,

        ])
      ) {
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

  protected function updatePass()
  {
    try {
      $sql = $this->db->prepare("UPDATE usuario SET usuario_clave = ? WHERE usuario_id = ?");
      if (
        $sql->execute([
          $this->clave,
          $this->id
        ])
      ) {
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

    if ($sql->execute([$id]))
      $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    else
      $resultado = [];
    return $resultado;
  }

  protected function GetOneByUser($user)
  {
    $sql = $this->db->prepare("SELECT usuario.*, roles.*, sucursal.*  FROM usuario 
      INNER JOIN roles ON roles.roles_id = usuario.roles_id
      INNER JOIN sucursal ON sucursal.sucursal_id = usuario.sucursal_id WHERE usuario_usuario = ?");

    if ($sql->execute([$user]))
      $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    else
      $resultado = [];
    return $resultado;
  }
  
  private function GetDuplicados()
  {
    $sql = $this->db->prepare("SELECT * FROM usuario WHERE 
      usuario_usuario = ? AND
      usuario_id != ?");

    if ($sql->execute([$this->usuario, $this->id]))
      $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    else
      $resultado = [];
    return $resultado;
  }

  protected function SearchByUsername($username)
  {
    $sql = $this->db->prepare("SELECT * FROM usuario WHERE usuario_usuario = ?");

    if ($sql->execute([$username]))
      $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    else
      $resultado = [];
    return $resultado;
  }

  protected function SearchByCedula($cedula)
  {
    $sql = $this->db->prepare("SELECT * FROM usuario WHERE usuario_cedula = ?");

    if ($sql->execute([$cedula]))
      $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    else
      $resultado = [];
    return $resultado;
  }



  protected function GetAll()
  {
    $sql = $this->db->prepare("SELECT usuario.*, roles.*, sucursal.*  FROM usuario 
      INNER JOIN roles ON roles.roles_id = usuario.roles_id 
      INNER JOIN sucursal ON sucursal.sucursal_id = usuario.sucursal_id WHERE usuario_id > 56
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
      $sql = $this->db->prepare("INSERT INTO respuestas_user(user_id_respuesta, pregunta_id_respuesta, des_respuesta) VALUES(?,?,?)");
      $sql->execute([$this->id, $this->id_pregunta, $this->des_respuesta]);

      if ($sql->rowCount() > 0) {
        return [
          'data' => [
            'res' => "Respuesta registrada"
          ],
          'code' => 200
        ];
      } else {
        return [
          'data' => [
            'res' => "Respuesta no registrada"
          ],
          'code' => 400
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

  protected function Update_respuestas()
  {
    try {

      $sql = $this->db->prepare("UPDATE respuestas_user SET pregunta_id_respuesta =?, des_respuesta =? WHERE user_id_respuesta = ? AND pregunta_id_respuesta = ?");
      $sql->execute([$this->id_pregunta, $this->des_respuesta, $this->id, $this->id_pregunta]);

      if ($sql->rowCount() > 0) {
        return [
          'data' => [
            'res' => "Respuesta actualizada"
          ],
          'code' => 200
        ];
      } else {
        return [
          'data' => [
            'res' => "no se pudo actualizar"
          ],
          'code' => 400
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

  protected function getPreguntas(){
    try{
      $sql = $this->db->query("SELECT * FROM preguntas_user");

      if($sql->rowCount() > 0){
        return [
          'data' => [
            'res' => "Consulta exitosa",
            'lista_preguntas' => $sql->fetchAll(PDO::FETCH_ASSOC)
          ],
          'code' => 200
        ];
      }else{
        return [
          'data' => [
            'res' => "No hay registros disponibles",
            'lista_preguntas' => []
          ],
          'code' => 400
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

  protected function getPreguntasFromUser(){
    try{
      $sql = $this->db->query("SELECT preguntas_user.*,respuestas_user.* FROM usuario
        INNER JOIN respuestas_user ON respuestas_user.user_id_respuesta = usuario.usuario_id
        INNER JOIN preguntas_user ON preguntas_user.id_pregunta = respuestas_user.pregunta_id_respuesta  
        WHERE usuario.usuario_usuario = '$this->usuario'");

      if($sql->rowCount() > 0){
        return [
          'data' => [
            'res' => "Consulta exitosa",
            'lista_preguntas' => $sql->fetchAll(PDO::FETCH_ASSOC)
          ],
          'code' => 200
        ];
      }else{
        return [
          'data' => [
            'res' => "No hay registros disponibles",
            'lista_preguntas' => []
          ],
          'code' => 400
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

  // protected function Make_code_recovery($id_user){
  //   $code = $this->generateRandomString();

  //   $sql = "SELECT * FROM codigos_recuperacion WHERE char_code = '$code';";
  //   $result = $this->Query($sql);

  //   if($result->num_rows === 0){
  //     $datos = $this->Get_array($result);
  //     $this->Query("UPDATE codigos_recuperacion SET status_code = 0 WHERE id_user = $id_user;");

  //     $sql = "INSERT INTO codigos_recuperacion(date_cod, status_code, char_code, id_user) VALUES (NOW(),'1','$code',$id_user);";
  //     $this->Query($sql);

  //     return $code;
  //   }

  //   die("FALLO algo");
  //   $this->Make_code_recovery($id_user);
  // }

  // protected function SendEmail($code, $email){
  //   if(constant('username_email')  == '') die("Debes de tener configurada una cuenta de Correo electronico");
    
  //   $mail = new PHPMailer(true);
  //   $email_user = strtolower($email);
    
  //   try{
  //     ini_set( 'display_errors', 1 );
  //     error_reporting( E_ALL );

  //     $mail->SMTPDebug = 0;                              //Enable verbose debug output
  //     $mail->isSMTP();                                   //Send using SMTP
  //     $mail->Host       = 'smtp.gmail.com';              //Set the SMTP server to send through
  //     $mail->SMTPAuth   = true;                          //Enable SMTP authentication
  //     $mail->Username   = constant('username_email');    //SMTP username
  //     $mail->Password   = constant('password_email');    //SMTP password
  //     $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;   //Enable implicit TLS encryption
  //     $mail->Port       = constant('port_email');  

  //     //Recipients
  //     $mail->setFrom(constant('username_email'), 'Mailer');
  //     $mail->addAddress($email_user);     //Add a recipient

  //     //Content
  //     $mail->isHTML(true);                                  //Set email format to HTML
  //     $mail->Subject = 'Codigo de recuperacion';
  //     $mail->Body    = "Este es tu código de recuperación: <b>$code</b>";

  //     if(!$mail->send()) return false; else return true;
      
  //   }catch (Exception $e) {
  //     echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
  //   }
  // }

  // protected function generateRandomString($length = 8) { 
  //   return substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, $length); 
  // } 

  // protected function ValidacionCodigo($datos){
    
  //   $code = $datos['code'];
  //   $id_user = $datos['id'];

  //   $sql = "SELECT * FROM codigos_recuperacion WHERE char_code = '$code' AND id_user = $id_user AND status_code = 1;";
  //   $result = $this->Query($sql);

  //   if($result->num_rows > 0){

  //     return [
  //       'status' => true,
  //       'next' => 3,
  //       'id_user' => $id_user,
  //       'message' => [
  //         'code' => 'success',
  //         'msg' => "Código verificado!",
  //       ]
  //     ];
  //   }
  //   return [
  //     'status' => false,
  //     'next' => 2,
  //     'id_user' => $id_user,
  //     'message' => [
  //       'code' => 'error',
  //       'msg' => "Código incorrecto o invalido",
  //     ]
  //   ];
  // }
}
