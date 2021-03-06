const User = require('./user.js');

module.exports = function (pool) {
    var module = {};

    /**
     * @desc create an user
     * @param {User} user
     * @param {Function} callback
     */
    module.create = function (user, callback) {
        console.log('______create_user______');
        pool.connect(function (err, client, done) {
            if (err) throw err;

            var query = {
                name: 'create-user',
                text: 'INSERT INTO public.user (pseudo_user, password_user, email_user, is_admin_user) VALUES ($1, $2, $3, $4) RETURNING *',
                values: [user.pseudo_user, user.password_user, user.email_user, false]
            };

            client.query(query, (err, res) => {
                done();

                if (err) {
                    console.log(err.stack);
                    callback.fail(err);
                } else if (res.rowCount == 0) {
                    console.log('fail');
                    callback.fail(null);
                } else {
                    console.log('success');
                    user.id_user = res.rows[0].id_user;
                    callback.success(user);
                }
            })
        });
    };

    /**
     * @desc callback succeed(rows) if an user with pseudo or email exist
     * @param {String} pseudo
     * @param {String} email
     * @param {Function} callback
     */

    module.getByEmailPseudo = function (pseudo, email, callback) {
        console.log('______getByEmailPseudo______');
        pool.connect(function (err, client, done) {
            if (err) throw err;

            var query = {
                name: 'fetch-by-pseudo-email',
                text: 'SELECT * FROM public.user WHERE pseudo_user = $1 OR  email_user = $2',
                values: [pseudo, email]
            };

            client.query(query, (err, res) => {
                done();

                if (err) {
                    console.log(err.stack);
                    callback.fail(err);
                } else if (res.rowCount == 0) {
                    console.log('fail');
                    callback.fail(null);
                } else {
                    console.log('success');
                    var user = new tag(res.rows[0].id_tag, res.rows[0].libelle_tag);
                    callback.success(user);
                }
            })
        });
    };


    /**
     * @desc callback succeed(rows) if an user with email exist
     * @param {String} pseudo
     * @param {Function} callback
     */
    module.getByPseudo = function (pseudo, callback) {
        console.log('______getByEmail______');
        pool.connect(function (err, client, done) {
            if (err) throw err;

            var query = {
                name: 'fetch-by-pseudo',
                text: 'SELECT * FROM public.user WHERE pseudo_user = $1',
                values: [pseudo]
            };

            client.query(query, (err, res) => {
                done();

                if (err) {

                    console.log(err.stack);
                    callback.fail(err);
                } else if (res.rowCount == 0) {
                    console.log('fail');
                    callback.fail(null);
                } else {
                    console.log('success');
                    var user = new User(res.rows[0].id_user, res.rows[0].pseudo_user, res.rows[0].password_user, res.rows[0].email_user, res.rows[0].is_admin_user, res.rows[0].date_inscription_user);
                    callback.success(user);
                }
            })
        });
    };



    /**
     * @desc callback succeed(rows) if an user with email exist
     * @param {String} email
     * @param {String} callback
     */
    module.getByEmail = function (email, callback) {
        console.log('______getByEmail______');
        pool.connect(function (err, client, done) {
            if (err) throw err;


            var query = {
                name: 'fetch-by-email',
                text: 'SELECT * FROM public.user WHERE email_user = $1',
                values: [email]
            };


            client.query(query, (err, res) => {
                done();

                if (err) {
                    console.log(err.stack);
                    callback.fail(err);
                } else if (res.rowCount == 0) {
                    console.log('fail');
                    callback.fail(null);
                } else {
                    console.log('success');
                    var user = new User(res.rows[0].id_user, res.rows[0].pseudo_user, res.rows[0].password_user, res.rows[0].email_user, res.rows[0].is_admin_user, res.rows[0].date_inscription_user);
                    callback.success(user);
                }
            })
        });
    };



    /**
     * @desc callback succeed(rows) if an user with email exist
     * @param {int} id
     * @param {Function} callback
     */
    module.getById = function (id, callback) {
        console.log('______getById______');
        pool.connect(function (err, client, done) {
            if (err) throw err;

            var query = {
                name: 'fetch-by-id',
                text: 'SELECT * FROM public.user WHERE id_user = $1',
                values: [id]
            };

            client.query(query, (err, res) => {
                done();

                if (err) {
                    console.log(err.stack);
                    callback.fail(err);
                } else if (res.rowCount == 0) {
                    console.log('fail');
                    callback.fail(null);
                } else {
                    console.log('success');
                    var user = new User(res.rows[0].id_user, res.rows[0].pseudo_user, res.rows[0].password_user, res.rows[0].email_user, res.rows[0].is_admin_user, res.rows[0].date_inscription_user);
                    callback.success(user);
                }
            })
        });
    };

    return module;
};
