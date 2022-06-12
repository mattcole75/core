// Description: the configuration file for the data validator for all supported applications
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

const postUserSchema = {
    displayName: value => value.length > 0 && value.length <= 50,
    email: value => /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/.test(value),
    password: value => value.length === 64
};

const postLoginSchema = {
    email: value => /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/.test(value),
    password: value => value.length === 64
};

const postLogoutSchema = {
    localId: value => parseInt(value) === Number(value)
};

const postFeedbackSchema = {
    localId: value => parseInt(value) === Number(value),
    title: value => value.length > 0 && value.length <= 50,
    feedback: value => value.length > 0 && value.length <= 300
};

const postIntelliverseSchema = {
    id: value => value.length === 36,
    universe: value => value.length > 0 && value.length <= 50,
    entry: value => value.length > 0 && value.length <= 200
};

const postOrganisationAreaSchema = {
    name: value => value.length > 0 && value.length <= 50,
    description: value => value.length > 0 && value.length <= 200
};

const postLocationSchema = {
    name: value => value.length > 0 && value.length <= 50,
    description: value => value.length > 0 && value.length <= 200,
    parentId: value => parseInt(value) === Number(value) || value === null
};

const postRiskSchema = {
    title: value => value.length > 0 && value.length <= 50,
    description: value => value.length > 0 && value.length <= 500,
    impactStatement: value => value.length > 0 && value.length <= 500,
    likelihoodScore: value => value >= 1 && value <= 6,
    appetiteScore: value => value >= 1 && value <= 36,
    healthSafetyImpactScore: value => value >= 1 && value <= 6,
    complianceImpactScore: value => value >= 1 && value <= 6,
    financialImpactScore: value => value >= 1 && value <= 6,
    serviceImpactScore: value => value >= 1 && value <= 6,
    humanResourceImpactScore: value => value >= 1 && value <= 6,
    projectImpactScore: value => value >= 1 && value <= 6,
    reputationImpactScore: value => value >= 1 && value <= 6,
    objectiveImpactScore:  value => value >= 1 && value <= 6,
    publicityImpactScore: value => value >= 1 && value <= 6,
    status: value => value.length > 0 && value.length <= 50
};

const postRiskLocationSchema = {
    id: value => (typeof value) === 'number'
};

const postRiskKeyWordPhraseSchema = {
    result: value => value.length > 0 && value.length <= 200
};

const postRiskAreaSchema = {
    id: value => (typeof value) === 'number'
};


const patchDisplayNameSchema = {
    localId: value => parseInt(value) === Number(value),
    displayName: value => value.length > 0 && value.length <= 50
};

const patchEmailSchema = {
    localId: value => parseInt(value) === Number(value),
    email: value => /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/.test(value)
};

const patchAvatarUrlSchema = {
    localId: value => parseInt(value) === Number(value),
    avatarUrl: value => /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(value)
};

const patchAvatarSchema = {
    localId: value => parseInt(value) === Number(value),
    avatar: value => value === 'delete'
};

const patchPasswordSchema = {
    localId: value => parseInt(value) === Number(value),
    password: value => value.length === 64
};

const getUserSchema = {
    localId: value => parseInt(value) === Number(value)
};

const getFeedbackSchema = {
    param: value => parseInt(value) === Number(value)
};

const getTokenSchema = {
    idToken: value => value.length === 256
};

const userIdSchema = {
    localId: value => parseInt(value) === Number(value)
};

module.exports = {
    postUserSchema: postUserSchema,
    postLoginSchema: postLoginSchema,
    postLogoutSchema: postLogoutSchema,
    postFeedbackSchema: postFeedbackSchema,
    postIntelliverseSchema: postIntelliverseSchema,
    postOrganisationAreaSchema: postOrganisationAreaSchema,
    postLocationSchema: postLocationSchema,
    postRiskSchema: postRiskSchema,
    postRiskLocationSchema: postRiskLocationSchema,
    postRiskKeyWordPhraseSchema: postRiskKeyWordPhraseSchema,
    postRiskAreaSchema: postRiskAreaSchema,
    patchDisplayNameSchema: patchDisplayNameSchema,
    patchEmailSchema: patchEmailSchema,
    patchAvatarUrlSchema: patchAvatarUrlSchema,
    patchAvatarSchema: patchAvatarSchema,
    patchPasswordSchema:patchPasswordSchema,
    getUserSchema: getUserSchema,
    getTokenSchema: getTokenSchema,
    userIdSchema: userIdSchema,
    getFeedbackSchema: getFeedbackSchema
}