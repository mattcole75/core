// Description: Provides the repository for the user organisation functionality
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const database = require('../../configuration/database');
const {postOrganisationAreaSchema} = require('../../data/validation/schema/schema');
const validate = require('../../data/validation/validate');

const postOrganisationArea = (req, next) => {
    
    const errors = validate(req, postOrganisationAreaSchema);

    if(errors.length > 0)
        next({status: 400, msg: 'Bad request'}, null);
    else {

        const values = [req.name, req.description];

        database.getPool().query (
            'insert into riskOrganisationArea (name, description) values (?)',
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

const getOrganisationalAreas = (req, next) => {

    const sqlWhere = `where concat_ws('', name, description) like '%${req.headers.param}%'`;
    const sqlQuery = `  select id, name, description, name as 'result' from riskOrganisationArea
                        ${req.headers.param ? sqlWhere : ''} 
                        order by name asc`;

    database.getPool().query (
        sqlQuery,
        (err, res) => {
            if(err)
                next({status: 500, msg: err}, null);
            else
                next(null, {status: 200, organisationAreas: res});
        }
    );
};

module.exports = {
    postOrganisationArea: postOrganisationArea,
    getOrganisationalAreas: getOrganisationalAreas
}