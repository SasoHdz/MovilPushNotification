// const API = "http://localhost:57371";
const API = "https://sasoapi.bsite.net"

class Home {
  constructor() {}

  LoadUsers() {
    home.showLoader();
    $.ajax({
      url: API+"/WepApi/Users",
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
    $("#email").val('');
    $("#nombre").val('');
    $("#apellidoPaterno").val('');
    $("#apellidoMaterno").val('');
  }

  showLoader(){
    $("#loader").removeClass('d-none');
  }

  hideLoader(){
    $("#loader").addClass('d-none');
  }
}

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

document.addEventListener("DOMContentLoaded", () => {
  //Cargar usuarios registrados
  home.LoadUsers();

  //Eventos
  //FORMULARIO DE USUARIO
  $("#UsuarioForm").on("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.checkValidity() === false) {
      this.classList.add("was-validated");
    } else {
      home.showLoader();
      var formData = {
        email: $("#email").val(),
        nombre: $("#nombre").val(),
        appaterno: $("#apellidoPaterno").val(),
        apmaterno: $("#apellidoMaterno").val(),
      };

      console.log(formData);

      $.ajax({
        //  url: "/api/WepApi",
         url: API+"/WepApi/CreateUser",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function (response) {
          console.log("Success:", response);
          alert("Datos enviados exitosamente!");
          home.cleanForm();
          home.LoadUsers();
          home.hideLoader();

        },
        error: function (error) {
          console.error("Error:", error);
          alert("Hubo un error al enviar los datos.");
          home.hideLoader();

        },
      });
    }
  });

  $("#hola").css({ "background-color": "green", padding: "10px" });
  //Abriendo mensaje
  $("#open-loading").on("click", function () {
    alert("Hola");
  });
});
