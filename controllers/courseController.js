
const fs = require('fs')
const path = require('path');
const { validationResult } = require("express-validator");

const dbConn = require("../config/db_Connection")
const validator = require('../lib/validation_rules');
const UploadFile = require('../lib/image_upload');

// Record Display Page
exports.recordDisplayPage = (req, res, next) => {
	
	var query1;
	if (req.method == 'GET')
		query1 = 'SELECT * FROM `courses`';

	if (req.method == 'POST')
	{
		const { body } = req;
		if (typeof body.searchBy === 'undefined')
		{
			if(!body.search_Key)
			{
				query1 = 'SELECT * FROM `courses`';
				req.flash ('success', "Please provide a search key!")
			}
			else{
				//search multiple columns with "concat & like" operators
				query1 = `SELECT * FROM courses WHERE `
							+ `concat (code, title, description, category, certificate)`
							+ ` like "%${body.search_Key}%"`;
				
				//fulltext search 
				/*
				* `SELECT * FROM courses WHERE MATCH (code, title, description)` +
				*		` AGAINST ("${body.search_Key}" IN NATURAL LANGUAGE MODE)`;
				*/
			}
		}
		else if (body.searchBy == "course_code")
			query1 = `SELECT * FROM courses WHERE code = "${body.search_Key}"`;
		
		else if (body.searchBy == "course_title")
			query1 = `SELECT * FROM courses WHERE title = "${body.search_Key}"`;
	}
	
	dbConn.query(query1, (error, result)=>{
	
		if(error)
			throw error;

		const msg = req.flash ('success')
		res.render('pages/display', {data:result, msg: msg, title:'Display Records'});
	});	
}

// Record Add Page
exports.addRecordPage = (req, res, next) => {
    res.render("pages/add", {title:'Add Record'});
};

// Adding New Record
exports.addRecord = async(req, res, next) => {
	 
	const errors = validationResult(req);
	const { body } = req;	
	
	if (!errors.isEmpty()) {
		return res.render('pages/add', {
										error: errors.array()[0].msg, 
										title:'Add Record'
									});
	}

    try {
		 code = body.course_code
		 title = body.course_title
		 desc = body.course_desc
		 cat = body.course_cat
		 cert = body.certificate
		 duration = body.course_dur
		 cost = body.course_cost		 
	 
		var query3 = "INSERT INTO `courses` (`code`, `title`, `description`, `category`, `certificate`, `duration`, `cost`, `imagePath`) VALUES(?,?,?,?,?,?,?,?)";
		dbConn.query(query3, [code, title, desc, cat, cert, duration, cost, 'None'], 
					(error, rows)=>{
						if(error)
						{
							console.log (error);
							throw error;
						}
						
						if (rows.affectedRows !== 1) {
							return res.render('pages/add', 
												{
													error: 'Error: Record not added.', 
													title:'Add Record'
												});
						}

						res.render("pages/add", 
									{
										msg: 'Record successfully added!',
										title:'Add Record'
									});
				    });
    } 
	catch (e) {
        next(e);
    }
};

// Record Editing Page
exports.recordEditPage = (req, res, next) => {

	var code = req.params.id;  //extract course code attached to the URL
	
	var query2 = `SELECT * FROM courses WHERE code = "${code}"`;
	dbConn.query(query2, function(error, result){
		if(error)
		{
			console.log(error);
			throw error;
		}
		message = req.flash('msg');
		res.render('pages/edit', {data: result[0], msg: message, title:'Edit Record'});
	});
}

/* Record Editing Page */
exports.editRecord = (req, res, next) =>{

	const errors = validationResult(req);
	const { body } = req;
	
	var id = req.params.id;
	
	code = body.course_code
	title = body.course_title
	description = body.course_desc
	category = body.course_cat
	certificate = body.certificate
	duration = body.course_dur
	cost = body.course_cost
	 
	var query = `UPDATE courses SET code = "${code}", title = "${title}", ` +
						`description = "${description}", category = "${category}", ` +
						`certificate = "${certificate}", duration = "${duration}", ` +
						`cost = "${cost}" WHERE code = "${id}"`;

		dbConn.query(query, function(error, data){
			if(error){
				throw error;
			}
			else
			{
				req.flash('success', 'Record successfully Updated');
				req.flash ('title', 'Edit Record')
				res.redirect('../display');
			}

	});
}

// Image uplaod Page
exports.imageUploadPage = (req, res, next) => {

	var code = req.params.id;  //extract course code attached to the URL
	
	var query2 = `SELECT * FROM courses WHERE code = "${code}"`;
	dbConn.query(query2, function(error, result){
		if(error)
		{
			console.log(error);
			throw error;
		}
		errorMsg = req.flash("error")
		message = req.flash("msg")
		res.render('pages/addImage',{
										data: result[0], 
										error: errorMsg, 
										msg: message,
										title : "Upload Image"
									});
	});
}

// Image uplaod middleware
exports.uploadImage = (req, res, next) => {

	var code = req.params.id;  //extract course code attached to the URL
	
	/* Checking if course icon (image) upload success */
	const upload = UploadFile.single('course_img')
	upload(req, res, function(err) {
		if (req.file == undefined || err) {
			req.flash("error", "Error: You must select an image.\r\n Only image files [JPG | JPEG | PNG] are allowed!")
			req.flash ("title", "Upload Image")
			return res.redirect("./"+code);
		}		

		//retrive and check if there is image uploaded already
		var query1 = `SELECT imagePath FROM courses WHERE code = "${code}"`;
		var oldImagePath = "";
		dbConn.query(query1, function(error, result){
			if(error)
			{
				throw error;
			}
			oldImagePath = result[0].imagePath;
		});
		
		var imgsrc = '/images/' + req.file.filename
		console.log(imgsrc)
		
		var query2 = `UPDATE courses SET imagePath = "${imgsrc}" WHERE code = "${code}"`;
		dbConn.query(query2, function(error, result){
			if(error)
			{
				//Image is path is not added to database. Remove Uplaoded file.
				// and send error to the client
				fs.unlinkSync('public' + imgsrc);
				console.log(error)
				return res.send(error);
			}
			
			//remove existing image
			else{
				if (oldImagePath && oldImagePath != "None" && oldImagePath != imgsrc)
					fs.unlinkSync('public' + oldImagePath);
			}
			req.flash("msg", "Image is uploaded. Go back to Home page & check it.")
			req.flash ("title", "Upload Image")
			return res.redirect("./"+code);
		});
	});
}

// Record deletion Page
exports.recordDeletePage = (req, res, next) => {
	
	var code = req.params.id; //Get course code to delete
	
	var query3 = `DELETE FROM courses WHERE code = "${code}"`;
	dbConn.query(query3, function(error){

		if(error)
		{
			console.log(error);
			throw error;
		}
		else
		{
			req.flash('success', 'Record has been deleted');
			res.redirect('../display');
		}

	});
}