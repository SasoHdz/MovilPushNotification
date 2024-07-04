class Home {
  constructor() {}

  LoadUsers() {
    home.showLoader();
    $.ajax({
      url: API + "/WepApi/Users",
      type: "GET",
      success: function (response) {
        console.log("Success:", response);
        let html = "";
        response.forEach((element) => {
          const e = `
             <ion-item>
                  <ion-label>
                  ${
                    element.nombre +
                    " " +
                    element.appaterno +
                    " " +
                    element.apmaterno
                  }
                   </ion-label>
                   <ion-label>
                  ${element.email}
                   </ion-label>
              </ion-item>
            `;

          html += e;
        });

        $("#list-users").html(html);
        home.hideLoader();
      },
      error: function (error) {
        console.error("Error:", error);
        alert("Hubo un error al obtener los datos : " + error);
        home.hideLoader();
      },
    });
  }

  showAlert() {
    const alert = document.createElement("ion-alert");
    alert.header = "Alert";
    alert.message = "This is an alert!";
    alert.buttons = ["OK"];

    document.body.appendChild(alert);
    return alert.present();
  }

  cleanForm() {
    $("#email").val("");
    $("#nombre").val("");
    $("#apellidoPaterno").val("");
    $("#apellidoMaterno").val("");
  }

  showLoader() {
    $("#loader").removeClass("d-none");
  }

  hideLoader() {
    $("#loader").addClass("d-none");
  }
}
//Key publica para comunicacion con WEB PUSH
const VAPID_PUBLIC_KEY =
  "BNyftv47636byp0LRWTP7c1e7GAOWUmjvYAnn1KvPArLDgQ_pKakPxgkhxztqtVKdXz8jkPd18RvqGgaVxUqgy0";
//API PUBLICADA EN VERCEL
const API = "https://pushnotifications-saso.vercel.app/api"
//const API = "http://localhost:9000/api";

const home = new Home();

const homeNav = document.querySelector("#home-nav");
const homePage = document.querySelector("#home-page");
homeNav.root = homePage;

const radioNav = document.querySelector("#radio-nav");
const radioPage = document.querySelector("#radio-page");
radioNav.root = radioPage;

const libraryNav = document.querySelector("#library-nav");
const libraryPage = document.querySelector("#library-page");
libraryNav.root = libraryPage;

const searchNav = document.querySelector("#search-nav");
const searchPage = document.querySelector("#search-page");
searchNav.root = searchPage;

