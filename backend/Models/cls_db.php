<?php

require('./vendor/autoload.php');
$dotenv = Dotenv\Dotenv::createImmutable('./');
$dotenv->load();

abstract class cls_db
{
  private $username, $password, $host, $dbname, $driver, $charset;
  protected $db;
  public $user_id;

  public function __construct()
  {
    if (isset($_POST['token']) || isset($_GET['token'])) {
      $array = decodificarToken(isset($_POST['token']) ? $_POST['token'] : $_GET['token'])['data'];
      $token = (array) $array;
      $this->user_id = $token['id'];
    }

    $this->username = $this->password = $this->host = $this->driver = $this->charset = null;

    $this->username = $_ENV['USERNAME_DB'];
    $this->password = $_ENV['PASSWORD_DB'];
    $this->host = $_ENV['HOST_DB'];
    $this->driver = $_ENV['DRIVER_DB'];
    $this->charset = $_ENV['CHARSET_DB'];
    $this->dbname = $_ENV['DB_NAME'];
    $this->conexion();
  }

  protected function conexion()
  {
    $this->db = new PDO("$this->driver:host=$this->host;dbname=$this->dbname", $this->username, $this->password);
  }

  protected function reg_bitacora($datos_array)
  {
    $descripcion = $datos_array['des'];
    $table_name = $datos_array['table_name'];

    $sql = "INSERT INTO bitacora(descripcion, table_change, hora_fecha, id_usuario) VALUES('$descripcion','$table_name',NOW(),$this->user_id)";
    $this->db->query($sql);
  }


  public function __destruct()
  {
    $this->db = null;
  }
}
