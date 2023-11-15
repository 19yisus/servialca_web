import $ from "jquery";
import moment from "moment";

var respuesta = [];
export const cmes = (m) => {
  var mes = "";
  switch (m) {
    case 1:
      mes = "ENERO";
      break;
    case 2:
      mes = "FEBRERO";
      break;
    case 3:
      mes = "MARZO";
      break;
    case 4:
      mes = "ABRIL";
      break;
    case 5:
      mes = "MAYO";
      break;
    case 6:
      mes = "JUNIO";
      break;
    case 7:
      mes = "JULIO";
      break;
    case 8:
      mes = "AGOSTO";
      break;
    case 9:
      mes = "SEPTIEMBRE";
      break;
    case 10:
      mes = "OCTUBRE";
      break;
    case 11:
      mes = "NOVIEMBRE";
      break;
    case 12:
      mes = "DICIEMBRE";
      break;
    default:
      mes = "";
      break;
  }
  return mes;
};

export const nmes = (m) => {
  var mes = "";
  switch (m) {
    case "ENERO":
      mes = 1;
      break;
    case "FEBRERO":
      mes = 2;
      break;
    case "MARZO":
      mes = 3;
      break;
    case "ABRIL":
      mes = 4;
      break;
    case "MAYO":
      mes = 5;
      break;
    case "JUNIO":
      mes = 6;
      break;
    case "JULIO":
      mes = 7;
      break;
    case "AGOSTO":
      mes = 8;
      break;
    case "SEPTIEMBRE":
      mes = 9;
      break;
    case "OCTUBRE":
      mes = 10;
      break;
    case "NOVIEMBRE":
      mes = 11;
      break;
    case "DICIEMBRE":
      mes = 12;
      break;
    default:
      mes = "0";
      break;
  }
  return mes;
};

export const formatMoneda = (num, decSep, thousandSep, decLength) => {
  if (num === "") return "";
  var arg,
    entero,
    decLengthpow,
    sign = true;
  cents = "";
  if (typeof num === "undefined") return;
  if (typeof decLength === "undefined") decLength = 2;
  if (typeof decSep === "undefined") decSep = ",";
  if (typeof thousandSep === "undefined") thousandSep = ".";
  if (thousandSep === ".") arg = /\./g;
  else if (thousandSep === ",") arg = /\,/g;
  if (typeof arg != "undefined") num = num.toString().replace(arg, "");
  num = num.toString().replace(/,/g, ".");
  if (num.indexOf(".") != 1) entero = num.substring(0, num.indexOf("."));
  else entero = num;
  if (isNaN(num)) return "0";
  if (decLength > 0) {
    decLengthpow = Math.pow(10, decLength);
    sign = num === (num = Math.abs(num));
    num = Math.round(num * decLengthpow);
    var cents = num % decLengthpow;
    num = Math.floor(num / decLengthpow).toString();
    if (cents < 10) cents = "0" + cents;
  }
  if (thousandSep != "")
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
      num =
        num.substring(0, num.length - (4 * i + 3)) +
        thousandSep +
        num.substring(num.length - (4 * i + 3));
  else
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
      num =
        num.substring(0, num.length - (4 * i + 3)) +
        num.substring(num.length - (4 * i + 3));
  if (decLength > 0) return (sign ? "" : " ") + num + decSep + cents;
  else return (sign ? "" : " ") + num;
};

export const seleccionarCampo = (event) => {
  $(event.target).select();
};

export const validaMonto = (event) => {
  $(event.target).val(function (index, value) {
    return value
      .replace(/\D/g, "")
      .replace(/([0-9])([0-9]{2})$/, "$1,$2")
      .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ".");
  });
};

export const validaSoloNumero = (event) => {
  $(event.target).val(function (index, value) {
    return value.replace(/\D/g, "");
  });
};

export const validaSoloLetras = (event) => {
  $(event.target).val(function (index, value) {
    return value.replace(/^[0-9]+$/i, "", /^[0-9]+$/i).toUpperCase();
  });
};

