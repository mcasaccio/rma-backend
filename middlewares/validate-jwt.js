const jwt = require('jsonwebtoken');
const User = require('../models/user');



const isValidToken = (req, res, next) => {

    // Leer el Token
    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {
        
        const { uid } = jwt.verify( token, process.env.JWT_SECRET );
        req.uid = uid;

        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
 
}

const isAdminRole = async(req, res, next)  => {

    const uid = req.uid;
    
    try {
        
        const userDB = await User.findById(uid);

        if ( !userDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if ( userDB.role !== 'ADMIN_ROLE' ) {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            });
        }

        next();


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const varlidarADMIN_ROLE_o_MismoUsuario = async(req, res, next)  => {

    const uid = req.uid;
    const id  = req.params.id;
    
    try {
        
        const userDB = await User.findById(uid);

        if ( !userDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if ( userDB.role === 'ADMIN_ROLE' || uid === id ) {
        
            next();
            
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            });
        }

        


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}




module.exports = {
    isValidToken,
    isAdminRole,
    varlidarADMIN_ROLE_o_MismoUsuario
}