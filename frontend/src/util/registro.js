 import $ from 'jquery'

 export const cambioJuridico = () => {
	if($("#rNatural").is(":checked")){
		//natural
		$("#lblCobranza").css("visibility", "hidden");
		$("#divCobranza").css("visibility", "hidden");
		$("#lblRepre").css("visibility", "hidden");
		$("#divRepre").css("visibility", "hidden");
		$("#lblNombre").html("Apellidos y Nombres: ");
		$("#lblcedula").html("Cédula: ");
	}else {
		//juridico
		$("#lblCobranza").css("visibility", "visible");
		$("#divCobranza").css("visibility", "visible");
		$("#lblRepre").css("visibility", "visible");
		$("#divRepre").css("visibility", "visible");
		$("#lblNombre").html("Razón Social: ");
		$("#lblcedula").html("R.I.F.: ");
	}
}


export const isValidEmailAddress = (emailAddress) => {
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
}
		  

	


		 
