// Description: Provides the repository for the user management functionality
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const database = require('../../configuration/database');
const crypto = require('crypto');
const {postUserSchema, postLoginSchema, postLogoutSchema, patchDisplayNameSchema, patchEmailSchema, patchAvatarSchema, patchPasswordSchema, getUserSchema, getTokenSchema, userIdSchema} = require('../../data/validation/schema/schema');
const validate = require('../../data/validation/validate');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './public/user/avatar');
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + req.headers.localid + file.originalname.slice(file.originalname.length - 4));
    }
});

const upload = multer({
    storage: storage
}).array('avatar', 3);

const genHash = (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
};

const genToken = () => {
    return crypto.randomBytes(128).toString('hex');
};

const postUser = (req, next) => {

    const errors = validate(req, postUserSchema);

    if (errors.length > 0)
        next({status: 400, msg: 'Bad request'}, null);
    else {

        const salt = crypto.randomBytes(256);
        const hash = genHash(req.password, salt);
        const values = [req.displayName, req.email, hash, salt.toString('hex')];

        database.getPool().query (
            'insert into coreUser (displayName, email, password, salt) values (?)',
            [values],
            (err, res) => {
                if(err){
                    if(err.code === 'ER_DUP_ENTRY')
                        next({status: 400, msg: 'Duplicate entry'}, null);
                    else
                        next({status: 500, msg: err}, null);
                }
                else if (res.affectedRows !== 1 && res.changedRows !== 0 && res.insertId !== 1)
                    next({status: 400, msg: res.message});
                else
                    next(null, {status: 201, msg: 'Created'});
            }
        );
    }
};

const getUser = (user, next) => {

    const errors = validate(user, getUserSchema);
    
    if (errors.length > 0)
        next({status: 400, msg: 'Bad request'}, null);
    else {
        database.getPool().query(
            'select localId, displayName, avatarUrl, avatarFile, email, idToken from coreUser where inUse = 1 and localId = ?',
            [user.localId],
            (err, res) => {
                if(err)
                    next({status: 500, msg: err});
                else if (res.length != 1)
                    next({status: 404, msg: 'User not found'});
                else
                    next(null, {status: 200, user: res[0]});
            }
        );
    }
};

const getIdFromToken = (req, next) => {

    let errors = null;
    
    if(req.idToken === undefined || req.idToken === null || req.idToken === 'null' || req.idToken === ''){
        return next({status: 401, msg: 'Unauthorised'}, null);
    }
    else
        errors = validate(req, getTokenSchema);
    
    if (errors.length > 0)
        next({status: 400, msg: 'Bad request'}, null);
    else {
        database.getPool().query(
            'select localId from coreUser where inUse = 1 and idToken = ?', 
            [req.idToken],
            (err, res) => {
                if(err)
                    next({status: 500, msg: err}, null);
                else if (res.length !== 1) 
                    next({status: 404, msg: 'Unauthorised'}, null);
                else
                    next(null, {status: 200, localId: res[0].localId});
            }
        );
    }
};

const authenticate = (req, next) => {

    const errors = validate(req, postLoginSchema);

    if (errors.length > 0)
        next({status: 400, msg: 'Bad request'}, null);
    else {

        database.getPool().query (
            'select localId, displayName, avatarUrl, email, password, salt, inUse from coreUser where email = ?',
            [req.email],
            (err, res) => {
                if(err)
                    next({status: 500, msg: err}, null);
                else if (res.length === 0) {
                    next({status: 404, msg: 'Invalid email / password supplied'}, null);
                }
                else if(res[0].inUse === 0) {
                    next({status: 403, msg: 'Account disabled, contact your administrator'}, null);
                }
                else {
                    if(res[0].password === genHash(req.password, Buffer.from(res[0].salt, 'hex'))) {
                        next(null, {status: 200, user: res[0]});
                    } else {
                        next({status: 401, msg: 'Invalid email / password supplied'}, null);
                    }
                }
            }
        );
    }
};