export const validaNumeroTelefono = (inputtxt) => {
  //var tlfno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  var tlfno = /^\(?([0-9]{4})\)?[-. ]?([0-9]{7})$/;
  if (inputtxt.match(tlfno)) {
    return true;
  } else {
    return false;
  }
};

export const validaEmail = (inputtxt) => {
  //var tlfno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  var email = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  if (inputtxt.match(email)) {
    return true;
  } else {
    return false;
  }
};

export const habilitarcampos = (frm) => {
  $("#" + frm + " input").removeAttr("readonly");
  $("#" + frm + " input").removeAttr("disabled");
  $("#" + frm + ' input[type="radio"]').removeAttr("disabled");
  $("#" + frm + ' input[type="checkbox"]').removeAttr("disabled");
  $("#" + frm + " textarea").removeAttr("readonly");
  $("#" + frm + " textarea").removeAttr("disabled");
  $("#" + frm + " select").removeAttr("disabled");
  $("#" + frm + " .input-fecha").mask("99/99/9999");
  $("#" + frm + " .input-fecha").attr("placeholder", "dd/mm/aaaa");
  $("#" + frm + " .txtRif").mask("R-99999999-9");
  $("#" + frm + " .txtRif").attr("placeholder", "J-99999999-9");
};

export const habilitarcampo = (campo) => {
  $("#" + campo).removeAttr("readonly");
  $("#" + campo).removeAttr("disabled");
};

export function formatoMonto(val) {
  var valor = "";
  if (val.length == 1 && val !== "") valor = val + ",00";
  else valor = val;
  return valor;
}

export function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatFecha(fecha, format, sig) {
  let anio = fecha.substring(0, 4);
  let mes = fecha.substring(5, 7);
  let dia = fecha.substring(8, 10);

  if (format === "YYYY-MM-DD") {
    return anio + sig + mes + sig + dia;
  } else if (format === "DD-MM-YYYY") {
    return dia + sig + mes + sig + anio;
  } else if (format === "YYYY") {
    return anio;
  } else {
    return anio + sig + mes + sig + dia;
  }
}

var code;

export const Captcha = () => {
  var alpha = new Array(
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z"
  );
  var alpha2 = new Array("1", "2", "3", "4", "5", "6", "7", "8", "9", "0");
  var i;
  for (i = 0; i < 6; i++) {
    var a = alpha[Math.floor(Math.random() * alpha.length)];
    var b = alpha2[Math.floor(Math.random() * alpha2.length)];
    var c = alpha[Math.floor(Math.random() * alpha.length)];
    var d = alpha2[Math.floor(Math.random() * alpha2.length)];
    var e = alpha[Math.floor(Math.random() * alpha.length)];
    var f = alpha2[Math.floor(Math.random() * alpha2.length)];
    var g = alpha[Math.floor(Math.random() * alpha.length)];
  }
  var texto =
    a + " " + b + " " + " " + c + " " + d + " " + e + " " + f + " " + g;
  //CreaIMG(code);

  var ctxCanvas = document.getElementById("captcha").getContext("2d");
  var fontSize = "30px";
  var fontFamily = "Arial";
  var width = 250;
  var height = 50;
  //tamaño
  ctxCanvas.canvas.width = width;
  ctxCanvas.canvas.height = height;
  //color de fondo
  ctxCanvas.fillStyle = "whitesmoke";
  ctxCanvas.fillRect(0, 0, width, height);
  //puntos de distorsion
  ctxCanvas.setLineDash([7, 10]);
  ctxCanvas.lineDashOffset = 5;
  ctxCanvas.beginPath();
  var line;
  for (var i = 0; i < width; i++) {
    line = i * 5;
    ctxCanvas.moveTo(line, 0);
    ctxCanvas.lineTo(0, line);
  }
  ctxCanvas.stroke();
  //formato texto
  ctxCanvas.direction = "ltr";
  ctxCanvas.font = fontSize + " " + fontFamily;
  //texto posicion
  var x = width / 9;
  var y = (height / 3) * 2;
  //color del borde del texto
  ctxCanvas.strokeStyle = "yellow";
  ctxCanvas.strokeText(texto, x, y);
  //color del texto
  ctxCanvas.fillStyle = "red";
  ctxCanvas.fillText(texto, x, y);
  //document.getElementById('mainCaptcha').value=texto;
  code = texto;
  document.getElementById("txtInput").value = ""; //linea cambiada llamando a la función para crear la imagen en un canvas
};

