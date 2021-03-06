module.exports = function (pool) {
    var module = {};
    var Tag = require('./tag');


    /**
     * @desc get all the tags in the database
     * @param {Function} callback
     */
    module.getAll = function (callback) {
        console.log('______get_all_tag______');
        pool.connect(function (err, client, done) {
            if (err) throw err;
            var query = {
                name: 'fetch-all-tag',
                text: 'SELECT * FROM public.tag'
            };
            client.query(query, (err, res) => {
                done();
                if (err) {
                    console.log(err.stack);
                    callback.fail(err);
                } else {
                    console.log('success');
                    callback.success(res.rows);
                }
            })
        });
    };



    /**
     * @desc create a tag
     * @param {Tag} tag
     * @param {Function} callback
     */
    module.create = function (tag, callback) {
        console.log('______create_tag______');
        pool.connect(function (err, client, done) {
            if (err) throw err;

            var query = {
                name: 'create-tag',
                text: 'INSERT INTO public.tag (libelle_tag) VALUES ($1) RETURNING *',
                values: [tag.libelle_tag]
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
                    tag.id_tag = res.rows[0].id_tag;
                    callback.success(tag);
                }
            })
        });
    };


    //
    /**
     * @desc callback succeed(rows) if the tag with id_tag exists
     * @param {integer} id_tag
     * @param {Function} callback
     */
    module.getById = function (id_tag, callback) {
        console.log('______getById_tag______');
        pool.connect(function (err, client, done) {
            if (err) throw err;
            var query = {
                name: 'fetch-by-id-tag',
                text: 'SELECT * FROM public.tag WHERE id_tag = $1',
                values: [id_tag]
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
                    console.log('success getById_tag');
                    var tag = new Tag(res.rows[0].id_tag, res.rows[0].libelle_tag);
                    console.log(tag);
                    callback.success(tag);
                }
            })
        });
    };


    /**
     * @desc update of a tag
     * @param {Tag} tag
     * @param {Function} callback
     */
    module.update = function (tag, callback) {
        console.log('______update_tag______');
        pool.connect(function (err, client, done) {
            if (err) throw err;

            var query = {
                name: 'update-tag',
                text: 'UPDATE public.tag SET libelle_tag=$1 WHERE id_tag=$2 RETURNING *',
                values: [tag.libelle_tag, tag.id_tag]
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
                    var tag = new Tag(res.rows[0].id_tag, res.rows[0].libelle_tag);
                    callback.success(tag);
                }
            })
        });
    };




    /**
     * @desc delete a tag
     * @param {integer} id
     * @param {Function} callback
     */
    module.delete = function (id, callback) {

        console.log('______delete_tag______');
        pool.connect(function (err, client, done) {
            if (err) throw err;

            var query = {
                name: 'delete-tag',
                text: 'DELETE FROM public.tag WHERE id_tag=$1',
                values: [id]
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