const getToken = (localId, next) => {

    const errors = validate({localId: localId}, userIdSchema);

    if (errors.length > 0)
        next({status: 400, msg: 'Bad request'}, null);
    else {

        database.getPool().query (
            'select idToken from coreUser where localId = ?',
            [localId],
            (err, res) => {
                if(err)
                    next({status: 500, msg: err}, null);
                else if (res.length === 1 && res[0].token)
                    next(null, res[0].token);
                else
                    next({status: 400, msg: 'Get token failed'}, null);
            }
        );
    }
};

const patchToken = (localId, next) => {

    const idToken = genToken();

    const errors = validate({localId: localId}, userIdSchema);

    if (errors.length > 0)
        next({status: 400, msg: 'Bad request'}, null);
    else {

        database.getPool().query (
            'update coreUser set idToken = ? where localId = ?',
            [idToken, localId],
            (err, res) => {
                if(err)
                    next({status: 500, msg: err}, null);
                else if (res.affectedRows !== 1 && res.changedRows !== 1 && insertId !== 0)
                    next({status: 400, msg: res.message});
                else
                    next(null, idToken);
            }
        );
    }
};

const removeToken = (user, next) => {

    const errors = validate({localId: user.body.localId}, postLogoutSchema);

    if (errors.length > 0)
        next({status: 400, msg: 'Bad Request'}, null);
    else {

        database.getPool().query(
            `update coreUser set idToken = null where localId = ?`,
            [user.body.localId],
            (err, res) => {
                if(err)
                    next({status: 500, msg: err}, null);
                else if (res.affectedRows !== 1 && res.changedRows !== 1 && res.insertId !== 0)
                    next({status: 400, res: res.message});
                else 
                    next(null, {status: 200, msg: 'OK'});
            }
        );
    }
};

const patchUser = (req, next) => {

    let query = '';
    let values = [];
    let errors = null;

    if(req.displayName) {
        errors = validate(req, patchDisplayNameSchema);
        query = 'update coreUser set displayName = ? where localId = ?';
        values = [req.displayName, req.localId];
    }

    if(req.email) {
        errors = validate(req, patchEmailSchema);
        query = 'update coreUser set email = ? where localId = ?';
        values = [req.email, req.localId];
    }

    if(req.password) {
        errors = validate(req, patchPasswordSchema);
        const salt = crypto.randomBytes(256);
        const hash = genHash(req.password, salt);
        query = 'update coreUser set password = ?, salt = ? where localId = ?';
        values = [hash, salt.toString('hex'), req.localId];
    }
    if(req.avatar) {
        errors = validate(req, patchAvatarSchema);
        query = 'update coreUser set avatarUrl = null, avatarFile = null where localId = ?';
        values = [req.localId];
    }

    if(errors.length !== 0)
        next({status: 400, msg: 'Bad request'}, null);
    else {
        database.getPool().query(
            query,
            values,
            (err, res) => {
                if(err)
                    next({status: 500, msg: err}, null);
                else if (res.affectedRows !== 1 && res.changedRows !== 1 && insertId !== 0)
                    next({status: 400, msg: res.message});
                else 
                    next(null, {status: 200, msg: 'OK'});
            }
        );
    }
};


const patchAvatar = (req, next) => {
  
    upload(req, next, (err) => {
        if (err) {
            next({status: 500, msg: 'Something went wrong'});
        }
        else {

            database.getPool().query(
                `update coreUser set avatarUrl = ?, avatarFile = ? where localId = ?`,
                [process.env.AVATAR_BASE_URL + '/' + req.files[0].filename, req.files[0].filename, req.headers.localid],
                (err, res) => {
                    if(err)
                        next({status: 500, msg: err}, null);
                    else if (res.affectedRows !== 1 && res.changedRows !== 1 && res.insertId !== 0)
                        next({status: 400, res: res.message});
                    else 
                        next(null, {status: 200, msg: 'OK'});
                }
            );
        }
    });
}

module.exports = {
    postUser: postUser,
    getUser: getUser,
    getIdFromToken: getIdFromToken,
    authenticate: authenticate,
    patchToken: patchToken,
    removeToken: removeToken,
    patchUser: patchUser,
    patchAvatar: patchAvatar
}