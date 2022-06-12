// Description: Provides the repository for the user risk functionality
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const database = require('../../configuration/database');
const {postRiskSchema, postRiskLocationSchema, postRiskKeyWordPhraseSchema, postRiskAreaSchema} = require('../../data/validation/schema/schema');
const validate = require('../../data/validation/validate');

const postRisk = (req, next) => {
    
    const errors = validate(req, postRiskSchema);

    if(errors.length > 0)
        next({status: 400, msg: 'Bad request'}, null);
    else {

        const values = [req.title, req.description, req.impactStatement, req.likelihoodScore,
            req.appetiteScore, req.healthSafetyImpactScore, req.complianceImpactScore, req.financialImpactScore,
            req.serviceImpactScore, req.humanResourceImpactScore, req.projectImpactScore, req.reputationImpactScore,
            req.objectiveImpactScore, req.publicityImpactScore, req.status];

        database.getPool().query (
            `insert into registeredRisk (title, description, likelihoodImpactStatement,likelihoodScore,
            appetiteScore, healthSafetyImpactScore, complianceImpactScore, financialImpactScore,
            serviceImpactScore, humanResourceImpactScore, projectImpactScore, reputationImpactScore,
            objectiveImpactScore, publicityImpactScore, status) values (?)`,
            [values],
            (err, res) => {
                if(err)
                    next({status: 500, msg: err}, null);
                else
                    next(null, {status: 201, msg: res});
                    // next(null, {status: 201, msg: 'Created'});
            }
        );
    }
};

const postRiskLocation = (req, next) => {

    let errors = [];
    const values = [];

    req.body.forEach(item => {
        errors = validate(item, postRiskLocationSchema);

        if(errors.length === 0)
            values.push(`('${req.headers.param}', '${item.id}')`);
        else
            return next({status: 400, msg: 'Bad request'}, null);
        
    });

    const sqlQuery = `insert into registeredRiskLocation (riskId, locationId)
                    values ${values.join(', ')};`;

    database.getPool().query (
        sqlQuery,
        (err) => {
            if(err)
                next({status: 500, msg: err}, null);
            else
                next(null, {status: 201, msg: 'Created'});
        }
    );
};

const postRiskKeyWordPhrase = (req, next) => {

    let errors = [];
    const values = [];

    req.body.forEach(item => {
        errors = validate(item, postRiskKeyWordPhraseSchema);

        if(errors.length === 0)
            values.push(`('${req.headers.param}', '${item.result}')`);
        else
            return next({status: 400, msg: 'Bad request'}, null);
        
    });

    const sqlQuery = `insert into registeredRiskKeyWordPhrase (riskId, keyWordPhrase)
                    values ${values.join(', ')};`;

    database.getPool().query (
        sqlQuery,
        (err) => {
            if(err)
                next({status: 500, msg: err}, null);
            else
                next(null, {status: 201, msg: 'Created'});
        }
    );
};

const postRiskArea = (req, next) => {

    let errors = [];
    const values = [];

    req.body.forEach(item => {
        errors = validate(item, postRiskAreaSchema);

        if(errors.length === 0)
            values.push(`('${req.headers.param}', '${item.id}')`);
        else
            return next({status: 400, msg: 'Bad request'}, null);
        
    });

    const sqlQuery = `insert into registeredRiskArea (riskId, areaId)
                    values ${values.join(', ')};`;

    database.getPool().query (
        sqlQuery,
        (err) => {
            if(err)
                next({status: 500, msg: err}, null);
            else
                next(null, {status: 201, msg: 'Created'});
        }
    );
};

const getRisk = (req, next) => {

    // let sqlWhere = `where name like '%${req.headers.param}%'`;

    // if (req.headers.param === '')
    //     sqlWhere = `where parentId is null`;
    // else if (Number(req.headers.param))
    //     sqlWhere = `where parentId = ${req.headers.param}`;

    // const sqlQuery = `  select id, name, description from riskLocation
    //                     ${sqlWhere}
    //                     order by name asc`;

    const sqlQuery = `select id, title, description, likelihoodImpactStatement,likelihoodScore,
    appetiteScore, healthSafetyImpactScore, complianceImpactScore, financialImpactScore,
    serviceImpactScore, humanResourceImpactScore, projectImpactScore, reputationImpactScore,
    objectiveImpactScore, publicityImpactScore, status from registeredRisk`

    database.getPool().query (
        sqlQuery,
        (err, res) => {
            if(err)
                next({status: 500, msg: err}, null);
            else
                next(null, {status: 200, risk: res});
        }
    );
};

module.exports = {
    postRisk: postRisk,
    postRiskLocation: postRiskLocation,
    postRiskKeyWordPhrase: postRiskKeyWordPhrase,
    postRiskArea: postRiskArea,
    getRisk: getRisk
}