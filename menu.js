const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./connection'); 
app.use(bodyParser.json());

const PORT = 9000;

// Crear un endpoint GET /menu que devuelva el menú completo del restaurante.
app.get('/menu', (req, res) => {
    const query = 'SELECT * FROM platos';
  
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error al consultar la base de datos', err);
        res.status(500).json({ error: 'Error al obtener los datos del menú' });
      } else {
        res.json(results);
      }
    });
  });

//Crear un endpoint GET /menu/:id que devuelva un plato del menú. 
app.get('/menu/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM platos WHERE id = ?';
  
    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error al consultar la base de datos', err);
        res.status(500).json({ error: 'Error al obtener el plato del menú' });
      } else {
        if (results.length === 0) {
          res.json("No existe ese plato");
        } else {
          res.json(results[0]);
        }
      }
    });
  });

//Crear un endpoint GET /combos que devuelva únicamente los combos del menú.
app.get('/combos', (req, res) => {
    const query = 'SELECT * FROM platos WHERE tipo = "combo"';
  
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error al consultar la base de datos', err);
        res.status(500).json({ error: 'Error al obtener los combos del menú' });
      } else {
        res.json(results);
      }
    });
  });


//Crear un endpoint GET /principales que devuelva únicamente los platos principales del menú.
app.get('/principales', (req, res) => {
    const query = 'SELECT * FROM platos WHERE tipo = "principal"';
  
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error al consultar la base de datos', err);
        res.status(500).json({ error: 'Error al obtener los platos principales del menú' });
      } else {
        res.json(results);
      }
    });
  });   

//Crear un endpoint GET /postres que devuelva únicame<<nte los postres del menú.
app.get('/postres', (req, res) => {
    const query = 'SELECT * FROM platos WHERE tipo = "postre"';
  
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error al consultar la base de datos', err);
        res.status(500).json({ error: 'Error al obtener los postres del menú' });
      } else {
        res.json(results);
      }
    });
  });

//Crear un endpoint POST /pedido que reciba un array de id's de platos y devuelva el precio total del pedido. 
app.post('/pedido', (req, res) => {
    console.log(req.body);
    const productos = req.body.productos; // Acceder a la propiedad "productos" en el cuerpo
    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      res.status(400).json({ error: "La lista de productos está vacía o no es válida." });
      return;
    }
    
    // Obtener los platos desde la base de datos por ID
    const platosIds = productos.map(plato => plato.id);
    const query = 'SELECT id, precio FROM platos WHERE id IN (?)';
    
    connection.query(query, [platosIds], (err, results) => {
      if (err) {
        console.error('Error al consultar la base de datos', err);
        res.status(500).json({ error: 'Error al obtener los precios de los platos' });
      } else {
        //INSERT EN LA TABLA DE PEDIDOS
        const query = 'INSERT INTO pedidos (id_plato, cantidad) VALUES (?, ?)';
        let values = [];
        
        //const precioTotal = resultados.reduce((acum, plato) => {
          //const cantidad = productos.find(producto => producto.id === plato.id).cantidad;
          //return acum + (plato.precio * cantidad);
        }, 0);
  
        console.log({precioTotal});
        res.json({ precioTotal });
      }
    });
  });

// Iniciar el servidor
const server = app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
  });
  
  // Cerrar la conexión a la base de datos cuando la aplicación se detiene
  server.on('close', () => {
    connection.end();
  });

