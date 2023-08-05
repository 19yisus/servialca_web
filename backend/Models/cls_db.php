<?php

require('../vendor/autoload.php');
$dotenv = Dotenv\Dotenv::createImmutable('../');
$dotenv->load();

abstract class cls_db
{
  private $username, $password, $host, $dbname, $driver, $charset;
  protected $db;

  public function __construct()
  {
    $this->username = $this->password = $this->host = $this->driver = $this->charset = null;

    $this->username = $_ENV['USERNAME_DB'];
    $this->password = $_ENV['PASSWORD_DB'];
    $this->host = $_ENV['HOST_DB'];
    $this->driver = $_ENV['DRIVER_DB'];
    $this->charset = $_ENV['CHARSET_DB'];
    $this->dbname = $_ENV['DB_NAME'];
  }

  public function conecion()
  {
    $this->db = new PDO("$this->driver:host=$this->host;dbname=$this->dbname", $this->username, $this->password);
  }

  public function __destruct()
  {
    $this->db = null;
  }
}
