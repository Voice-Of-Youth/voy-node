
var randtoken = require('rand-token');
var nodemailer = require('nodemailer');

const { validationResult } = require("express-validator");
const encrypt = require('../lib/hashing');
const { sendingMail } = require('../lib/sendEmail');

const dbConn = require("../config/db_Connection");

const articlesArray = [
    {
        count: 4,
        id: "art1",
        writer: "Nahom Temam",
        href: "article/1",
        title: "How to stay confident",
        date: "Jan 15, 2022",
        description: "How to build self confidence and stand up for ourselves ",
        blogImage: "/images/Self_confidence.jpg",
        tags: [],
        content: {
        }
    },
    {
        count: 9,
        id: "art2",
        writer: "Nathnael Shimelis",
        href: "article/2",
        title: "Culture and it's challenges",
        date: "Feb 2, 2022",
        description: "How culture affects sexual education.",
        blogImage: "/images/culture.jpg",
        tags: [],
        content: {
        }
    },
    {
        count: 7,
        id: "art3",
        writer: "Nathnael Menelik",
        href: "article/1",
        title: "Sexual assault and it's causes",
        date: "Dec 26, 2021",
        description: "What are the main causes of sexual assault and what causes them?",
        blogImage: "/images/Sexual_assault.jpg",
        tags: [],
        content: {
        }
    },
    {
        count: 10,
        id: "art4",
        writer: "Mahlet Assbu",
        href: "article/2",
        title: "Adolescence",
        date: "Dec 26, 2021",
        description: "The many changes that appear because of adolescence",
        blogImage: "/images/Adolescence.jpg",
        tags: [],
        content: {
        }
    },
    {
        count: 10,
        id: "art5",
        writer: "Mahlet Tizazu",
        href: "article/1",
        title: "How to prevent sexual assault",
        date: "Dec 26, 2021",
        description: "The different ways to prevent sexual assault",
        blogImage: "/images/Sexual_assault_prevent.jpg",
        tags: [],
        content: {
        }
    }
]

// Home Page
exports.homePage = (req, res, next) => {

	// console.dir(req.headers.cookie)

	// req.session.userID = req.headers.cookie.userID;
	// req.session.email = req.headers.cookie.email;
	// req.session.imagePath = req.headers.cookie.imagePath;

	var query1;
	if (req.method == 'GET') {
		query1 = `SELECT * FROM blog`;
	} 
	// else if (req.method == 'POST') {
	// 	const { body } = req;
	// 	//fulltext search 
		
	// 	query1 = `SELECT * FROM blog WHERE MATCH (blogName, Content)` +
	// 				` AGAINST ("${body.search_Key}" IN NATURAL LANGUAGE MODE)`;
		
		//Alternative: search multiple columns with "concat & like" operators 
		/*
		* `SELECT * FROM courses WHERE concat (code, title, description)` +
		*		` like "%${body.search_Key}%"`;		
		*/
	// }

    dbConn.query(query1, async (error, result)=>{
		
		if(error){
			console.error (error);
			throw error;
		}

		res.render('home', {title:'Homepage', articles: articlesArray, dbQueryResult: result, session: req.session});
	});
}

// Search result

exports.searchResult = (req, res) => {
	var query1;
	const { body } = req;

	if (req.method == 'POST') {
		
		if (typeof body.search === 'undefined') {
			if (!body.search) {
				query1 = 'SELECT * FROM `blog`';
				req.flash('success', "Please provide a article keyword!")
			} else {
				query1 = `SELECT * FROM blog WHERE `
					+ `concat (blogName, Content)`
					+ ` like "%${body.search}%"`;

				if (body.sortBy != "") {
					var sort = "ORDER BY " + body.sortBy;
				}
				query1 = `SELECT b.blogName,b.Content,b.createdAt, u.UserName FROM blog b INNER JOIN user u ON u.UserID = b.UserID WHERE (b.blogName lIKE '%${body.search}%' OR b.Content lIKE '%${body.search}%') ${sort}`;

				if (body.filter_key !== "undefined") {
					query1 = `SELECT*FROM blog WHERE (blogName lIKE '%${body.search}%' OR Content lIKE '%${body.search}%') AND UserID like "%${ body.filter_key } %"`;
				}
			}
		}
	}

	// app.get('/', (req, res) => {
	// 	let sql = "SELECT *FROM blog";
	// 	db.query(sql, (err, result) => {
	// 		if (err) throw err;
	// 		res.render('display', { data: result });
	// 	});
	// });
	
	let resultperpage = 10;
	dbConn.query(query1, (error, result) => {

		if (error) throw error;
		
		const msg = req.flash('success')
		const numOfResults = result.length;
		const numberOfPages = Math.ceil(numOfResults / resultperpage);
		const page = req.query.page ? Number(req.query.page) : 1;
		
		if (page > numberOfPages) {
			res.redirect('/?page=' + encodeURIComponenet(numberOfPages));
		} else if (page < 1) {
			res.redirect('/?page=' + encodeURIComponent('1'));
		}

		//Determine the SQL Limit starting number
		const startingLimit = (page - 1) * resultperpage;
		//Get the relevant number of POSTS for this starting page
		
		query1 = `SELECT * FROM blog WHERE `
			+ `concat (blogName, Content)`
			+ ` like "%${body.search}%" LIMIT ${startingLimit},${resultperpage}`;

		dbConn.query(query1, (error, result) => {
			if (error) throw error;
			let iterator = (page - 5) < 1 ? 1 : page - 5;
			let endinglink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
			if (endinglink < (page + 4)) {
				iterator -= (page + 4) - numberOfPages;
			}
			res.render('pages/display', { data: result, page, iterator, endinglink, numberOfPages, msg: msg, title: 'Display Search Records', session: req.session});
		});

	});
}

