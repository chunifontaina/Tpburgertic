const mysql = require('mysql2');
const fs = require('fs');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'burgertic'
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos', err);
    return;
  }
  console.log('Conectado a la base de datos correctamente.');
  
  fs.readFile('menu.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo menu.json', err);
      return;
    }

    const menuData = JSON.parse(data);
    
    const query = 'INSERT INTO platos (tipo,nombre, precio, descripcion) VALUES (?,?, ?, ?)';
    let values = [];

    try {
      menuData.forEach(async plato => {
        values = [plato.tipo, plato.nombre, plato.precio, plato.descripcion];
        await connection.promise().query(query, values);
      });
    } catch (error) {
      console.log("Error ingresando los datos ", error);
    } finally {
      connection.end();
    }
  });
});

module.exports = connection;
