// Description: Provides the repository for the user IntelliVerse functionality
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const database = require('../../configuration/database');
const {postIntelliverseSchema} = require('../../data/validation/schema/schema');
const validate = require('../../data/validation/validate');

const postIvEntry = (req, next) => {
    
    let errors = [];
    const values = [];

    req.collection.forEach(item => {
        errors = validate(item, postIntelliverseSchema);

        if(errors.length === 0)
            values.push(`('${item.id}', '${item.universe}', '${item.entry}')`);
        else
            return next({status: 400, msg: 'Bad request'}, null);
        
    });

    const sqlQuery = `insert into intelliverseHold (id, universe, entry)
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

const getIvIntelliSense = (req, next) => {

    const sqlQuery = `select distinct
                        concat(ifnull(a.word, ''), ifnull(a.phrase, '')) as result,
                        ifnull(b.occurrence, 0) + ifnull(c.occurrence, 0) as occurrence
                        from intelliverseEntryCollection a
                            left join intelliverseWord b on a.word = b.word
                            left join intelliversePhrase c on a.phrase = c.phrase
                        where concat_ws('', a.word, a.phrase) like '%${req.headers.param}%'
                        order by ifnull(b.occurrence, 0) + ifnull(c.occurrence, 0) desc,
                        concat(ifnull(a.word, ''), ifnull(a.phrase, '')) asc
                        limit 6;`;
    
    database.getPool().query (
        sqlQuery,
        (err, res) => {
            if(err)
                next({status: 500, msg: err}, null);
            else
                next(null, {status: 200, intelliSense: res});
        }
    );
}

const getIvIntelliSuggest = (req, next) => {

    const sqlWhere = `where concat_ws('', word, phrase) in ('${req.headers.param}')`;
    const sqlQuery = `select distinct
                        concat(ifnull(a.word, ''), ifnull(a.phrase, '')) as result,
                        concat(ifnull(b.occurrence, 0), ifnull(c.occurrence, 0)) as occurrence
                        from intelliverseEntryCollection a
                            left join intelliverseWord b on a.word = b.word
                            left join intelliversePhrase c on a.phrase = c.phrase
                            left join intelliverseEntry d on a.entry_id = d.id
                        where a.entry_id in (
                            select distinct entry_id
                            from intelliverseEntryCollection
                            ${req.headers.param ? sqlWhere : ''}
                        )
                        and d.universe = '${req.headers.universe}'
                        order by concat(ifnull(b.occurrence, 0), ifnull(c.occurrence, 0)) desc,
                        concat(ifnull(a.word, ''), ifnull(a.phrase, '')) asc
                        limit 6;`;
    
    database.getPool().query (
        sqlQuery,
        (err, res) => {
            if(err)
                next({status: 500, msg: err}, null);
            else
                next(null, {status: 200, intelliSuggest: res});
        }
    );

};

module.exports = {
    postIvEntry: postIvEntry,
    getIvIntelliSense: getIvIntelliSense,
    getIvIntelliSuggest: getIvIntelliSuggest
}