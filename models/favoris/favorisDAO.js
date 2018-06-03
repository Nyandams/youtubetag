module.exports = function (pool) {
    var module = {};

    /**
     * @desc create a favoris in the DB
     * @param {Favoris} fav
     * @param {Function} callback
     */
    module.addFavoris = function (fav, callback) {
        console.log('______add_favoris______');
        pool.connect(function (err, client, done) {
            if (err) throw err;

            var query = {
                name: 'create-favoris',
                text: 'INSERT INTO public.favoris (id_user, id_channel) VALUES ($1, $2) RETURNING *',
                values: [fav.id_user, fav.id_channel]
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
                    callback.success(fav);
                }
            })
        });
    };


    /**
     * @desc get all the favoris where the id_user is id_user
     * @param {integer} id_user
     * @param {Function} callback
     */
    module.getByUser  = function (id_user, callback) {
        console.log('______getFavoritesByUser______');
        pool.connect(function (err, client, done) {
            if (err) throw err;

            var query = {
                name: 'fetch-favorites-user',
                text: 'SELECT * FROM public.favoris WHERE id_user=$1',
                values: [id_user]
            };
            client.query(query, (err, res) => {
                done();
                if (err) {
                    console.log(err.stack);
                    callback.fail(err);
                } else {
                    console.log('success getFavoritesByUser');
                    console.log(res.rows);
                    callback.success(res.rows);
                }
            })
        });
    };


    /**
     * @desc delete a favorite
     * @param {integer} id_user
     * @param {String} channelId
     * @param {Function} callback
     */
    module.delete = function (id_user, channelId, callback) {
        console.log('______delete_favorite_____');
        pool.connect(function (err, client, done) {
            if (err) throw err;
            var query = {
                name: 'delete-favorite',
                text: 'DELETE FROM public.favoris WHERE id_user=$1 AND id_channel=$2',
                values: [id_user, channelId]
            };
            client.query(query, (err, res) => {
                done();

                if (err) {
                    console.log(err.stack);
                    callback.fail(err);
                } else {
                    console.log('success');
                    callback.success(res);
                }
            })
        });
    };


    return module;
};