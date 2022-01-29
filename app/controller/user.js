// Description: Provides the co-ordination for the user user management functionality
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const user = require('../repository/user');
const log = require('../lib/logger')();
const config = require('../../configuration/config');
const version = config.get('version');
const path = './public/user/avatar/';
const fs = require('fs');

const postUser = (req, next) => {
    user.postUser(req.body, (err, user) => {
        if(err) {
            log.error(`POST v${version} - failed - postUser - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - postuser - status: ${user.status}`);
            next(null, user);
        }
    });
};

const isAuthenticated = (req, next) => {
    user.getIdFromToken({idToken: req.headers.idtoken}, (err, data) => {
        if(err || data.localId === null) {
            log.error(`POST v${version} - failed - getIdFromToken - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - getIdFromToken - status ${data.status}`);
            next(null, data);
        }
    });
};

const getUser = (req, next) => {
    user.getUser({localId: req.headers.param}, (err, data) => {
        if(err) {
            log.error(`POST v${version} - failed - getUser - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            // log.info(`POST v${version} - success - getUser - status: ${data.status}`);
            next(null, {
                status: data.status,
                user: {
                    displayName: data.user.displayName,
                    email: data.user.email,
                    avatarUrl: data.user.avatarUrl,
                }
            });
        }
    });
};

const patchUser = (req, next) => {

    const localId = req.body.localId;
    const idToken = req.headers.idtoken;

    user.getIdFromToken({idToken: idToken}, (err, uid) => {

        if(err){
            log.error(`GET v${version} - failed - getIdFromToken - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            if(parseInt(localId) !== uid.localId){
                log.error(`GET v${version} - failed - getIdFromToken - status: 403 msg: token does not match`);
                next({status: 403}, null);
            }
            else {
                user.getUser({localId: localId}, (err, usr) => {
                    if(err) {
                        log.error(`POST v${version} - failed - getUser - status: ${err.status} msg: ${err.msg}`);
                        next(err, null);
                    }
                    else if(parseInt(localId) !== usr.user.localId) {
                        log.error(`GET v${version} - failed - user check - status: 403 msg: user id does not match`);
                        next({status: 403}, null);
                    }
                    else {
                        user.patchUser(req.body, (err) => {
                            if(err) {
                                log.error(`GET v${version} - failed - setUser - status: ${err.status} msg: ${err.msg}`);
                                next(err, null);
                            }
                            else {
                                user.patchToken(localId, (err) => {
                                    if(err) {
                                        log.error(`POST v${version} - failed - patch token - status: ${err.status} msg: ${err.msg}`);
                                        next(err, null); 
                                    }
                                    else {
                                        user.getUser({localId: localId}, (err, data) => {
                                            if(err) {
                                                log.error(`POST v${version} - failed - getUser - status: ${err.status} msg: ${err.msg}`);
                                                next(err, null);
                                            }
                                            else {

                                                // log.info(`POST v${version} - success - setUser - status: ${data.status}`);
                                                // log.info(`POST v${version} - success - getUser - status: ${data.status}`);
                                        
                                                next(null, {
                                                    status: data.status,
                                                    user: {
                                                        displayName: data.user.displayName,
                                                        email: data.user.email,
                                                        avatarUrl: data.user.avatarUrl,
                                                        idToken: data.user.idToken
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }   
                        });
                    }
                });
            }
        }
    });
}

const login = (req, next) => {

    user.authenticate(req, (err, auth) => {
        if(err) {
            log.error(`POST v${version} - failed - login - status: ${err.status} msg: ${err.msg}`);
            next(err, null);              
        }
        else {
            user.patchToken(auth.user.localId, (err, idToken) => {
                if(err) {
                    log.error(`POST v${version} - failed - login - status: ${err.status} msg: ${err.msg}`);
                    next(err, null); 
                }
                else {
                    // log.info(`POST v${version} - success - login - status: 200`);
                    next(null, {
                        status: auth.status,
                        user: {
                            localId: auth.user.localId,
                            displayName: auth.user.displayName,
                            email: auth.user.email,
                            avatarUrl: auth.user.avatarUrl,
                            idToken: idToken,
                            expiresIn: 3600
                        }
                    });
                }
                
            });
        }
    });
};

const logout = (req, next) => {
    user.removeToken(req, (err, data) => {
        if(err) {
            log.error(`POST v${version} - failed - logout - status: ${err.status} msg: ${err.msg}`);
            next(err, null); 
        }
        else {
            // log.info(`POST v${version} - success - logout - status: ${data.status}`);
            next(null, data);
        }
    });
};

const patchAvatar = (req, next) => {

    const localId = req.headers.localid;
    const idToken = req.headers.idtoken;
    
    if(!req.header('Content-Type').includes('multipart/form-data')) {
        log.error(`GET v${version} - failed - patch avatar content type - status: ${req.header('Content-Type')}`);
        next({status: 400, msg: 'Unsupported content type'}, null);
    }
    else {

        user.getIdFromToken({idToken: idToken}, (err, uid) => {
            if(err){
                log.error(`GET v${version} - failed - getIdFromToken - status: ${err.status} msg: ${err.msg}`);
                next(err, null);
            }
            else {
                if(parseInt(localId) !== uid.localId){
                    log.error(`GET v${version} - failed - getIdFromToken - status: 403 msg: token does not match`);
                    next({status: 403}, null);
                }
                else {
                    user.getUser({localId: localId}, (err, usr) => {
                        if(err) {
                            log.error(`POST v${version} - failed - getUser - status: ${err.status} msg: ${err.msg}`);
                            next(err, null);
                        }
                        else if(parseInt(localId) !== usr.user.localId) {
                            log.error(`GET v${version} - failed - user check - status: 403 msg: user id does not match`);
                            next({status: 403}, null);
                        }
                        else {

                            if(usr.user.avatarFile && fs.existsSync(path + usr.user.avatarFile))
                                fs.unlinkSync(path + usr.user.avatarFile);
        
                            user.patchAvatar(req, (err, data) => {
                                if (err) {
                                    log.error(`GET v${version} - failed - patch avatar - status: ${err.status} msg: ${err.msg}`);
                                    next(err, null);
                                }
                                else {
                                    user.patchToken(localId, (err) => {
                                        if(err) {
                                            log.error(`POST v${version} - failed - patch token - status: ${err.status} msg: ${err.msg}`);
                                            next(err, null); 
                                        }
                                        else {
                                            user.getUser({localId: localId}, (err, data) => {
                                                if(err) {
                                                    log.error(`POST v${version} - failed - getUser - status: ${err.status} msg: ${err.msg}`);
                                                    next(err, null);
                                                }
                                                else {
    
                                                    // log.info(`POST v${version} - success - setUser - status: ${data.status}`);
                                                    // log.info(`POST v${version} - success - getUser - status: ${data.status}`);
                                            
                                                    next(null, {
                                                        status: data.status,
                                                        user: {
                                                            displayName: data.user.displayName,
                                                            email: data.user.email,
                                                            avatarUrl: data.user.avatarUrl,
                                                            idToken: data.user.idToken
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });                    

                        }
                    });
                }
            }
        });
    }
};

const deleteAvatar = (req, next) => {

    const localId = req.headers.localid;
    const idToken = req.headers.idtoken;
    
    user.getIdFromToken({idToken: idToken}, (err, uid) => {
        if(err){
            log.error(`GET v${version} - failed - getIdFromToken - status: ${err.status} msg: ${err.msg}`);
            next(err, null);
        }
        else {
            if(parseInt(localId) !== uid.localId){
                log.error(`GET v${version} - failed - getIdFromToken - status: 403 msg: token does not match`);
                next({status: 403}, null);
            }
            else {
                user.getUser({localId: localId}, (err, usr) => {
                    if(err) {
                        log.error(`POST v${version} - failed - getUser - status: ${err.status} msg: ${err.msg}`);
                        next(err, null);
                    }
                    else if(parseInt(localId) !== usr.user.localId) {
                        log.error(`GET v${version} - failed - user check - status: 403 msg: user id does not match`);
                        next({status: 403}, null);
                    }
                    else {

                        if(usr.user.avatarFile && fs.existsSync(path + usr.user.avatarFile))
                            fs.unlinkSync(path + usr.user.avatarFile);
                        
                        user.patchUser({localId: parseInt(localId), avatar: 'delete'}, (err, res) => {
                            if (err) {
                                next(err, null);
                            }
                            else {
                                user.patchToken(localId, (err) => {
                                    if(err) {
                                        log.error(`POST v${version} - failed - patch token - status: ${err.status} msg: ${err.msg}`);
                                        next(err, null); 
                                    }
                                    else {
                                        user.getUser({localId: localId}, (err, data) => {
                                            if(err) {
                                                log.error(`POST v${version} - failed - getUser - status: ${err.status} msg: ${err.msg}`);
                                                next(err, null);
                                            }
                                            else {

                                                // log.info(`POST v${version} - success - setUser - status: ${data.status}`);
                                                // log.info(`POST v${version} - success - getUser - status: ${data.status}`);
                                        
                                                next(null, {
                                                    status: data.status,
                                                    user: {
                                                        displayName: data.user.displayName,
                                                        email: data.user.email,
                                                        avatarUrl: data.user.avatarUrl,
                                                        idToken: data.user.idToken
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });                    

                    }
                });
            }
        }
    });
};

module.exports = {
    postUser: postUser,
    isAuthenticated: isAuthenticated,
    getUser: getUser,
    login: login,
    logout: logout,
    patchUser: patchUser,
    patchAvatar: patchAvatar,
    deleteAvatar: deleteAvatar
};