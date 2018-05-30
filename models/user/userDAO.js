const User = require('./user.js');

module.exports = function (pg, url) {
  var module = {};

  const pool = new pg.Pool({
    connectionString: url,
    ssl: true
  });


  //create an user
  module.create = function (user, callback) {
    console.log('______create_user______');
    pool.connect(function (err, client, done) {
      var query = {
        name: 'create-user',
        text: 'INSERT INTO public.user (pseudo_user, password_user, email_user, is_admin_user) VALUES ($1, $2, $3, $4) RETURNING *',
        values: [user.pseudo_user, user.password_user, user.email_user, false]
      };

        pool.query(query, (err, res) => {
          done();
          client.end().then(()=>console.log('disconnected'))
              .catch();

          if (err) {
          console.log(err.stack);
          callback.fail(err);
        } else if(res.rowCount == 0) {
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

  //callback succeed(rows) if an user with pseudo or email exist
  module.getByEmailPseudo = function (pseudo, email, callback) {
    console.log('______getByEmailPseudo______');
    pool.connect(function (err, client, done) {
      var query = {
        name: 'fetch-by-pseudo-email',
        text: 'SELECT * FROM public.user WHERE pseudo_user = $1 OR  email_user = $2',
        values: [pseudo, email]
      };

        pool.query(query, (err, res) => {
          done();
          client.end().then(()=>console.log('disconnected'))
              .catch();

          if (err) {
          console.log(err.stack);
          callback.fail(err);
        } else if(res.rowCount == 0) {
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

  //callback succeed(rows) if an user with email exist
  module.getByPseudo = function (pseudo, callback) {
    console.log('______getByEmail______');
    pool.connect(function (err, client, done) {
      var query = {
        name: 'fetch-by-pseudo',
        text: 'SELECT * FROM public.user WHERE pseudo_user = $1',
        values: [pseudo]
      };

        pool.query(query, (err, res) => {
          done();
          client.end().then(()=>console.log('disconnected'))
              .catch();

          if (err) {

          console.log(err.stack);
          callback.fail(err);
        } else if(res.rowCount == 0) {
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


    //callback succeed(rows) if an user with email exist
    module.getByEmail = function (email, callback) {
        console.log('______getByEmail______');
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error('Error acquiring client', err.stack)
            }

            var query = {
                name: 'fetch-by-email',
                text: 'SELECT * FROM public.user WHERE email_user = $1',
                values: [email]
            };


            pool.query(query, (err, res) => {
                done();
                client.end().then(()=>console.log('disconnected'))
                    .catch();

                if (err) {
                    console.log(err.stack);
                    callback.fail(err);
                } else if(res.rowCount == 0) {
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


    //callback succeed(rows) if an user with email exist
    module.getById = function (id, callback) {
        console.log('______getById______');
        pool.connect(function (err, client, done) {
            var query = {
                name: 'fetch-by-id',
                text: 'SELECT * FROM public.user WHERE id_user = $1',
                values: [id]
            };

            pool.query(query, (err, res) => {
                done();
                client.end().then(()=>console.log('disconnected'))
                    .catch();

                if (err) {
                    console.log(err.stack);
                    callback.fail(err);
                } else if(res.rowCount == 0) {
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
