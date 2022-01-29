// Description: Provides the repository for the user location functionality
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const database = require('../../configuration/database');
const {postLocationSchema} = require('../../data/validation/schema/schema');
const validate = require('../../data/validation/validate');

const postLocation = (req, next) => {
    
    const errors = validate(req, postLocationSchema);

    if(errors.length > 0)
        next({status: 400, msg: 'Bad request'}, null);
    else {

        const values = [req.name, req.description, req.parentId];

        database.getPool().query (
            'insert into riskLocation (name, description, parentId) values (?)',
            [values],
            (err, res) => {
                if(err)
                    next({status: 500, msg: err}, null);
                else
                    next(null, {status: 201, msg: 'Created'});
            }
        );
    }
};

const getlocations = (req, next) => {

    let sqlWhere = `where name like '%${req.headers.param}%' and parentId is null`;

    if (req.headers.param === '')
        sqlWhere = `where parentId is null`;
    else if (Number(req.headers.param))
        sqlWhere = `where parentId = ${req.headers.param}`;

    const sqlQuery = `  select id, name, description from riskLocation
                        ${sqlWhere}
                        order by name asc`;

    database.getPool().query (
        sqlQuery,
        (err, res) => {
            if(err)
                next({status: 500, msg: err}, null);
            else
                next(null, {status: 200, locations: res});
        }
    );
};

module.exports = {
    postLocation: postLocation,
    getlocations: getlocations
}