export const ValidCaptcha = () => {
  var string1 = removeSpaces(code);

  var string2 = removeSpaces(document.getElementById("txtInput").value);

  if (string1 === string2) {
    document.getElementById("txtInput").value = "";
    return true;
  } else {
    Captcha();
    document.getElementById("txtInput").value = "";
    return false;
  }
};
export const removeSpaces = (string) => {
  return string.split(" ").join("");
};

/* export const mascara = (d, sep, pat, nums) => {


  var val = d.target.value;
  var largo = val.length;
  var val = val.split(sep);
  var val2 = '';
  for (let r = 0; r < val.length; r++) {
    val2 += val[r];
  }

  if (nums) {
    var letra = ''
    for (let z = 0; z < val2.length; z++) {
      if (isNaN(val2.charAt(z))) {
        letra = new RegExp(val2.charAt(z), "g");
        val2 = val2.replace(letra, "");
      }
    }
  }

  var val = '';
  var val3 = new Array();

  for (let s = 0; s < pat.length; s++) {
    val3[s] = val2.substring(0, pat[s]);
    val2 = val2.substr(pat[s]);
  }

  for (let q = 0; q < val3.length; q++) {
    if (q === 0) {
      val = val3[q];
    }
    else {
      if (val3[q] != "") {
        val += sep + val3[q];
      }
    }
  }
  $(event.target).val(val);

} */

/* export const validarRif = (d) => {


  var pat = new Array(1, 8, 1);
  var val = d.target.value;
  var largo = val.length;
  var sep = '-';
  var val = val.split(sep);
  var val2 = '';
  for (let r = 0; r < val.length; r++) {
    val2 += val[r];
  }

  var val = '';
  var val3 = new Array();

  for (let s = 0; s < pat.length; s++) {
    val3[s] = val2.substring(0, pat[s]);
    val2 = val2.substr(pat[s]);
  }

  for (let q = 0; q < val3.length; q++) {
    if (q === 0) {
      val = val3[q];
    } else {
      if (val3[q] != "") {
        val += sep + val3[q];
      }
    }
  }
  if (val.toUpperCase().substring(0, 1) !== 'J'
    && val.toUpperCase().substring(0, 1) !== 'P'
    && val.toUpperCase().substring(0, 1) !== 'V'
    && val.toUpperCase().substring(0, 1) !== 'E'
    && val.toUpperCase().substring(0, 1) !== 'G') {
    val = '';
  }
  if (val.length > 2) {
    var letra = '';
    var size = 0;
    if (val.length > 10) {
      size = 10;
    } else {
      size = val.length;
    }
    for (let z = 2; z < size; z++) {
      if (isNaN(val.charAt(z))) {
        letra = new RegExp(val.charAt(z), "g");
        if (z === 2) {
          val = val.replace(letra, "").replace("-", "");
        } else {
          val = val.replace(letra, "");
        }

      }
    }
  }
  if (val.length > 10) {

    for (let y = 11; y < val.length; y++) {
      if (isNaN(val.charAt(y))) {
        letra = new RegExp("-" + val.charAt(y), "g");
        val = val.replace(letra, "");
      }
    }
  }
  $(event.target).val(val.toUpperCase());

} */

export const validaNumRif = (inputtxt) => {
  var rif = /^([VEJPGvejpg]{1})-([0-9]{8})-([0-9]{1}$)/;
  if (inputtxt.match(rif)) {
    return true;
  } else {
    return false;
  }
};

export const validaNumRifSinGuion = (inputtxt) => {
  var rif = /^([VEJPGvejpg]{1})([0-9]{8})([0-9]{1}$)/;
  if (inputtxt.match(rif)) {
    return true;
  } else {
    return false;
  }
};

