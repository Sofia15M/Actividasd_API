let express = require('express');
let mysql = require('mysql');
let app = express();
app.use(express.json());

let conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'articulosbd' 
});

conexion.connect(function (error) {
    if (error) {
        throw error;
    } else {
        console.log('Conexión a la base de datos exitosa');
    }
});

app.get('/api/articulos', (req, res) => {
    conexion.query('SELECT * FROM articulos', (error, filas) => {
        if (error) {
            throw error;
        } else {
            res.send(filas);
        }
    });
});

app.get('/api/articulos/:id', (req, res) => {
    const id = req.params.id;
    conexion.query('SELECT * FROM articulos WHERE id = ?', [id], (error, fila) => {
        if (error) {
            throw error;
        } else {
            if (fila.length === 0) {
                res.status(404).json({ mensaje: 'Artículo no encontrado' });
            } else {
                res.json(fila[0]);
            }
        }
    });
});

app.post('/api/articulos',(req,res)=>{
    let data = {Descripcion:req.body.Descripcion, Precio:req.body.Precio, stock:req.body.stock};
    let sql = "INSERT INTO articulos SET ?";
    conexion.query(sql,data,function(error,results){
        if(error){
            throw error;
        } else{
            res.send(results);
        }
    })
})

let puerto = process.env.PUERTO || 3000;
app.listen(puerto, function () {
    console.log('Servidor OK en puerto ' + puerto);
});
