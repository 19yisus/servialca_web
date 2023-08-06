<?php
  class Con_saludo{

    public function saludo(){
      $pass = $_POST['password'];
      $newPass = password_hash($pass, PASSWORD_BCRYPT, ['cost' => 12]);
      Response($newPass, 200);
    }
  }