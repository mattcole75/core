// Description: A collection of utility core
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1. 

//A function that generates a unique UID
const generateUUID = () => {
    let d = new Date().getTime();
    let d2 = (performance && performance.now && (performance.now()*1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16;
        if(d > 0){
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

module.exports = {
    generateUUID: generateUUID
}