export const validarArchivoRetencion = (event) => {
  var archivo = event.target.files[0];
  if (!archivo) {
    return;
  }
  var lector = new FileReader();

  lector.readAsText(archivo);
  //lector.onload = cargarArchivo(event);
  var resp = (lector.onload = function (e) {
    var contenido = e.target.result;
    var lineas = contenido.split("\n");

    respuesta = validarCamposArchivo(lineas);
    return respuesta;
    /*var cont = 0;
    for (var linea of lineas) {
      cont++;
      alert('linea: ' + cont + ' ' + linea)
    }*/
  });
  //lector.readAsText(archivo);
  respuesta = resp;
  return respuesta;
};

export const validarCamposArchivo = (datos) => {
  var fila = [];
  var resp = [];
  var msj = "";
  var pat = "";
  var mat = true;
  var valido = true;
  var filaLlena = -1;
  var filaVacia = -1;
  for (let i = 0; i < datos.length; i++) {
    if (datos[i].toString().trim().length > 0) {
      filaLlena = i;
      if ((filaLlena > filaVacia) & (filaVacia >= 0)) {
        console.error("LA LINEA " + i + " ESTA VACIA");
        console.error("ARCHIVO INVALIDO");

        valido = false;
        msj = "LA LINEA " + i + " ESTA VACIA ARCHIVO INVALIDO";
        resp.push(false);
        resp.push(msj);
        //respuesta.put("msj","LA LINEA " + i + " ESTA VACIA ARCHIVO INVALIDO");
        //return false;
        return resp;
      }
      //fila = datos[i].toString().split("\t");
      fila = datos[i].toString().split("\t");
      for (let j = 0; j < fila.length; j++) {
        switch (j) {
          case 0:
            if (
              fila[j].trim().replace("\uFEFF", "").length > 5 ||
              !fila[j].trim().replace("\uFEFF", "").match("\\d{4,5}")
            ) {
              console.error(
                "CODIGO O NUMERO DE AGENTE DE RETENCION " +
                  fila[j] +
                  " INVALIDO LINEA " +
                  (i + 1)
              );
              console.error("ARCHIVO INVALIDO");

              valido = false;
              msj =
                "CODIGO O NUMERO DE AGENTE DE RETENCION " +
                fila[j] +
                " INVALIDO LINEA " +
                (i + 1) +
                " ARCHIVO INVALIDO";
              resp.push(false);
              resp.push(msj);
              return resp;
            }

            break;
          case 1:
            pat = "^[JVGE]-\\d{8}-\\d{1}$";

            // Asociar el string al patron

            //mat = pat.matcher(fila[j].trim());
            if (!fila[j].trim().match(pat)) {
              console.error(
                "RIF AGENTE DE RETENCION " +
                  fila[j] +
                  " INVALIDO LINEA " +
                  (i + 1)
              );
              console.error("ARCHIVO INVALIDO");
              //msj="RIF AGENTE DE RETENCION " + fila[j] + " INVALIDO LINEA " + (i+1)+ "ARCHIVO INVALIDO";
              valido = false;
              msj =
                "RIF AGENTE DE RETENCION " +
                fila[j] +
                " INVALIDO LINEA " +
                (i + 1) +
                " ARCHIVO INVALIDO";
              resp.push(false);
              resp.push(msj);
              return resp;
            }

            break;

          case 2:
            pat = "^[DT]$";

            // Asociar el string al patron
            //mat = pat.matcher(fila[j].trim());
            if (!fila[j].trim().match(pat)) {
              console.error(
                "TIPO CONTRIBUYENTE '" +
                  fila[j].trim() +
                  "' INVALIDO LINEA " +
                  (i + 1)
              );
              console.error("ARCHIVO INVALIDO");
              valido = false;
              msj =
                "TIPO CONTRIBUYENTE '" +
                fila[j].trim() +
                "' INVALIDO LINEA " +
                (i + 1) +
                " ARCHIVO INVALIDO";
              resp.push(false);
              resp.push(msj);
              return resp;
            }

            break;

          case 3:
            pat = "^\\d{4}$";

            // Asociar el string al patron
            //mat = pat.matcher(fila[j].trim());
            if (!fila[j].trim().match(pat)) {
              console.error(
                "AÑO DEL PERIODO IMPOSITIVO " +
                  fila[j] +
                  " INVALIDO LINEA " +
                  (i + 1)
              );
              console.error("ARCHIVO INVALIDO");
              //msj= "AÑO DEL PERIODO IMPOSITIVO " + fila[j] + " INVALIDO LINEA " + (i+1) + "ARCHIVO INVALIDO";
              valido = false;
              msj =
                "AÑO DEL PERIODO IMPOSITIVO " +
                fila[j] +
                " INVALIDO LINEA " +
                (i + 1) +
                " ARCHIVO INVALIDO";
              resp.push(false);
              resp.push(msj);
              return resp;
            }

            break;

          case 4:
            pat = "[0][1-9]|[1][0-2]$";

            // Asociar el string al patron
            //mat = pat.matcher(fila[j].trim());
            if (!fila[j].trim().match(pat)) {
              console.error(
                "MES DEL PERIODO IMPOSITIVO " +
                  fila[j].trim() +
                  " INVALIDO LINEA " +
                  (i + 1)
              );
              console.error("ARCHIVO INVALIDO");
              //msj= "MES DEL PERIODO IMPOSITIVO " + fila[j].trim() + " INVALIDO LINEA " + (i+1) + "ARCHIVO INVALIDO";
              valido = false;
              msj =
                "MES DEL PERIODO IMPOSITIVO " +
                fila[j].trim() +
                " INVALIDO LINEA " +
                (i + 1) +
                " ARCHIVO INVALIDO";
              resp.push(false);
              resp.push(msj);
              return resp;
            }

            break;

          case 5:
            if (fila[j].trim().length > 5 || !fila[j].match("\\d{4,5}[' ']*")) {
              console.error(
                "CODIGO O NUMERO DE AGENTE RETENIDO " +
                  fila[j] +
                  " INVALIDO LINEA " +
                  (i + 1)
              );
              console.error("ARCHIVO INVALIDO");
              //msj= "CODIGO O NUMERO DE AGENTE RETENIDO " + fila[j] + " INVALIDO LINEA " + (i+1) + "ARCHIVO INVALIDO";
              valido = false;
              msj =
                "CODIGO O NUMERO DE AGENTE RETENIDO " +
                fila[j] +
                " INVALIDO LINEA " +
                (i + 1) +
                " ARCHIVO INVALIDO";
              resp.push(false);
              resp.push(msj);
              return resp;
            }

            break;

          case 6:
            pat = "^[JVGE]-\\d{8}-\\d{1}$";

            // Asociar el string al patron
            //mat = pat.matcher(fila[j].trim());
            if (!fila[j].trim().match(pat)) {
              console.error(
                "RIF DEL SUJETO RETENIDO " +
                  fila[j] +
                  " INVALIDO LINEA " +
                  (i + 1)
              );
              console.error("ARCHIVO INVALIDO");
              //msj="RIF DEL SUJETO RETENIDO " + fila[j] + " INVALIDO LINEA " + (i+1) + "ARCHIVO INVALIDO";
              valido = false;
              msj =
                "RIF DEL SUJETO RETENIDO " +
                fila[j] +
                " INVALIDO LINEA " +
                (i + 1) +
                " ARCHIVO INVALIDO";
              resp.push(false);
              resp.push(msj);
              return resp;
            }

            break;

          case 7:
            if (fila[j].trim() === "") {
              console.error(
                "NOMBRE DEL SUJETO RETENIDO '" +
                  fila[j].trim() +
                  "' INVALIDO LINEA " +
                  (i + 1)
              );
              console.error("ARCHIVO INVALIDO");
              //msj= "NOMBRE DEL SUJETO RETENIDO '" + fila[j].trim() + "' INVALIDO LINEA " + (i+1) + "ARCHIVO INVALIDO";
              valido = false;
              msj =
                "NOMBRE DEL SUJETO RETENIDO '" +
                fila[j].trim() +
                "' INVALIDO LINEA " +
                (i + 1) +
                " ARCHIVO INVALIDO";
              resp.push(false);
              resp.push(msj);
              return resp;
            }

            break;

          case 8:
            pat = "^([0][1-9]|[12][0-9]|3[01])/([0][1-9]|[1][0-2])/(\\d{4})$";

            // Asociar el string al patron
            //mat = pat.matcher(fila[j].trim());
            if (!fila[j].trim().match(pat)) {
              console.error(
                "FECHA DE FACTURA " + fila[j] + " INVALIDA LINEA " + (i + 1)
              );
              console.error("ARCHIVO INVALIDO");
              //msj= "FECHA DE FACTURA " + fila[j] + " INVALIDA LINEA " + (i+1) + "ARCHIVO INVALIDO";
              valido = false;
              msj =
                "FECHA DE FACTURA " +
                fila[j] +
                " INVALIDA LINEA " +
                (i + 1) +
                " ARCHIVO INVALIDO";
              resp.push(false);
              resp.push(msj);
              return resp;
            }

            break;

          case 9:
            /*if(fila[j].trim().length() > 6 || !fila[j].trim().matches("\\d{5,6}")){
              console.error("NUMERO DE FACTURA DE LA OPERACION " + fila[j] + " INVALIDO LINEA " + (i+1));
              console.error("ARCHIVO INVALIDO");
              //msj="NUMERO DE FACTURA DE LA OPERACION " + fila[j] + " INVALIDO LINEA " + (i+1) + "ARCHIVO INVALIDO";
              respuesta.clear();
                          respuesta.put("valido", false);
                          msj= "NUMERO DE FACTURA DE LA OPERACION " + fila[j] + " INVALIDO LINEA " + (i + 1) + " ARCHIVO INVALIDO";
                          respuesta.put("msj",msj);
                          resp.push(false);
                          resp.push(msj);
                          //respuesta.put("msj", "NUMERO DE FACTURA DE LA OPERACION " + fila[j] + " INVALIDO LINEA " + (i+1) + "ARCHIVO INVALIDO");
                        //return false;	
                          return resp;
            }*/

            break;

          case 10:
            /*if(!fila[j].trim().matches("^[0-9][0-9]-\\d{5,8}$")){
              console.error("NUMERO DE CONTROL DE LA OPERACION " + fila[j] + " INVALIDO LINEA " + (i+1));
              console.error("ARCHIVO INVALIDO");
              //msj= "NUMERO DE CONTROL DE LA OPERACION " + fila[j] + " INVALIDO LINEA " + (i+1) + "ARCHIVO INVALIDO";
              respuesta.clear();
                          respuesta.put("valido", false);
                          msj= "NUMERO DE CONTROL DE LA OPERACION " + fila[j] + " INVALIDO LINEA " + (i+1) + " ARCHIVO INVALIDO";
                          respuesta.put("msj",msj);
                          resp.push(false);
                          resp.push(msj);
                          //respuesta.put("msj", "NUMERO DE CONTROL DE LA OPERACION " + fila[j] + " INVALIDO LINEA " + (i+1) + "ARCHIVO INVALIDO";
                        //return false;
                          return resp;
            }*/

            break;

          case 11:
            pat = "(\\d{4})([0][1-9]|[1][0-2])(\\d{1,14})$";

            // Asociar el string al patron
            //mat = pat.matcher(fila[j].trim());
            if (fila[j].trim().length < 7 || !fila[j].trim().match(pat)) {
              console.error(
                "NUMERO DE COMPROBANTE DE RETENCION " +
                  fila[j] +
                  " INVALIDO LINEA " +
                  (i + 1)
              );
              console.error("ARCHIVO INVALIDO");
              //msj="NUMERO DE COMPROBANTE DE RETENCION " + fila[j] + " INVALIDO LINEA " + (i+1) + "ARCHIVO INVALIDO";
              valido = false;
              msj =
                "NUMERO DE COMPROBANTE DE RETENCION " +
                fila[j] +
                " INVALIDO LINEA " +
                (i + 1) +
                " ARCHIVO INVALIDO";
              resp.push(false);
              resp.push(msj);
              return resp;
            }

            break;

          case 12:
            pat = "^([0][1-9]|[12][0-9]|3[01])/([0][1-9]|[1][0-2])/(\\d{4})$";

            // Asociar el string al patron
            //mat = pat.matcher(fila[j].trim());
            if (!fila[j].trim().match(pat)) {
              console.error(
                "FECHA DE RETENCIÓN " + fila[j] + " INVALIDA LINEA " + (i + 1)
              );
              console.error("ARCHIVO INVALIDO");
              //msj="FECHA DE RETENCIÓN " + fila[j] + " INVALIDA LINEA " + (i+1) + "ARCHIVO INVALIDO";
              valido = false;
              msj =
                "FECHA DE RETENCIÓN " +
                fila[j] +
                " INVALIDA LINEA " +
                (i + 1) +
                " ARCHIVO INVALIDO";
              resp.push(false);
              resp.push(msj);
              return resp;
            }

            break;

          case 13:
            pat = "^-?\\d*\\,{0,1}\\d+$";

            // Asociar el string al patron
            //mat = pat.matcher(fila[j].trim());
            if (!fila[j].trim().match(pat)) {
              console.error(
                "TOTAL MONTO SUJETO A RETENCION " +
                  fila[j] +
                  " INVALIDO LINEA " +
                  (i + 1)
              );
              console.error("ARCHIVO INVALIDO");
              //msj="TOTAL MONTO SUJETO A RETENCION " + fila[j] + " INVALIDO LINEA " + (i+1) + "ARCHIVO INVALIDO";
              valido = false;
              msj =
                "TOTAL MONTO SUJETO A RETENCION " +
                fila[j] +
                " INVALIDO LINEA " +
                (i + 1) +
                " ARCHIVO INVALIDO";
              resp.push(false);
              resp.push(msj);
              return resp;
            }

            break;

          case 14:
            pat = "\\d{1,3},\\d{1,2}%$";

            // Asociar el string al patron
            //mat = pat.matcher(fila[j].trim());
            if (!fila[j].trim().match(pat)) {
              console.error(
                "% DE ALICUOTA " + fila[j] + " INVALIDO LINEA " + (i + 1)
              );
              console.error("ARCHIVO INVALIDO");
              //msj="% DE ALICUOTA " + fila[j] + " INVALIDO LINEA " + (i+1) + "ARCHIVO INVALIDO";
              valido = false;
              msj =
                "% DE ALICUOTA " +
                fila[j] +
                " INVALIDO LINEA " +
                (i + 1) +
                " ARCHIVO INVALIDO";
              resp.push(false);
              resp.push(msj);
              return resp;
            }

            break;

          case 15:
            pat = "^-?\\d*\\,{0,1}\\d+$";

            // Asociar el string al patron
            //mat = pat.matcher(fila[j].trim());
            if (!fila[j].trim().match(pat)) {
              console.error(
                "TOTAL DE IMPUESTO RETENIDO " +
                  fila[j] +
                  " INVALIDO LINEA " +
                  (i + 1)
              );
              console.error("ARCHIVO INVALIDO");
              //msj="TOTAL DE IMPUESTO RETENIDO " + fila[j] + " INVALIDO LINEA " + (i+1) + "ARCHIVO INVALIDO";
              valido = false;
              msj =
                "TOTAL DE IMPUESTO RETENIDO " +
                fila[j] +
                " INVALIDO LINEA " +
                (i + 1) +
                " ARCHIVO INVALIDO";
              resp.push(false);
              resp.push(msj);
              return resp;
            }

            break;

          /*case 16:

            filaVacia = i;
            if(filaLlena > filaVacia & filaVacia >= 0){
              //console.error("FILA " + i + " ESTA VACIA");
              //console.error("ARCHIVO INVALIDO");
              respuesta.clear();
                          respuesta.put("valido", false);
                          respuesta.put("msj", "FILA " + i + " ESTA VACIA ARCHIVO INVALIDO");
                        return false;
            	
            }
            	
            break;*/
          default:
            break;
        }
      }
    } else {
      filaVacia = i;
      if ((filaLlena > filaVacia) & (filaVacia >= 0)) {
        console.error("FILA " + i + " ESTA VACIA");
        console.error("ARCHIVO INVALIDO");
        //msj="FILA " + i + " ESTA VACIA ARCHIVO INVALIDO";
        valido = false;
        msj = "FILA " + i + " ESTA VACIA ARCHIVO INVALIDO";
        resp.push(false);
        resp.push(msj);
        return resp;
      }
    }
  }
  if (valido) {
    resp.push(true);
    resp.push("ARCHIVO VALIDO");
    return resp;
  }
};

