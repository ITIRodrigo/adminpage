// Initialize Firebase
		  var config = {
		    apiKey: "AIzaSyAgMA5t92w6cnLIdS7rwH99dBa2DaWXuYc",
		    authDomain: "administracion-4a90f.firebaseapp.com",
		    databaseURL: "https://administracion-4a90f.firebaseio.com",
		    projectId: "administracion-4a90f",
		    storageBucket: "administracion-4a90f.appspot.com",
		    messagingSenderId: "1029975380688"
		  };
		  firebase.initializeApp(config);
// 0. Autenticar

var ingresar = function(){
	var email = document.getElementById("correo").value;
	var password = document.getElementById("password").value;


	firebase.auth().signInWithEmailAndPassword(email, password)
	.then(function(){
		console.log("Ingresaste correctamente");
		window.location = "insert.html";
	})
	.catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  console.log("Error en la autenticación: " + errorCode + " " + errorMessage);
	  // ...
	});
}

// observador de el estado de autenticacion

firebase.auth().onAuthStateChanged(function(user){
	if (user) {
		//console.log("Autorizado");
	}else{
		console.log("No Autorizado");
		if (window.location.pathname !== "/index.html") {
			window.location = "index.html"
		}
	}
});

var salir = function() {
	firebase.auth().signOut().then(function(){
		console.log("sesion terminada");
	}, function(error) {
		console.log("Error al cerrar sesion: " + error);
	});
}


// 1. crear Platillo

var database = firebase.database();

	var addPlatillo = function(pNombre, pDescripcion, pPrecio, pDimagen) {
		database.ref('Alimentos/').push({nombre: pNombre, 
			descripcion: pDescripcion, precio: pPrecio,
			cantidad: 0,
			direccion: pDimagen
		}).then(function(){
			alert("Platillo agregado correctamente");
			window.location="insert.html";
		}).catch(function(error){
			alert("ERROR al ingresar el nuevo platillo: " + error);
		})
	}

function funcionDeLaForma(event) {
	event.preventDefault();
	var nombre = document.getElementById("nombre").value;
	var descripcion = document.getElementById("descripcion").value;
	var precio = document.getElementById("precio").value;
	var dimagen = document.getElementById("dimagen").value;

	
	try{
		addPlatillo(nombre, descripcion, precio, dimagen);
		alert("Platillo agregado correctamente")
	}catch(error){
		alert("ERROR al ingresar el nuevo platillo" + error);
	}
	return false;
}

	var storage = firebase.storage();
	var storageRef = storage.ref();

function visualizar() {
	var preview = document.querySelector('img');
	var archivo = document.querySelector('input[type=file]').files[0];
	var lector = new FileReader();

	lector.onloadend = function(){
		preview.src=lector.result;
	}

	if(archivo){
		lector.readAsDataURL(archivo);
		
		var subirImagen = storageRef.child('platillos/' + archivo.name).getDownloadURL().then(function(url) {
     	document.getElementById('dimagen').value = url;
     	});
	}
	else{
		preview.src="";
	}
}

// 2. leer Platillos
var imprimirPlatillos = function() {

	var query = database.ref('Alimentos/');
	query.once('value', function(snapshot){
		var ul = document.getElementById("lista")
		//console.log(snapshot.val());
		snapshot.forEach(function(childSnapshot) {
			console.log(childSnapshot.key);
			console.log(childSnapshot.val());

			var childKey = childSnapshot.key;
			var childData = childSnapshot.val();

			var li = document.createElement("li");
			var div = document.createElement("div");
			var img = document.createElement("img");
			var br = document.createElement("br");
			var btn = document.createElement("button");

			btn.setAttribute("id",childKey);
			btn.setAttribute("class","btn btn-danger");
			btn.setAttribute("onclick","eliminarPlatillos(this.id)");
			btn.appendChild(document.createTextNode("Eliminar"));

			img.src= childData.direccion;
			img.height = 60;
			img.alt = "Imagen del Platillo";

			div.appendChild(img);
			div.style.float = "right"
			li.setAttribute("class","list-group-item");
			li.setAttribute("id","'" + childKey + "'");
			li.appendChild(div);
			li.appendChild(document.createTextNode("Nombre: "+ childData.nombre));
			li.appendChild(document.createElement("br"));
			li.appendChild(document.createTextNode("Descripción: "+ childData.descripcion));
			li.appendChild(document.createElement("br"));
			li.appendChild(document.createTextNode("Precio: "+ childData.precio));
			li.appendChild(document.createElement("br"));
			li.appendChild(btn);
			ul.appendChild(li);
		})
	})
}
// 3. Eliminar Platillos

