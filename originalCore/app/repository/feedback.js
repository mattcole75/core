// Description: Provides the repository for the user feedback functionality
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const database = require('../../configuration/database');
const {postFeedbackSchema, getFeedbackSchema} = require('../../data/validation/schema/schema');
const validate = require('../../data/validation/validate');


const postFeedback = (req, next) => {

    const errors = validate(req, postFeedbackSchema);

    if(errors.length > 0)
        next({status: 400, msg: 'Bad request'}, null);
    else {

        const values = [req.localId, req.title, req.feedback];

        database.getPool().query (
            'insert into coreFeedback (localId, title, feedback) values (?)',
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

const getFeedback = (req, next) => {

    const errors = validate(req, getFeedbackSchema);

    if (errors.length > 0)
        next({status: 400, msg: 'Bad request'}, null);
    else {

        database.getPool().query (
            'select a.id, a.title, a.feedback, b.displayName, b.avatarUrl from coreFeedback a inner join coreUser b on a.localId = b.localId where approved = true  order by visability asc limit ?',
            [parseInt(req.param)],
            (err, res) => {
                if(err)
                    next({status: 500, msg: err}, null);
                else
                    next(null, {status: 200, feedback: res});
            }
        );
    }
};

module.exports = {
    postFeedback: postFeedback,
    getFeedback: getFeedback
}