export const cargarCamposArchivo = (datos, tipoage) => {
  var fila = [];
  var rete = [];
  var txtAgente = "";
  var cmbTipo = "";
  var txtAnio = "";
  var txtMes = "";
  var txtCodContri = "";
  var txtNumComprobante = "";
  var txtFecComprobante = "";
  var txtRifAgente = "";
  var txtRifContri = "";
  var txtRazonSoc = "";
  var txtNumControl = "";
  var txtNumFactura = "";
  var txtFecFactura = "";
  var txtMonBruto = "";
  var txtAlicuota = "";
  var txtMonRete = "";
  var fecha = "";

  moment.locale("es");
  for (let i = 0; i < datos.length; i++) {
    if (datos[i].toString().trim().length > 0) {
      fila = datos[i].toString().split("\t");
      for (let j = 0; j < fila.length; j++) {
        switch (j) {
          case 0:
            txtAgente = fila[j].trim().replace("\uFEFF", "");
            break;
          case 1:
            txtRifAgente = fila[j].trim();
            break;

          case 2:
            cmbTipo = fila[j].trim();
            break;

          case 3:
            txtAnio = fila[j].trim();
            break;

          case 4:
            txtMes = fila[j].trim();
            break;

          case 5:
            txtCodContri = fila[j].trim();
            break;

          case 6:
            txtRifContri = fila[j].trim();
            break;

          case 7:
            txtRazonSoc = fila[j].trim();

            break;

          case 8:
            //txtFecFactura = fila[j].trim();
            fecha = fila[j].trim().split("/");
            txtFecFactura =
              fecha[2].trim() + "-" + fecha[1].trim() + "-" + fecha[0].trim();

            break;

          case 9:
            txtNumFactura = fila[j].trim();

            break;

          case 10:
            txtNumControl = fila[j].trim();

            break;

          case 11:
            txtNumComprobante = fila[j].trim();

            break;

          case 12:
            //txtFecComprobante = fila[j].trim();
            fecha = fila[j].trim().split("/");
            txtFecComprobante =
              fecha[2].trim() + "-" + fecha[1].trim() + "-" + fecha[0].trim();

            break;

          case 13:
            txtMonBruto = fila[j].trim();

            break;

          case 14:
            txtAlicuota = fila[j].trim();

            break;

          case 15:
            txtMonRete = fila[j].trim();

            break;

          default:
            break;
        }
      }
      rete.push({
        txtagente: txtAgente,
        codcontri: txtCodContri,
        tipo: cmbTipo,
        rif: txtRifContri,
        feccompro: moment(txtFecComprobante.toString()).format("YYYY-MM-DD"),
        numcontrol: txtNumControl,
        numcompro: txtNumComprobante,
        nombre: txtRazonSoc,
        monbruto: txtMonBruto.replace(",", "."),
        periodo: txtMes + "-" + txtAnio,
        alicuota: txtAlicuota.replace(",", ".").replace("%", ""),
        numfact: txtNumFactura,
        monrete: txtMonRete.replace(",", "."),
        fecfact: moment(txtFecFactura.toString()).format("YYYY-MM-DD"),
        tipoagente: tipoage,
      });
    }
  }
  return rete;
};

export const generar = (longitud) => {
  var long = parseInt(longitud);
  var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789";
  var contraseña = "";
  for (var i = 0; i < long; i++)
    contraseña += caracteres.charAt(
      Math.floor(Math.random() * caracteres.length)
    );
  return contraseña;
};
