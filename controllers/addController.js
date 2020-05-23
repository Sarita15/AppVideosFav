const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM addvideo ORDER BY date DESC', (err, videos) => {
            conn.query('SELECT Category FROM addvideo group by category', (err2, categories) => {
                conn.query("select Description from addvideo ORDER BY date DESC", (err3, link) => {
                    if (err3) {
                        res.json(err3);
                    }
                    res.render('index.ejs', {
                        opcionesList: categories, 
                        data: videos,
                        link: link
                    });
                });
            });
        });
    });
};

controller.listbycategory = (req, res) => {
    const { category } = req.params; 
    console.log(`Se envió : ${category}`);
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM addvideo WHERE Category = ? ORDER BY date DESC', category, (err, videos) => {
            conn.query('SELECT Category FROM video group by category', (err2, categories) => {
                conn.query("select Description from addvideo WHERE Category = ? ORDER BY date DESC", category, (err3, link) => {

                    if (err) {
                        res.json(err);
                    }
                    res.render('index.ejs', {
                        opcionesList: categories, 
                        data: videos,
                        link: link
                    });
                });

            });
        });
    });
};



controller.listcategories = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT DISTINCT Category FROM addvideo order by category', (err, categories) => {
            if (err) {
                res.json(err);
            }
            res.render('index.ejs', {
                data: categories
            });
        });
    });
};
controller.save = (req, res) => {
    const data = req.body;
    console.log(req.body)
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO addvideo set ?', data, (err, video) => {
            console.log(video)
            conn.query("select description from addvideo order by id desc limit 1", (err2, link) => { 
                console.log(link.value);
                if (err2) {
                    res.json(err2);
                }
                res.render('add', {
                    link: link 
                });
            });
        })
    })
};
controller.edit = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query("SELECT * FROM addvideo WHERE id = ?", [id], (err, rows) => {
            res.render('editar', {
                data: rows[0]
            })
        });
    });
};
controller.update = (req, res) => {
    const { id } = req.params;
    const newVideo = req.body;
    req.getConnection((err, conn) => {

        conn.query('UPDATE addvideo set ?  WHERE id = ?', [newVideo, id], (err, rows) => {
            res.redirect('/');
        });
    });
};

controller.delete = (req, res) => {
        const { id } = req.params;
        req.getConnection((err, connection) => {
            connection.query('DELETE FROM addvideo WHERE id = ?', [id], (err, rows) => {
                res.redirect('/');
            });
        });
    }
    
module.exports = controller;