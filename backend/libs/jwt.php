<?php
require('./vendor/autoload.php');
$dotenv = Dotenv\Dotenv::createImmutable('./');
$dotenv->load();

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function createToken($id, $permisos)
{
  $time = time();

  $token = array(
    "iat" => $time, //tiempo inicio del token
    "exp" => $time + (60 * 60 * 24), //token expira en 1 dia
    "data" => [
      "id" => $id,
      "permisos" => $permisos
    ]
  );

  $jwt = JWT::encode($token, $_ENV['SECRET'], 'HS256');

  return $jwt;
}

function validateToken($token)
{
  $array = decodificarToken($token);

  if($array['iat'] > $array['exp']){
    // token expirado
    return false;
  }

  return true;
}

function decodificarToken($token){
  $token_decode = JWT::decode($token, new Key($_ENV['SECRET'], 'HS256'));
  $array = (array) $token_decode;
  return $array;
}
