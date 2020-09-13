const axios = require("axios");
const fs = require("fs");
const http = require("http");
var url = require("url");

async function darProveedores() {
  const resp = await axios.get(
    "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json",
  );
  return resp.data;
}

async function darClientes() {
  const resp = await axios.get(
    "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json",
  );
  return resp.data;
}

http
  .createServer(function (req, res) {
    let path = url.parse(req.url).pathname;
    var finArchivo =
      '</main>\
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"  integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"\
      crossorigin="anonymous"></script>\
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN"\
      crossorigin="anonymous"></script>\
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV"\
      crossorigin="anonymous"></script>\
      </body>\
      </html>';
    if (path === "/api/proveedores") {
      darProveedores().then((datos) => {
        fs.readFile("proveedores.html", (error, data) => {
          if (error) {
            res.writeHead(404, { "Content-Type": "text/html" });
            return res.end("Error leyendo proveedores");
          } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.write('<h1 class="text-center">Listado de proveedores</h1>');
            res.write(
              '<table class="table table-striped">\
          <thead>\
            <tr>\
                <th>ID</th><th>Nombre</th><th>Contacto</th>\
            </tr>\
          </thead>',
            );
            for (let dato of datos) {
              res.write(
                `<tr><td>${dato.idproveedor}</td><td>${dato.nombrecompania}</td><td>${dato.nombrecontacto}</td></tr>`,
              );
            }
            res.end(finArchivo);
          }
        });
      });
    } else if (path === "/api/clientes") {
      darClientes().then((datos) => {
        fs.readFile("clientes.html", (error, data) => {
          if (error) {
            res.writeHead(404, { "Content-Type": "text/html" });
            return res.end("Error leyendo clientes");
          } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.write('<h1 class="text-center">Listado de clientes</h1>');
            res.write(
              '<table class="table table-striped">\
              <thead>\
                <tr>\
                    <th>ID</th><th>Nombre</th><th>Contacto</th>\
                </tr>\
              </thead>',
            );
            for (let dato of datos)
              res.write(
                `<tr><td>${dato.idCliente}</td><td>${dato.NombreCompania}</td><td>${dato.NombreContacto}</td></tr>`,
              );
            res.end(finArchivo);
          }
        });
      });
    } else {
      res.writeHead(404, { "Content-Type": "text/html" });
      return res.end("La página a la que intentas acceder no existe");
    }
  })
  .listen(8081);