var eliminarPlatillos = function (id) {
	database.ref('Alimentos/' + id).remove()
	.then(function() {
		alert("Platillo eliminado correctamente");
		var ul = document.getElementById("lista");
		var li = document.getElementById("'" + id + "'");
		ul.removeChild(li);
		//window.location="platillos.html";
	})
	.catch(function(error) {
		console.log("ERROR al eliminar el Platillo");
	})
}

//BEBIDAS
//Imagen
function visualizarBebidas() {
	var preview = document.querySelector('img');
	var archivo = document.querySelector('input[type=file]').files[0];
	var lector = new FileReader();

	lector.onloadend = function(){
		preview.src=lector.result;
	}

	if(archivo){
		lector.readAsDataURL(archivo);
		
		var subirImagen = storageRef.child('bebidas/' + archivo.name).getDownloadURL().then(function(url) {
     	document.getElementById('dimagen').value = url;
     	});
	}
	else{
		preview.src="";
	}
}

//Form
var addBebida = function(pNombre, pDescripcion, pPrecio, pDimagen) {
		database.ref('bebidas/').push({nombre: pNombre, 
			descripcion: pDescripcion, precio: pPrecio,
			cantidad: 0,
			direccion: pDimagen
		}).then(function(){
			alert("Bebida agregada correctamente");
			window.location="addbebidas.html";
		}).catch(function(error){
			alert("ERROR al ingresar la nueva Bebida: " + error);
		})
	}

function funcionDeLaFormaB(event) {
	event.preventDefault();
	var nombre = document.getElementById("nombre").value;
	var descripcion = document.getElementById("descripcion").value;
	var precio = document.getElementById("precio").value;
	var dimagen = document.getElementById("dimagen").value;

	
	try{
		addBebida(nombre, descripcion, precio, dimagen);
		alert("Bebida agregada correctamente")
	}catch(error){
		alert("ERROR al ingresar la nueva Bebida" + error);
	}
	return false;
}

// imprimir bebidas
var imprimirBebidas = function() {

	var query = database.ref('bebidas/');
	query.on('value', function(snapshot){
		var ul = document.getElementById("lista")
		//console.log(snapshot.val());
		snapshot.forEach(function(childSnapshot) {
			console.log(childSnapshot.key);
			console.log(childSnapshot.val());

			var childKey = childSnapshot.key;
			var childData = childSnapshot.val();

			var li = document.createElement("li");
			var div = document.createElement("div");
			var img = document.createElement("img");
			var br = document.createElement("br");
			var btn = document.createElement("button");

			btn.setAttribute("id",childKey);
			btn.setAttribute("class","btn btn-danger");
			btn.setAttribute("onclick","eliminarBebidas(this.id)");
			btn.appendChild(document.createTextNode("Eliminar"));

			img.src= childData.direccion;
			img.height = 60;
			img.alt = "Imagen de la bebida";

			div.appendChild(img);
			div.style.float = "right"
			li.setAttribute("class","list-group-item");
			li.setAttribute("id","'" + childKey + "'");
			li.appendChild(div);
			li.appendChild(document.createTextNode("Nombre: "+ childData.nombre));
			li.appendChild(document.createElement("br"));
			li.appendChild(document.createTextNode("Descripción: "+ childData.descripcion));
			li.appendChild(document.createElement("br"));
			li.appendChild(document.createTextNode("Precio: "+ childData.precio));
			li.appendChild(document.createElement("br"));
			li.appendChild(btn);
			ul.appendChild(li);
		})
	})
}

//eliminar bebidas
var eliminarBebidas = function (id) {
	database.ref('bebidas/' + id).remove()
	.then(function() {
		alert("Bebida eliminado correctamente");
		var ul = document.getElementById("lista");
		var li = document.getElementById("'" + id + "'");
		ul.removeChild(li);
		//window.location="bebidas.html";
	})
	.catch(function(error) {
		console.log("ERROR al eliminar la Bebida")
	})
}