// Register Page
exports.registerPage = (req, res) => {
    res.render("auth/register");
};

// User Registration
exports.register = async (req, res, next) => {
    const errors = validationResult(req);
    const { body } = req;

    if (!errors.isEmpty()) {
        return res.render('auth/register', {error: errors.array()[0].msg});
    }

    try {
		var query2 = "SELECT * FROM `user` WHERE `email`=?";
        dbConn.query(query2, [body.email], async(error, row)=>{
			if (error)
			{
				console.error(error)
				throw error
			}
			
			if (row.length == 1) {
				return res.render('auth/register', {error: 'This email already in use.'});
			}

			//const hashPass = await bcrypt.hash(body._password, 12);
			const hashPass = await encrypt.encryptPassword(body.password);

			var query3 = "INSERT INTO `user`(`FirstName`,`LastName`,`UserName`,`Email`,`Password`) VALUES(?,?,?,?,?)";
			const nameResult = body.fullname;
			const namedArray = nameResult.split(" ");
			dbConn.query(query3, [namedArray[0], namedArray[1], body.username, body.email, hashPass], 
						 (error, rows)=>{
							if(error) {
								console.log (error);
								throw error;
							}
							
							if (rows.affectedRows !== 1) {
								return res.render('auth/register', 
													{error: 'Your registration has failed.'});
							}

							const content = `<p>you have successfully registered to Voice of youth. have a great time</p>`;

							const subject = "Successful Registration to Voice of Youth"
							
							sendingMail(body.email, "", content, subject)
								.then((res) => res).catch(err => console.log(err));


							res.render("auth/register",
										{msg: 'You have successfully registered. You can Login now!'});
						 });		
		});
    } catch (e) {
        next(e);
    }
};

// Login Page
exports.loginPage = (req, res, next) => {
    res.render("auth/login");
};

// Login User
exports.login = (req, res, next) => {

    const errors = validationResult(req);
	const { body } = req;

    if (!errors.isEmpty()) {
        return res.render('auth/login', {error: errors.array()[0].msg
        });
    }

    try {
		var query4 = 'SELECT * FROM `user` WHERE `email`=?'
        dbConn.query(query4, [body.email], async function(error, row){

			if(error)
				// throw error; 
				console.error("error executing query", error)
			else
			{
				if (row.length != 1) {
					return res.render('auth/login', {
						error: 'Invalid email address or password.'
					});
				}
				
				// const checkPass = await bcrypt.compare(body.password, row[0].password);

				const checkPass = await encrypt.matchPassword(body.password, row[0].Password);

				if (checkPass === true) {
					req.session.userID = row[0].UserID;
					req.session.email = row[0].Email;
					req.session.imagePath = row[0].imagePath;

					if(body.Rememberme == "on") {
						res.cookie(`userID`,row[0].UserID);
						res.cookie(`email`, row[0].Email);
						res.cookie(`imagePath`, row[0].imagePath);
					}
					return res.redirect('/');
				}

				res.render('auth/login', {error: 'Invalid email address or password.'});
				
			}
		});
	}
    catch (e) {
        next(e);
    }
}

// Password reset link request Page
exports.forgotPassword = (req, res, next) => {
    res.render("auth/forgotpassword");
};

/* send reset password link in email */
exports.sendResetPassLink = (req, res, next) => {

		const { body } = req;
		const email = body.email;
		
		var query2 = `SELECT * FROM user WHERE email ="${email}"`;
		dbConn.query(query2, function(err, result) {
			if (err)
				throw err;
			
			if (result.length > 0) {
				const token = randtoken.generate(20);

				const content = `
									<p>You requested for reset password, kindly use this 
										<a href="http://localhost:5000/reset-password?token=${token}">
											link
										</a> to reset your password
									</p>
								`;

				const subject = "Email for resetting password"

				sendingMail(email, token, content, subject)
					.then((respose) => {
						console.log(respose)
						var data = {token: token}
						var query3 = `UPDATE user SET ? WHERE email ="${email}"`;
						dbConn.query(query3, data, function(err, result) {
							if(err) 
								throw err 
						})
							
						res.render('auth/forgotpassword', 
									{msg: 'The reset password link has been sent to your email address'});	
					})
					.catch(err=> {
						console.log(err)
						res.render('auth/forgotpassword', 
								{error: 'Something goes to wrong. Please try again'})
					});
			} else {
				console.log('2');			
				res.render('auth/forgotpassword', 
						{error: 'The Email is not registered with us'})				
			}		
		});
	}

// Password reset Page
exports.resetPasswordPage = (req, res, next) => {
    res.render("auth/reset_password", {token: req.query.token});
}

/* update password to database */
exports.resetPassword = (req, res, next) => {
	
	const errors = validationResult(req);
	const { body } = req;

    if (!errors.isEmpty()) {
        return res.render('auth/reset_password', 
						   {token: token, error: errors.array()[0].msg});
		}
	
	var token = body.token;
    var query5 = `SELECT * FROM user WHERE token ="${token}"`;
    dbConn.query(query5, async(err, result) =>{

		console.log("the result of the search query", result)
        if (err) 
			throw err;

        if (result.length > 0) {                  
            const hashPass = await encrypt.encryptPassword(body.password);
			console.log(body);


			var query5 = `UPDATE user SET password = ? WHERE email ="${result[0].Email}"`;
            dbConn.query(query5, hashPass, function(err, result) {
                if(err) 
					throw err
                });
				
				res.render("auth/reset_password", 
						{token: 0, msg: 'Your password has been updated successfully'});			            
        } 
		else { 
            console.log('2');
			res.render("auth/reset_password", 
						{token: token, error: 'Invalid link; please try again'});			
        } 
    });
}

