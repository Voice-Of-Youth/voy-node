
var randtoken = require('rand-token');
var nodemailer = require('nodemailer');

const { validationResult } = require("express-validator");
const encrypt = require('../lib/hashing');
const { sendingMail } = require('../lib/sendEmail');

const dbConn = require("../config/db_Connection");
const { clouddebugger } = require('googleapis/build/src/apis/clouddebugger');

const articlesArray = [
    {
        count: 4,
        id: "art1",
        writer: "Nahom Temam",
        href: "#",
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
        href: "#",
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
        href: "#",
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
        href: "#",
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
        href: "#",
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
	var query1;
	if (req.method == 'GET') {
		query1 = `SELECT * FROM blog`;
	} else if (req.method == 'POST') {
		const { body } = req;
		//fulltext search 
		
		query1 = `SELECT * FROM blog WHERE MATCH (blogName, Content)` +
					` AGAINST ("${body.search_Key}" IN NATURAL LANGUAGE MODE)`;
		
		//Alternative: search multiple columns with "concat & like" operators 
		/*
		* `SELECT * FROM courses WHERE concat (code, title, description)` +
		*		` like "%${body.search_Key}%"`;		
		*/
	}
    dbConn.query(query1, async (error, result)=>{
		
		if(error)
		{
			console.error (error);
			throw error;
		}
	res.render('home', {title:'Homepage', articles: articlesArray, dbQueryResult: result});
	});
}

// Register Page
exports.registerPage = (req, res, next) => {
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
					req.session.userID = row[0].id;
					req.session.email = row[0].email;
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
        if (err) 
			throw err;

        if (result.length > 0) {                  
            const hashPass = await encrypt.encryptPassword(body.password);
			var query5 = `UPDATE user SET password = ? WHERE email ="${result[0].email}"`;
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