$(document).ready(function () {
  //Se busca, sí existe alguna suscripcion con estas keys
  getPermisos();

  getSuscriptores();

  //EVENTOS
  $("#subscribeButton").click(function () {
    let nombreSuscriptor = $("#nameSuscriptor").val();

    if (nombreSuscriptor == "") {
        $("#responseOutput").text(`Ingresa un nombre para tu suscripción`);
        return;
    }

    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("service-worker.js")
        .then(function (registration) {
          return registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
          });
        })
        .then(function (subscription) {
           subscription = JSON.stringify(subscription)
           subscription =  JSON.parse(subscription);
          $("#responseOutput").text(subscription);
          let sub = {
            nombre: nombreSuscriptor,
            endpoint: subscription.endpoint,
            keys:subscription.keys
          }
          sub = JSON.stringify(sub);
          console.log(sub);
          $.ajax({
            url: `${API}/notificaciones`,
            type: "POST",
            contentType: "application/json",
            data: sub,
            success: function (response) {
              console.log("Datos del usuario:", response);
              $("#responseOutput").text("Datos de suscripción:", response);
            },
            error: function (error) {
              console.error("Error en la suscripción:");
              console.error(error);
              let mensaje = error.responseJSON.message;
              let status = error.status;
              $("#responseOutput").text(`Suscripción: ${mensaje}`);
           
            },
          });
        })
        .catch(function (error) {
          $("#responseOutput").text("Error: " + error.message);
          console.error("Subscription error:", error);
        });
    } else {
      $("#responseOutput").text(
        "Service Worker or Push Notifications not supported in this browser."
      );
    }
  });

  

  //Formulario
   // Validación del formulario
   var form = $('#notificationForm');
   form.on('submit', function(event) {
       if (!this.checkValidity()) {
           event.preventDefault();
           event.stopPropagation();
           form.addClass('was-validated');
           return false;
       }

       // Recoger datos del formulario
       var data = {
           para: $('#list-suscriptor').val(),
           titulo: $('#titulo').val(),
           mensaje: $('#mensaje').val(),
           urlimage: $('#imagen-url').val(),
           urlAction: $('#redireccion-url').val(),
           titleAction: $('#titulo-boton').val()
       };

       // Enviar datos usando AJAX
       $.ajax({
           url: `${API}/create`,
           type: 'POST',
           contentType: 'application/json',
           data: JSON.stringify(data),
           success: function(response) {
               console.log('Notificación enviada:', response);
               alert('Notificación enviada exitosamente');
               form[0].reset();

           },
           error: function(error) {
               console.error('Error al enviar notificación:', error);
               alert('Error al enviar notificación');
           }
       });

       event.preventDefault();
       event.stopPropagation();
   });

  //FUNCIONES GENERALES

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  function getPermisos() {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("service-worker.js")
        .then(function (registration) {
          return registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
          });
        })
        .then(function (subscription) {
          const credenciales = JSON.stringify(subscription);
          console.log("Datos suscripcion: ");
          console.log(credenciales);
          $.ajax({
            url: `${API}/subscription/user`,
            type: "POST",
            contentType: "application/json",
            data: credenciales,
            success: function (response) {
              console.log("Datos del usuario:", response);
              let datos = JSON.stringify(response)
              $("#responseOutput").text(`Datos del usuario: ${datos}`);
              $("#nameSuscriptor").val(datos.nombre);
              $("#nameSuscriptor").prop("disabled", true);
              $("#subscribeButton").prop("disabled", true);

            },
            error: function (error) {
              console.error("Error en la suscripción:");
              console.error(error);
              let mensaje = error.responseJSON.message;
              let status = error.status;
              $("#responseOutput").text(`Suscripción: ${mensaje}`);

              if (status == 401) {
                $("#subscribeButton").removeAttr("disabled");
                $("#nameSuscriptor").removeAttr("disabled");
                $("#nameSuscriptor").val("");

              } 
            },
          });
        })
        .catch(function (error) {
          $("#responseOutput").text("Error: " + error.message);
          console.error("Subscription error:", error);
        });
    } else {
      $("#responseOutput").text(
        "Service Worker or Push Notifications not supported in this browser."
      );
    }
  }

  function getSuscriptores(){
    $.ajax({
        url: `${API}/notificaciones`,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
          console.log("Datos del usuario:", response);
        let opciones = response;
          opciones.forEach(opcion => {
            $("#list-suscriptor").append(new Option(opcion.nombre, opcion.nombre));
        });

        },
        error: function (error) {
          console.error("Error en la suscripción:");
          console.error(error);
          let mensaje = error.responseJSON.message;
          let status = error.status;
       
        },
      });
  }
});

// document.addEventListener('deviceready', function() {
//   if ('serviceWorker' in navigator) {
//       navigator.serviceWorker.register('/service-worker.js')
//       .then(function(registration) {
//           console.log('Service Worker registered with scope:', registration.scope);
//       }).catch(function(error) {
//           console.error('Service Worker registration failed:', error);
//       });
//   }

//   // Iniciar el servidor local usando Capacitor HTTP
//   Capacitor.Plugins.Http.startServer({
//       'www_root': '',
//       'port': 8080,
//       'localhost_only': false
//   }).then(function(response) {
//       console.log('Server is live at ' + response.url);
//   }).catch(function(error) {
//       console.error('Failed to start server: ' + error);
//   });
// }, false);
