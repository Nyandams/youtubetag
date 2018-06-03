module.exports = function (randomSecretKey, bcrypt, jwt) {


    const module = {};


    /**
     * @desc callback succeed if authenticate succeed, otherwise callback fail
     * @param {Request} req
     * @param {Function} callback
     */
    module.authenticate = function (req, callback) {
        const token = req.cookies['youtubetag'];
        if (token) {
            jwt.verify(token, randomSecretKey, function (err, decoded) {
                if (err) {
                    callback.fail("WRONG_TOKEN_AUTH");
                } else {
                    callback.success(decoded);
                }
            });
        } else {
            callback.fail("NO_TOKEN_AUTH");
        }
    };


    /**
     * @desc return the hashed version of the password
     * @param {String} plainPassword
     * @returns {string|?string}
     */
    module.hashPassword = function (plainPassword) {
        let salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(plainPassword, salt);
    };


    /**
     * @desc return true if hash(plainPassword) == password
     * @param {String} plainPassword
     * @param {String} password
     * @returns {boolean}
     */
    module.checkPassword = function (plainPassword, password) {
        return bcrypt.compareSync(plainPassword, password)
    };



    /**
     * @desc return the jsonWebToken as string
     * @param {Object} payload
     * @returns {number | PromiseLike<ArrayBuffer>}
     */
    module.createToken = function (payload) {
        return jwt.sign(payload, randomSecretKey);
    };


    return module;
};
