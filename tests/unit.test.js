// Description: Jest tests to support a TDD development approach
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const endPoint = require('./endPoint');
const {generateUUID} = require('./utility');
const crypto = require('crypto');

let localId = null;
let idToken = null;
let wrongToken = '7c58e9e7cd20ae44f354d59f7a73ebb7e346d5e5a61517e33e0e97c4c79d25a826debfc57ca2e99c66108f80801059a9d2d94d14886fc98539e4ab324a5da2e125aa7e7d26af000e103fcbc75b0ed9caa75895ba26efa248fc0c2154a581786679c6a2a9120fadc9e68fef80bc30d6a8644cd19362e035a85e130d675e2e30a9';
let insertRiskId = null;

// auth tests
describe('POST / Patch / DELETE user requests', () => {

    it('should, create a user given the right information', async() => {
        await endPoint.post('/user')
            .send({
                displayName: "Phobos Admin",
                email: 'admin@phobos.com',
                password: crypto.createHash('sha256').update('1adminphobosA').digest('hex')
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should, return the user details and token given correct credentials', async done => {
        await endPoint.post('/user/login')
            .send({
                email: 'admin@phobos.com',
                password: crypto.createHash('sha256').update('1adminphobosA').digest('hex')
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(typeof res.body.user.localId).toBe('number');
                expect(res.body.user.displayName).toBe('Phobos Admin');
                expect(res.body.user.email).toBe('admin@phobos.com');
                expect(res.body.user.avatarUrl).toBe(null);
                expect(res.body.user.idToken).toHaveLength(256);
                localId = res.body.user.localId;
                idToken = res.body.user.idToken;          
                done();
            })
    });

    it('should successfully return the users details', async() => {
        await endPoint.get('/user')
            .set({
                idToken: idToken,
                param: localId
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.user.displayName).toBe('Phobos Admin');
                expect(res.body.user.email).toBe('admin@phobos.com');
                expect(res.body.user.avatarUrl).toBe(null);
            })
    });

    it('should fail to update the display name given a non valid display name', async() => {
        await endPoint.patch('/user')
            .set({
                idToken: idToken
            })
            .send({
                localId: localId,
                displayName: '123456789012345678901234567890123456789012345678901'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('Bad request');
            })
    });

    it('should update the display name', async() => {
        await endPoint.patch('/user')
            .set({
                idToken: idToken
            })
            .send({
                localId: localId,
                displayName: 'Sys admin'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body.user.displayName).toBe('Sys admin');
                idToken = res.body.user.idToken;
            })
    });

    it('should fail to update the email adress given a non valid email address', async() => {
        await endPoint.patch('/user')
            .set({
                idToken: idToken
            })
            .send({
                localId: localId,
                email: 'sysadminphobos.com'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('Bad request');
            })
    });

    it('should update the email address', async() => {
        await endPoint.patch('/user')
            .set({
                idToken: idToken
            })
            .send({
                localId: localId,
                email: 'sysadmin@phobos.com'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body.user.email).toBe('sysadmin@phobos.com');
                idToken = res.body.user.idToken;
            })
    });

    it('should fail to update the password given a non valid password', async() => {
        await endPoint.patch('/user')
            .set({
                idToken: idToken
            })
            .send({
                localId: localId,
                password: crypto.createHash('sha256').update('1adminphobosA').digest('hex') + '1234567890'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('Bad request');
            })
    });

    it('should update the password', async() => {
        await endPoint.patch('/user')
            .set({
                idToken: idToken
            })
            .send({
                localId: localId,
                password: crypto.createHash('sha256').update('1adminphobosB').digest('hex')
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                idToken = res.body.user.idToken;
            })
    });

    it('should upload an avatar image', async() => {
        await endPoint.patch('/user/avatar')
            .set('content-type', 'multipart/form-data')
            .set({
                idToken: idToken,
                localId: localId
            })
            .attach('avatar', `${__dirname}/files/testA.jpg`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                idToken = res.body.user.idToken;
            })
    });

    it('should upload and update an avatar image', async() => {
        await endPoint.patch('/user/avatar')
            .set('content-type', 'multipart/form-data')
            .set({
                idToken: idToken, 
                localId: localId
            })
            .attach('avatar', `${__dirname}/files/testB.png`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                idToken = res.body.user.idToken;
            })
    });

    it('should delete the avatar url and file data and the image file', async() => {
        await endPoint.delete('/user/avatar')
            .set({
                idToken: idToken, 
                localId: localId
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                idToken = res.body.user.idToken;
            })
    });

    it('should, logout the user given the user id', async() => {
        await endPoint.post('/user/logout')
            .set({idToken: idToken})
            .send({
                localId: localId
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
    });

    it('should, return the user details and token given correct credentials', async done => {
        await endPoint.post('/user/login')
            .send({
                email: 'sysadmin@phobos.com',
                password: crypto.createHash('sha256').update('1adminphobosB').digest('hex')
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(typeof res.body.user.localId).toBe('number');
                expect(res.body.user.displayName).toBe('Sys admin');
                expect(res.body.user.email).toBe('sysadmin@phobos.com');
                expect(res.body.user.avatarUrl).toBe(null);
                expect(res.body.user.idToken).toHaveLength(256);
                localId = res.body.user.localId;
                idToken = res.body.user.idToken;          
                done();
            })
    });

    // it('should deny access if the account is disabled', async() => {
    //     const res = await sendRequest(baseUrl + '/user/login', 'POST', {
    //         email: 'admin@phobos.com',
    //         password: '1adminphobosA'
    //     }, null);
    //     expect(res.status).toBe(402);
    //     expect(res.msg).toBe('Account disabled, contact your administrator');
    // });
});

