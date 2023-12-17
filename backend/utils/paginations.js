/**
 * 
 * @param {number} inPage 
 * @param {number} inSize 
 * @returns page, size, dan skip
 */
exports.paginations = (inPage, inSize) => {
    const page = inPage * 1 || 1; // || 1 mean the default is 1
    const size = inSize * 1 || 100;
    const skip = (page - 1) * size;

    return { page: page, size: size, skip: skip }
}