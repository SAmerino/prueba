const pkg = require('pg');
const { Pool } = pkg;


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'tics',
    password: 'colocolo',
    port: '5432'
})


pool.connect((err, client, release) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.stack);
    } else {
        console.log('Conexión exitosa a la base de datos');
        release(); // Liberar cliente de la pool cuando no se necesite más
    }
});

// Ejemplo de consulta
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error en la consulta:', err.stack);
    } else {
        console.log('Resultado de la consulta:', res.rows[0]);
    }
});


const getNombre = async (req,res) => {
    const request = req.body;
    const respuesta = await pool.query('SELECT * FROM pg_tables WHERE schemaname = "public"');
    console.log(respuesta.error);
    res.send(respuesta.rows);
    
}

const insertDispositivo = async (req,res) => {
    const request = req.body;
    
    const respuesta = await pool.query('INSERT INTO public."Dispositivo_Cliente" (id_dispositivo, rut_cliente) VALUES ($1, $2)', [request.id, request.rut]
    );
    res.send(respuesta.rows);
    console.log(respuesta.rows);
}

const getTrue = async (req,res) => {
    const request = req.body;
    
    const respuesta = await pool.query(
        'SELECT CASE WHEN hum_air @> 45 THEN true ELSE false END AS hum_air, CASE WHEN temp @> 20 THEN true ELSE false END AS temp, CASE WHEN luz @> 180 THEN true ELSE false END AS luz FROM public."Plantas" JOIN public."Plantas_Monitoreadas" ON public."Plantas".id = public."Plantas_Monitoreadas".id_planta JOIN public."Dispositivos" ON public."Plantas_Monitoreadas".id_dispositivo = public."Dispositivos".id WHERE public."Dispositivos".codigo = 123123'
    );
    res.json(respuesta);
    console.log(respuesta);
}

const createArriendo = async (req,res) => {
    const request = req.body;
    const dias = parseInt(request.dias);
    // console.log(precio_total, request.dias, request.producto_id, request.cliente_rut)
    const respuesta = await pool.query(''
    );
    res.send("Arriendo creado");
    console.log(respuesta.rows);
}

const updateArriendo = async (req,res) => {
    const request = req.body;
    const respuesta = await pool.query(''
                                    );
    console.log(respuesta.rows)
    res.send("Extension de dias correctamente realizada");
}

const insertCarrito = async (req,res) => {
    const request = req.body;
    const respuesta = await pool.query(''
                                    );
    res.send("Producto añadido al carrito.")
}

const deleteCarrito = async (req,res) => {
    const request = req.body;
    if (request.objeto_id == 0){const respuesta = await pool.query(''
    );
    res.send("Se ha vaciado el carro");
    }
    else {
        const respuesta = await pool.query(''
    );
    res.send("Producto eliminado");
    }
}

const comprarCarrito = async (req,res) => {
    const request = req.body;
    const productos = await pool.query('SELECT objeto_id FROM public.carro WHERE cliente_id = $1', [request.cliente_id]);
    const productosArray = productos.rows.map(row => row.objeto_id);
    // console.log(productosArray);
    // res.send(productosArray)
    for (let i = 0; i < productosArray.length; i++) {
        await pool.query('INSERT INTO arriendo (fecha_arriendo, cant_dias, fecha_fin, precio_total, producto_id, cliente_id)' +
                    ' VALUES (CURRENT_DATE, $1, CURRENT_DATE + interval \'1 days\' * $1::integer,' +
                    ' (SELECT public.producto.precio_dia FROM public.producto WHERE producto.id = $2) * $1::integer,' +
                    ' $2, $3)', [request.dias, productosArray[i], request.cliente_id]);
    }
    await pool.query('DELETE FROM public.carro' + 
                        ' WHERE cliente_id = $1', [request.cliente_id]
    );
    res.send("Se ha arrendado todo el carrito.")
}

const deleteArriendo = async (req,res) => {
    const request = req.body;
    const respuesta = await pool.query('DELETE FROM public.arriendo' + 
                                        ' WHERE id = $1', [request.arriendo_id]
                                        );
    res.send("Arriendo terminado.")
}

const createProducto = async (req,res) => {
    const request = req.body;
    const respuesta = await pool.query('INSERT INTO producto (nombre, precio_dia, tipo_objeto_id, local_id)' +
                                        ' VALUES ($1, $2, $3, $4)', [request.nombre, request.precio_dia, request.tipo_objeto_id, request.local_id]);
    console.log(respuesta.rows)
    res.send("Producto subido correctamente");
}

const deleteProducto = async (req,res) => {
    const request = req.body;
    
    const respuesta = await pool.query('DELETE FROM producto' +
                                        ' WHERE id = $1', [request.producto_id]);
    console.log(respuesta.rows)
    res.send("Extension de dias correctamente realizada");
}

const getProductosCliente = async (req,res) => {
    const request = req.body;
    // console.log(request.nombre)
    const respuesta = await pool.query('Select producto.nombre, producto.precio_dia FROM public.producto' +
                                        ' JOIN public.arriendo on public.producto.id = public.arriendo.producto_id' +
                                        ' JOIN public.cliente on public.arriendo.cliente_id = cliente.rut' +
                                        ' WHERE public.cliente.rut = $1', [request.cliente_id]
    );
    res.send(respuesta.rows);
    console.log(respuesta.rows);
}



module.exports = {
    getNombre,
    getTrue,
    getProductosCliente,
    createArriendo,
    updateArriendo,
    insertDispositivo,
    deleteCarrito,
    comprarCarrito,
    deleteArriendo,
    createProducto,
    deleteProducto
    
}