// auth deny access tests
describe('Deny Access for bad user requests', () => {

    it('should, fail to return the users details given the wrong token', async() => {
        await endPoint.get('/user')
            .set({
                idToken: wrongToken, 
                localId: localId
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
    });

    it('should, fail to return the users details given undefined token', async() => {
        await endPoint.get('/user')
            .set({
                // authtoken: null, undefined
                param: localId
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
    });

    it('should, fail to return the users details given null token', async() => {
        await endPoint.get('/user')
            .set({
                idToken: null,
                param: localId
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
    });

    it('should, fail to return the users details given an empty token', async() => {
        await endPoint.get('/user')
            .set({
                idToken: '',
                param: localId
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
    });

    it('should, deny access for a non-existing user', async done => {
        await endPoint.post('/user/login')
            .send({
                email: 'donny@phobos.com',
                password: crypto.createHash('sha256').update('donnyexist').digest('hex')
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(404);
                expect(res.body.msg).toBe('Invalid email / password supplied');
                done();
            })
    });

    it('should, deny access for an incorrect password', async done => {
        await endPoint.post('/user/login')
            .send({
                email: 'sysadmin@phobos.com',
                password: crypto.createHash('sha256').update('wrongPassword').digest('hex')
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(401);
                expect(res.body.msg).toBe('Invalid email / password supplied');
                done();
            })
    });

    it('should, deny access for an incorrect email', async done => {
        await endPoint.post('/user/login')
            .send({
                email: 'wrong@phobos.com',
                password: crypto.createHash('sha256').update('1adminphobosA').digest('hex')
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(404);
                expect(res.body.msg).toBe('Invalid email / password supplied');
                done();
            })
    });

    it('should, fail to create a user with an already registered email address', async done => {
        await endPoint.post('/user')
            .send({
                displayName: "Duplicate",
                email: 'sysadmin@phobos.com',
                password: crypto.createHash('sha256').update('duplicate').digest('hex')
            })
            .expect(400)
            .then(res => {
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('Duplicate entry');
                done();
            })
    });
});

// auth input validator tests
describe('Test the user input validators', () => {

    it('should, fail validation for missing @', async done => {
        await endPoint.post('/user')
            .send({
                displayName: "Test User",
                email: 'testphobos.com',
                password: crypto.createHash('sha256').update('TestUser').digest('hex')
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('Bad request');
                done();
            })
    });

    it('should, fail validation for a display name > 50 chars', async done => {
        await endPoint.post('/user')
            .send({
                displayName: "123456789012345678901234567890123456789012345678901",
                email: 'test@phobos.com',
                password: crypto.createHash('sha256').update('TestUser').digest('hex')
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('Bad request');
                done();
            })
    });

    it('should, fail validation for a display name > 50 chars and email missing @', async done => {
        await endPoint.post('/user')
            .send({
                displayName: "123456789012345678901234567890123456789012345678901",
                email: 'testphobos.com',
                password: crypto.createHash('sha256').update('TestUser').digest('hex')
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('Bad request');
                done();
            })
    });

});

// user feedback tests
describe('User Feedback Test Suite', () => {

    it('should, return the user details and token given correct credentials', async done => {
        await endPoint.post('/user/login')
            .send({
                email: 'sysadmin@phobos.com',
                password: crypto.createHash('sha256').update('1adminphobosB').digest('hex')
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(typeof res.body.user.localId).toBe('number');
                expect(res.body.user.displayName).toBe('Sys admin');
                expect(res.body.user.email).toBe('sysadmin@phobos.com');
                expect(res.body.user.avatarUrl).toBe(null);
                expect(res.body.user.idToken).toHaveLength(256);
                localId = res.body.user.localId;
                idToken = res.body.user.idToken;          
                done();
            })
    });

    it('should, post user feedback', async() => {
        await endPoint.post('/feedback')
            .set({
                idToken: idToken
            })
            .send({
                localId: localId,
                title: 'An innovative way to solve risk',
                feedback: 'Sed ullamcorper, odio ut semper interdum, turpis turpis porttitor nisl, eu volutpat libero velit laoreet magna. Quisque sed auctor sem. Nam eleifend feugiat mauris, et eleifend sapien dignissim id. Integer eu leo eget nulla euismod sagittis. Aenean in finibus nisi. Pellentesque ultrices ligula.'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should, fail validation for a feedback title longer than 50 chars', async done => {
        await endPoint.post('/feedback')
            .set({
                idToken: idToken
            })
            .send({
                localId: localId,
                title: '123456789012345678901234567890123456789012345678901',
                feedback: 'Sed ullamcorper, odio ut semper interdum, turpis turpis porttitor nisl, eu volutpat libero velit laoreet magna. Quisque sed auctor sem. Nam eleifend feugiat mauris, et eleifend sapien dignissim id. Integer eu leo eget nulla euismod sagittis. Aenean in finibus nisi. Pellentesque ultrices ligula.'
            
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('Bad request');
                done();
            })
    });

    it('should, fail validation for a feedback title longer than 50 chars', async done => {
        await endPoint.post('/feedback')
            .set({
                idToken: idToken
            })
            .send({
                localId: localId,
                title: 'just a title',
                feedback: 'Sed ullamcorper, odio ut semper interdum, turpis turpis porttitor nisl, eu volutpat libero velit laoreet magna. Quisque sed auctor sem. Nam eleifend feugiat mauris, et eleifend sapien dignissim id. Integer eu leo eget nulla euismod sagittis. Aenean in finibus nisi. Pellentesque ultrices ligula 678901.'
            
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('Bad request');
                done();
            })
    });

    it('should, post user feedback', async() => {
        await endPoint.post('/feedback')
            .set({
                idToken: idToken
            })
            .send({
                localId: localId,
                title: 'My departments risk is under control',
                feedback: 'Sed ullamcorper, odio ut semper interdum, turpis turpis porttitor nisl, eu volutpat libero velit laoreet magna. Quisque sed auctor sem. Nam eleifend feugiat mauris, et eleifend sapien dignissim id. Integer eu leo eget nulla euismod sagittis. Aenean in finibus nisi. Pellentesque ultrices ligula.'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should successfully return the feedback', async() => {
        await endPoint.get('/feedback')
            .set({
                param: 1
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
            })
    });

    it('should, logout the user given the user id', async() => {
        await endPoint.post('/user/logout')
            .set({idToken: idToken})
            .send({
                localId: localId
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
    });
    
});

// risk location tests
describe('Risk Location Test suite', () => {

    it('should, return the user details and token given correct credentials', async done => {
        await endPoint.post('/user/login')
            .send({
                email: 'sysadmin@phobos.com',
                password: crypto.createHash('sha256').update('1adminphobosB').digest('hex')
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(typeof res.body.user.localId).toBe('number');
                expect(res.body.user.displayName).toBe('Sys admin');
                expect(res.body.user.email).toBe('sysadmin@phobos.com');
                expect(res.body.user.avatarUrl).toBe(null);
                expect(res.body.user.idToken).toHaveLength(256);
                localId = res.body.user.localId;
                idToken = res.body.user.idToken;          
                done();
            })
    });

    it('should, post a location with no parent child relationship', async() => {
        await endPoint.post('/phobos/location')
            .set({
                idToken: idToken
            })
            .send({
                name: 'Organisation Wide',
                description: 'All locations across the organisation',
                parentId: null
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should, post a location with no parent child relationship', async() => {
        await endPoint.post('/phobos/location')
            .set({
                idToken: idToken
            })
            .send({
                name: 'Location A',
                description: 'An excellent description of location A',
                parentId: null
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should, post a location with a parent relationship to location A', async() => {
        await endPoint.post('/phobos/location')
            .set({
                idToken: idToken
            })
            .send({
                name: 'Location A_1',
                description: 'An excellent description of location A_1',
                parentId: 2
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should, post a location with a parent relationship to location A', async() => {
        await endPoint.post('/phobos/location')
            .set({
                idToken: idToken
            })
            .send({
                name: 'Location A_2',
                description: 'An excellent description of location A_2',
                parentId: 2
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should, post a location with no parent child relationship', async() => {
        await endPoint.post('/phobos/location')
            .set({
                idToken: idToken
            })
            .send({
                name: 'Location B',
                description: 'An excellent description of location B',
                parentId: null
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should, post a location with a parent relationship to location B', async() => {
        await endPoint.post('/phobos/location')
            .set({
                idToken: idToken
            })
            .send({
                name: 'Location B_1',
                description: 'An excellent description of location B_1',
                parentId: 5
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should, post a location with a parent relationship to location A', async() => {
        await endPoint.post('/phobos/location')
            .set({
                idToken: idToken
            })
            .send({
                name: 'Location B_2',
                description: 'An excellent description of location B_2',
                parentId: 5
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should, post a location with a parent relationship to location a location whick also has a parent relationship', async() => {
        await endPoint.post('/phobos/location')
            .set({
                idToken: idToken
            })
            .send({
                name: 'Location B_2_1',
                description: 'An excellent description of location B_2_1',
                parentId: 7
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should, post a location with a parent relationship to location a location whick also has a parent relationship', async() => {
        await endPoint.post('/phobos/location')
            .set({
                idToken: idToken
            })
            .send({
                name: 'Location B_2_2',
                description: 'An excellent description of location B_2_2',
                parentId: 7
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should successfully return locations without parents', async() => {
        await endPoint.get('/phobos/location')
            .set({
                idToken: idToken,
                param: ''
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.locations).toHaveLength(3);
            })
    });

    it('should successfully return locations with parent', async() => {
        await endPoint.get('/phobos/location')
            .set({
                idToken: idToken,
                param: 2
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.locations).toHaveLength(2);
            })
    });

    it('should, logout the user given the user id', async() => {
        await endPoint.post('/user/logout')
            .set({idToken: idToken})
            .send({
                localId: localId
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
    });
});

// risk organisation tests
describe('Risk Organisation Test Suite', () => {
    it('should, return the user details and token given correct credentials', async done => {
        await endPoint.post('/user/login')
            .send({
                email: 'sysadmin@phobos.com',
                password: crypto.createHash('sha256').update('1adminphobosB').digest('hex')
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(typeof res.body.user.localId).toBe('number');
                expect(res.body.user.displayName).toBe('Sys admin');
                expect(res.body.user.email).toBe('sysadmin@phobos.com');
                expect(res.body.user.avatarUrl).toBe(null);
                expect(res.body.user.idToken).toHaveLength(256);
                localId = res.body.user.localId;
                idToken = res.body.user.idToken;          
                done();
            })
    });

    it('should, post organisation area - Operations', async() => {
        await endPoint.post('/phobos/organisationarea')
            .set({
                idToken: idToken
            })
            .send({
                name: 'Operations',
                description: 'Operations department'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should, post organisation area - Engineering', async() => {
        await endPoint.post('/phobos/organisationarea')
            .set({
                idToken: idToken
            })
            .send({
                name: 'Engineering',
                description: 'Engineering department'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should, post organisation area - Customer services', async() => {
        await endPoint.post('/phobos/organisationarea')
            .set({
                idToken: idToken
            })
            .send({
                name: 'Customer services',
                description: 'Customer services department'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should, post organisation area - Human Resources', async() => {
        await endPoint.post('/phobos/organisationarea')
            .set({
                idToken: idToken
            })
            .send({
                name: 'Human Resources',
                description: 'Human Resources department'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should, post organisation area - Information Technology', async() => {
        await endPoint.post('/phobos/organisationarea')
            .set({
                idToken: idToken
            })
            .send({
                name: 'Information Technology',
                description: 'Information Technology department'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should, post organisation area - Finance', async() => {
        await endPoint.post('/phobos/organisationarea')
            .set({
                idToken: idToken
            })
            .send({
                name: 'Finance',
                description: 'Finance department'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should, post organisation area - Back office', async() => {
        await endPoint.post('/phobos/organisationarea')
            .set({
                idToken: idToken
            })
            .send({
                name: 'Back office',
                description: 'Back office'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should, post organisation area - Projects', async() => {
        await endPoint.post('/phobos/organisationarea')
            .set({
                idToken: idToken
            })
            .send({
                name: 'Projects',
                description: 'Projects department'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should, post organisation area - Supply chain', async() => {
        await endPoint.post('/phobos/organisationarea')
            .set({
                idToken: idToken
            })
            .send({
                name: 'Supply chain',
                description: 'Supply chain'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should successfully return 9 organisation areas', async() => {
        await endPoint.get('/phobos/organisationarea')
            .set('Accept', 'application/json')
            .set({
                idToken: idToken,
                param: ''
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.organisationAreas).toHaveLength(9);
            })
    });

    it('should successfully return 1 organisation area giver "op"', async() => {
        await endPoint.get('/phobos/organisationarea')
            .set('Accept', 'application/json')
            .set({
                idToken: idToken,
                param: 'op'
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.organisationAreas).toHaveLength(1);
            })
    });

    it('should, logout the user given the user id', async() => {
        await endPoint.post('/user/logout')
            .set({idToken: idToken})
            .send({
                localId: localId
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
    });
});

// risk tests
describe('Risk Test Suite', () => {

    it('should, return the user details and token given correct credentials', async done => {
        await endPoint.post('/user/login')
            .send({
                email: 'sysadmin@phobos.com',
                password: crypto.createHash('sha256').update('1adminphobosB').digest('hex')
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(typeof res.body.user.localId).toBe('number');
                expect(res.body.user.displayName).toBe('Sys admin');
                expect(res.body.user.email).toBe('sysadmin@phobos.com');
                expect(res.body.user.avatarUrl).toBe(null);
                expect(res.body.user.idToken).toHaveLength(256);
                localId = res.body.user.localId;
                idToken = res.body.user.idToken;          
                done();
            })
    });

    it('should, post a risk general data', async() => {
        await endPoint.post('/phobos/risk')
            .set({
                idToken: idToken
            })
            .send({
                title: 'We are all going to die',
                description: 'Sed ullamcorper, odio ut semper interdum, turpis turpis porttitor nisl, eu volutpat libero velit laoreet magna. Quisque sed auctor sem. Nam eleifend feugiat mauris, et eleifend sapien dignissim id. Integer eu leo eget nulla euismod sagittis. Aenean in finibus nisi. Pellentesque ultrices ligula.',
                impactStatement: 'Sed ullamcorper, odio ut semper interdum, turpis turpis porttitor nisl, eu volutpat libero velit laoreet magna. Quisque sed auctor sem. Nam eleifend feugiat mauris, et eleifend sapien dignissim id. Integer eu leo eget nulla euismod sagittis. Aenean in finibus nisi. Pellentesque ultrices ligula.',
                likelihoodScore: 6,
                appetiteScore: 24,
                healthSafetyImpactScore: 6,
                complianceImpactScore: 2,
                financialImpactScore: 1,
                serviceImpactScore: 6,
                humanResourceImpactScore: 6,
                projectImpactScore: 1,
                reputationImpactScore: 1,
                objectiveImpactScore:  4,
                publicityImpactScore: 1,
                status: 'Draft'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .then(res => {
                expect(typeof res.body.msg.insertId).toBe('number');
                insertRiskId = res.body.msg.insertId;
            })
    });

    it('should post a risks location data', async() => {
        await endPoint.post('/phobos/risk/location')
            .set({
                idToken: idToken,
                param: insertRiskId
            })
            .send([
                    {
                        id: 5
                    },
                    {
                        id: 7
                    },
                    {
                        id: 9
                    }
                ])
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should post a risks key words & phrases data', async() => {
        await endPoint.post('/phobos/risk/keywordphrase')
            .set({
                idToken: idToken,
                param: insertRiskId
            })
            .send([
                    {
                        result: "Ed"
                    },
                    {
                        result: "Edd"
                    },
                    {
                        result: "Eddie"
                    },
                    {
                        result: "and Dot"
                    }
             ])
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should post a risks organisational area data', async() => {
        await endPoint.post('/phobos/risk/area')
            .set({
                idToken: idToken,
                param: insertRiskId
            })
            .send([
                    {
                        id: 6
                    },
                    {
                        id: 2
                    },
                    {
                        id: 3
                    },
                    {
                        id: 7
                    }
             ])
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should, post a risks general data', async() => {
        await endPoint.post('/phobos/risk')
            .set({
                idToken: idToken
            })
            .send({
                title: 'Friday night milkshake',
                description: 'Sed ullamcorper, odio ut semper interdum, turpis turpis porttitor nisl, eu volutpat libero velit laoreet magna. Quisque sed auctor sem. Nam eleifend feugiat mauris, et eleifend sapien dignissim id. Integer eu leo eget nulla euismod sagittis. Aenean in finibus nisi. Pellentesque ultrices ligula.',
                impactStatement: 'Sed ullamcorper, odio ut semper interdum, turpis turpis porttitor nisl, eu volutpat libero velit laoreet magna. Quisque sed auctor sem. Nam eleifend feugiat mauris, et eleifend sapien dignissim id. Integer eu leo eget nulla euismod sagittis. Aenean in finibus nisi. Pellentesque ultrices ligula.',
                likelihoodScore: 2,
                appetiteScore: 1,
                healthSafetyImpactScore: 6,
                complianceImpactScore: 6,
                financialImpactScore: 1,
                serviceImpactScore: 6,
                humanResourceImpactScore: 6,
                projectImpactScore: 6,
                reputationImpactScore: 6,
                objectiveImpactScore:  6,
                publicityImpactScore: 1,
                status: 'Draft'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .then(res => {
                expect(typeof res.body.msg.insertId).toBe('number');
                insertRiskId = res.body.msg.insertId;
            })
    });

    it('should post a risks location data', async() => {
        await endPoint.post('/phobos/risk/location')
            .set({
                idToken: idToken,
                param: insertRiskId
            })
            .send([
                {
                    id: 5
                },
                {
                    id: 7
                },
                {
                    id: 9
                }
            ])
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should post a risks key words & phrases data', async() => {
        await endPoint.post('/phobos/risk/keywordphrase')
            .set({
                idToken: idToken,
                param: insertRiskId
            })
            .send([
                {
                    result: "today"
                },
                {
                    result: "forever more"
                },
                {
                    result: "love sick"
                },
                {
                    result: "me"
                }
            ])
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should post a risks organisational area data', async() => {
        await endPoint.post('/phobos/risk/area')
            .set({
                idToken: idToken,
                param: insertRiskId
            })
            .send([
                {
                    id: 1
                },
                {
                    id: 8
                }
            ])
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should, return all the registered risks', async() => {
        await endPoint.get('/phobos/risk')
        .set({
            idToken: idToken,
            param: '',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
            expect(res.body).toBeDefined();
            expect(res.body.status).toBe(200);
            expect(res.body.risk).toHaveLength(2)
        })
    });

    it('should, logout the user given the user id', async() => {
        await endPoint.post('/user/logout')
            .set({idToken: idToken})
            .send({
                localId: localId
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
    });

});

describe('The FitMeIn test suite', () => {
    it('should, return the user details and token given correct credentials', async done => {
        await endPoint.post('/user/login')
            .send({
                email: 'sysadmin@phobos.com',
                password: crypto.createHash('sha256').update('1adminphobosB').digest('hex')
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(typeof res.body.user.localId).toBe('number');
                expect(res.body.user.displayName).toBe('Sys admin');
                expect(res.body.user.email).toBe('sysadmin@phobos.com');
                expect(res.body.user.avatarUrl).toBe(null);
                expect(res.body.user.idToken).toHaveLength(256);
                localId = res.body.user.localId;
                idToken = res.body.user.idToken;          
                done();
            })
    });

    it('should, post a new FitMeIn spot', async() => {
        await endPoint.post('/fitmein/spot')
            .set({
                idToken: idToken
            })
            .send({
                ownerUserId: localId,
                title: 'Freakishly Good Shave',
                description: 'Sed ullamcorper, odio ut semper interdum, turpis turpis porttitor nisl, eu volutpat libero velit laoreet magna. Quisque sed auctor sem. Nam eleifend feugiat mauris, et eleifend sapien dignissim id. Integer eu leo eget nulla.',
                appointmentDateTime: new Date(new Date().getTime()+(3*24*60*60*1000)).toJSON().slice(0, 19).replace('T', ' '),
                duration: 20,
                price: 10.95,
                imageUrl: 'https://scontent-lhr8-1.cdninstagram.com/v/t51.2885-15/26222847_327336174440651_4236179458689597440_n.jpg?stp=dst-jpg_e35&_nc_ht=scontent-lhr8-1.cdninstagram.com&_nc_cat=111&_nc_ohc=bNDdVkcY0YcAX83LcJ6&edm=AABBvjUBAAAA&ccb=7-4&oh=00_AT_3gJ0wQ0ol6XEPyOn7emHtr8KSkZsfD4AsJxLZAb9Dwg&oe=621F7F49&_nc_sid=83d603'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .then(res => {
                expect(typeof res.body.msg.insertId).toBe('number');
            })
    });

    it('should, post a new FitMeIn spot', async() => {
        await endPoint.post('/fitmein/spot')
            .set({
                idToken: idToken
            })
            .send({
                ownerUserId: localId,
                title: 'Full pamper session',
                description: 'Sed ullamcorper, odio ut semper interdum, turpis turpis porttitor nisl, eu volutpat libero velit laoreet magna. Quisque sed auctor sem. Nam eleifend feugiat mauris, et eleifend sapien dignissim id. Integer eu leo eget nulla.',
                appointmentDateTime: new Date(new Date().getTime()+(13*24*60*60*1000)).toJSON().slice(0, 19).replace('T', ' '),
                duration: 60,
                price: 34.95,
                imageUrl: 'https://scontent-lhr8-1.cdninstagram.com/v/t51.2885-15/26222847_327336174440651_4236179458689597440_n.jpg?stp=dst-jpg_e35&_nc_ht=scontent-lhr8-1.cdninstagram.com&_nc_cat=111&_nc_ohc=bNDdVkcY0YcAX83LcJ6&edm=AABBvjUBAAAA&ccb=7-4&oh=00_AT_3gJ0wQ0ol6XEPyOn7emHtr8KSkZsfD4AsJxLZAb9Dwg&oe=621F7F49&_nc_sid=83d603'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .then(res => {
                expect(typeof res.body.msg.insertId).toBe('number');
            })
    });

    it('should, post a new FitMeIn spot', async() => {
        await endPoint.post('/fitmein/spot')
            .set({
                idToken: idToken
            })
            .send({
                ownerUserId: localId,
                title: 'Two nights at Grand Hotel',
                description: 'Sed ullamcorper, odio ut semper interdum, turpis turpis porttitor nisl, eu volutpat libero velit laoreet magna. Quisque sed auctor sem. Nam eleifend feugiat mauris, et eleifend sapien dignissim id. Integer eu leo eget nulla.',
                appointmentDateTime: new Date(new Date().getTime()+(8*24*60*60*1000)).toJSON().slice(0, 19).replace('T', ' '),
                duration: 5,
                price: 350,
                imageUrl: 'https://www.countryhotelbreaks.com/db_library/down-hall/640x480_TBG6S_71962downhallhomepage-clean2.jpg'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .then(res => {
                expect(typeof res.body.msg.insertId).toBe('number');
            })
    });

    it('should, post a new FitMeIn spot', async() => {
        await endPoint.post('/fitmein/spot')
            .set({
                idToken: idToken
            })
            .send({
                ownerUserId: localId,
                title: 'Mens hair cut',
                description: 'Sed ullamcorper, odio ut semper interdum, turpis turpis porttitor nisl, eu volutpat libero velit laoreet magna. Quisque sed auctor sem. Nam eleifend feugiat mauris, et eleifend sapien dignissim id. Integer eu leo eget nulla.',
                appointmentDateTime: new Date(new Date().getTime()+(5*24*60*60*1000)).toJSON().slice(0, 19).replace('T', ' '),
                duration: 45,
                price: 25.95,
                imageUrl: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/7b23fe30414505.5621a05c3dfda.png'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .then(res => {
                expect(typeof res.body.msg.insertId).toBe('number');
            })
    });

    it('should, post a new FitMeIn spot', async() => {
        await endPoint.post('/fitmein/spot')
            .set({
                idToken: idToken
            })
            .send({
                ownerUserId: localId,
                title: 'Ladies shave',
                description: 'Sed ullamcorper, odio ut semper interdum, turpis turpis porttitor nisl, eu volutpat libero velit laoreet magna. Quisque sed auctor sem. Nam eleifend feugiat mauris, et eleifend sapien dignissim id. Integer eu leo eget nulla.',
                appointmentDateTime: new Date(new Date().getTime()+(10*24*60*60*1000)).toJSON().slice(0, 19).replace('T', ' '),
                duration: 25,
                price: 15.95,
                imageUrl: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/7b23fe30414505.5621a05c3dfda.png'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .then(res => {
                expect(typeof res.body.msg.insertId).toBe('number');
            })
    });

    it('should, return a dataset containing the book registered above', async() => {
        await endPoint.get('/fitmein/spots')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
            })
    });

    it('should, post a new order', async() => {
        await endPoint.post('/fitmein/order')
            .set({
                idToken: idToken
            })
            .send({
                localId: localId,
                basketItems: [{id: '1', title: 'Freakishly Good Shave', price: 10.00}, {id: '1', title: 'Freakishly Good Shave', price: 10.00}],
                total: 20.00
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .then(res => {
                expect(typeof res.body.msg.insertId).toBe('number');
            })
    });

    it('should, return a dataset containing orders', async() => {
        await endPoint.get('/fitmein/orders')
            .set({
                idToken: idToken,
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
            })
    });

    it('should update the spot', async() => {
        await endPoint.patch('/fitmein/spot')
            .set({
                idToken: idToken
            })
            .send({
                id: 5, 
                title: 'Ladies shave!',
                description: 'updated Sed ullamcorper, odio ut semper interdum, turpis turpis porttitor nisl, eu volutpat libero velit laoreet magna. Quisque sed auctor sem. Nam eleifend feugiat mauris, et eleifend sapien dignissim id. Integer eu leo eget nulla.',
                appointmentDateTime: new Date(new Date().getTime()+(15*24*60*60*1000)).toJSON().slice(0, 19).replace('T', ' '),
                duration: 30,
                price: 16.95,
                imageUrl: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/7b23fe30414505.5621a05c3dfda.png'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
    });

    it('should put the spot in the basket for the first time', async() => {
        await endPoint.patch('/fitmein/spotbasket')
            .set({
                idToken: idToken
            })
            .send({
                id: 4,
                inBasketUserID: localId
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
    });

    it('should take the spot out of the basket', async() => {
        await endPoint.patch('/fitmein/spotbasketremove')
            .set({
                idToken: idToken
            })
            .send({
                id: 4
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
    });

    it('Should put the spot back in the basket', async() => {
        await endPoint.patch('/fitmein/spotbasket')
            .set({
                idToken: idToken
            })
            .send({
                id: 4,
                inBasketUserID: localId
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
    });

    // it('should purchase the spot', async() => {
    //     await endPoint.patch('/fitmein/spotpurchase')
    //         .set({
    //             idToken: idToken
    //         })
    //         .send({
    //             id: 4,
    //             purchasedByUserId: localId
    //         })
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /json/)
    //         .expect(200)
    // });

    it('should delete the spot', async() => {
        await endPoint.delete('/fitmein/spot')
            .set({
                idToken: idToken,
                id: 5
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
    });

    it('should, logout the user given the user id', async() => {
        await endPoint.post('/user/logout')
            .set({idToken: idToken})
            .send({
                localId: localId
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
    });
});

// Intelliverse risk tests
describe('The intelliverse risk test suite', () => {


    it('should, login', async done => {
        await endPoint.post('/user/login')
            .send({
                email: 'sysadmin@phobos.com',
                password: crypto.createHash('sha256').update('1adminphobosB').digest('hex')
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(typeof res.body.user.localId).toBe('number');
                expect(res.body.user.displayName).toBe('Sys admin');
                expect(res.body.user.email).toBe('sysadmin@phobos.com');
                expect(res.body.user.avatarUrl).toBe(null);
                expect(res.body.user.idToken).toHaveLength(256);
                localId = res.body.user.localId;
                idToken = res.body.user.idToken;          
                done();
            })
    });

    it('should, record the first new collection', async() => {
        const id = generateUUID();
        await endPoint.post('/ivEntry')
            .set({
                idToken: idToken
            })
            .send({collection: [
                {id: id, universe: 'risk', entry: 'covid'},
                {id: id, universe: 'risk', entry: 'pandemic'},
                {id: id, universe: 'risk', entry: 'global'},
                {id: id, universe: 'risk', entry: 'covid-19'},
                {id: id, universe: 'risk', entry: 'virus'}
             ]})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should, record the second new collection', async() => {
        const id = generateUUID();
        await endPoint.post('/ivEntry')
            .set({
                idToken: idToken
            })
            .send({collection: [
                {id: id, universe: 'risk', entry: 'virus'},
                {id: id, universe: 'risk', entry: 'outbreak'},
                {id: id, universe: 'risk', entry: 'lost time'},
                {id: id, universe: 'risk', entry: 'sickness'}
             ]})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should, record the third new collection', async() => {
        const id = generateUUID();
        await endPoint.post('/ivEntry')
            .set({
                idToken: idToken
            })
            .send({collection: [
                {id: id, universe: 'risk', entry: 'virus'},
                {id: id, universe: 'risk', entry: 'outbreak'},
                {id: id, universe: 'risk', entry: 'lost time'},
                {id: id, universe: 'risk', entry: 'cold'},
                {id: id, universe: 'risk', entry: 'days off work'}
             ]})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    });

    it('should, return five intelliSense entries, given "c"', async() => {
        await endPoint.get('/ivIntelliSense')
            .set({
                idToken: idToken,
                param: 'c',
                universe: 'risk'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.intelliSense).toHaveLength(5)
            })
    });

    it('should, return three intelliSense entries, given "co"', async() => {
        await endPoint.get('/ivIntelliSense')
            .set({
                idToken: idToken,
                param: 'co',
                universe: 'risk'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.intelliSense).toHaveLength(3)
            })
    });

    it('should, return three intelliSense entries, given "covid"', async() => {
        await endPoint.get('/ivIntelliSense')
            .set({
                idToken: idToken,
                param: 'covid',
                universe: 'risk'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.intelliSense).toHaveLength(2)
            })
    });

    it('should, return three intelliSuggest entries, given "covid"', async() => {
        await endPoint.get('/ivIntelliSuggest')
            .set({
                idToken: idToken,
                param: 'covid',
                universe: 'risk'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.intelliSuggest).toHaveLength(5)
            })
    });

    it('should, return three intelliSuggest entries, given "abcdef"', async() => {
        await endPoint.get('/ivIntelliSuggest')
            .set({
                idToken: idToken,
                param: 'abcdef',
                universe: 'risk'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.intelliSuggest).toHaveLength(0)
            })
    });

    it('should, return top six results, given ""', async() => {
        await endPoint.get('/ivIntelliSuggest')
            .set({
                idToken: idToken,
                param: '',
                universe: 'risk'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.intelliSuggest).toHaveLength(6)
            })
    });

    
    it('should, logout', async() => {
        await endPoint.post('/user/logout')
            .set({idToken: idToken})
            .send({
                localId: localId
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
    });
});

// describe('The intelliverse location test suite', () => {

//     it('should, login', async done => {
//         await endPoint.post('/user/login')
//             .send({
//                 email: 'sysadmin@phobos.com',
//                 password: crypto.createHash('sha256').update('1adminphobosB').digest('hex')
//             })
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .then(res => {
//                 expect(res.body).toBeDefined();
//                 expect(res.body.status).toBe(200);
//                 expect(typeof res.body.user.localId).toBe('number');
//                 expect(res.body.user.displayName).toBe('Sys admin');
//                 expect(res.body.user.email).toBe('sysadmin@phobos.com');
//                 expect(res.body.user.avatarUrl).toBe(null);
//                 expect(res.body.user.idToken).toHaveLength(256);
//                 localId = res.body.user.localId;
//                 idToken = res.body.user.idToken;          
//                 done();
//             })
//     });

//     it('should, record the location collection', async() => {
//         const id = generateUUID();
//         await endPoint.post('/ivEntry')
//             .set({
//                 idToken: idToken
//             })
//             .send({collection: [
//                 {id: id, universe: 'location', entry: '10 blackfriars'},
//                 {id: id, universe: 'location', entry: 'textile apartments'},
//                 {id: id, universe: 'location', entry: 'mail room'}
//              ]})
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(201)
//     });

//     it('should, record the location collection', async() => {
//         const id = generateUUID();
//         await endPoint.post('/ivEntry')
//             .set({
//                 idToken: idToken
//             })
//             .send({collection: [
//                 {id: id, universe: 'location', entry: '10 blackfriars'},
//                 {id: id, universe: 'location', entry: 'textile apartments'},
//                 {id: id, universe: 'location', entry: 'apartment 9'}
//              ]})
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(201)
//     });

//     it('should, record the location collection', async() => {
//         const id = generateUUID();
//         await endPoint.post('/ivEntry')
//             .set({
//                 idToken: idToken
//             })
//             .send({collection: [
//                 {id: id, universe: 'location', entry: '10 blackfriars'},
//                 {id: id, universe: 'location', entry: 'textile apartments'},
//                 {id: id, universe: 'location', entry: 'apartment 27'}
//              ]})
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(201)
//     });

//     it('should, record the location collection', async() => {
//         const id = generateUUID();
//         await endPoint.post('/ivEntry')
//             .set({
//                 idToken: idToken
//             })
//             .send({collection: [
//                 {id: id, universe: 'location', entry: '10 blackfriars'},
//                 {id: id, universe: 'location', entry: 'textile apartments'},
//                 {id: id, universe: 'location', entry: 'Basement'}
//              ]})
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(201)
//     });

//     it('should, return three intelliSuggest entries, given "textile apartments"', async() => {
//         await endPoint.get('/ivIntelliSuggest')
//             .set({
//                 idToken: idToken,
//                 param: 'textile apartments',
//                 universe: 'location'
//             })
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .then(res => {
//                 expect(res.body).toBeDefined();
//                 expect(res.body.status).toBe(200);
//                 expect(res.body.intelliSuggest).toHaveLength(6)
//             })
//     });

//     it('should, logout', async() => {
//         await endPoint.post('/user/logout')
//             .set({idToken: idToken})
//             .send({
//                 localId: localId
//             })
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(200)
//     });

// });