const db = require("../config/db");
const dbConn = require("../config/sql")

exports.articleDisplay = (req, res) => {
    return res.render('article/article', {
        user: {
            userID: req.session.userID,
            isWriter: true,
        }
    });
}

exports.toBeValid = (req, res) => {
    let query = "SELECT * FROM submittions ORDER BY SubID DESC;";
    dbConn.query(query, async function (error, row) {
        if (error)
            throw error;
        else {
            console.log(row);
            res.render('article/tobevalid', {
                data: row,
                user: {
                    userID: 5,
                    isWriter: true,
                }
            });
        }
    });
}

exports.detailDisplay = (req, res) => {
    console.log(req.params.id)

    let query = "SELECT * FROM submittions WHERE SubID = ? ;";
    dbConn.query(query, req.params.id , async function (error, result) {
        if (error)
            throw error;
        else {
            console.log("query result in details display", result);
            return res.render('article/detail', {
                title: result[0].Article_title,
                content: result[0].Article_content,
                author: result[0].author,
            });
        }


    })
}

exports.detailSubmit = (req, res) => {
    return res.render('article/detail', {
        title: "Some Article",
        content: "Some COtnent",
        author: "Nahom"
    });
}

exports.articleAdd = (req, res) => {

    const { body } = req;

    const title = body.Article_title;
    const content = body.Article_content;
    const catag = body.Category;
    const author = body.username;
    const uid = 2;

    console.log(body);
    if ((title || content) && body.anonymous != "on") {
        let query = `INSERT INTO submittions (Article_title, Article_content, Category, Author, UserId) VALUES('${title}', '${content}', 
            '${catag}', '${author}', '${uid}')`;
        dbConn.query(query, async function (error, row) {
            if (error)
                throw error;
            else {
                res.send("Successfully sent");
            }
        });

    } else if ((title || content) && body.anonymous) {
        query = `INSERT INTO submittions (Article_title, Article_content, Category, Author, UserId) VALUES('${title}', '${content}', 
            '${catag}', 'Anonymous', 2)`;

        dbConn.query(query, async function (error, row) {
            if (error)
                throw error;
            else {
                res.send("Successfully sent");
            }
        });
    } else {

        res.send("Invalid Form");
    }

};