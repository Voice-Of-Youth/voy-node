
const dbConn = require("../config/db_Connection")
const validator = require('../lib/validation_rules1');
const { validationResult } = require("express-validator");

const UploadFile = require('../lib/image_upload');

// Record Display Page
exports.recordDisplayPage = (req, res, next) => {

	var query1 = 'SELECT * FROM `courses`';
	dbConn.query(query1, (error, result)=>{
	
		if(error)
		{
			console.log(e);
			throw error;
		}

		const msg = req.flash ('success')
		res.render('pages/display', {data:result, msg});
	});	
}

// Record Add Page
exports.addRecordPage = (req, res, next) => {
    res.render("pages/add");
};

// Adding New Record
exports.addRecord = async(req, res, next) => {
	 
    //const { body } = req;
	
/*	const errors = validationResult(req);
	console.log(errors);
	
	if (!errors.isEmpty()) {
		return res.render('pages/add', {error: errors.array()[0].msg});
	}*/
	
	/* Checking if course icon (image) upload success */
	const upload = UploadFile.single('course_img')
	upload(req, res, function(err) {	
		var val = validator.validate()
		if (req.file == undefined) {
			return res.render("pages/add", {
								error: "Error: You must select an image."});
		}		
        if(err) {
			return res.render("pages/add", {error: req.flash('error')});
        }
        return res.render("pages/add", {msg: "File is uploaded"});
    });
	
	/*
	const uploadFiles = async (req, res) => {
	  try {
			console.log(req.file);
			if (req.file == undefined) {
			return res.send(`You must select a file.`);
		}

		const today = new Date();
		const today_date = today.getFullYear() + '-' + ("0" + today.getMonth()+1).slice(-2) +'-'+ ("0" + today.getDate()).slice(-2);
		var imgsrc = 'http://127.0.0.1:3000/images/' + req.file.fieldname + '-' + today_date + path.extname(req.file.originalname)
		console.log (imgsrc);
		 return res.send(`File has been uploaded.`);
	  } 
	  catch (error) {
		console.log(error);
		return res.send(`Error when trying upload images: ${error}`);
	  }
	}
	*/
    try {
		/* code = body.course_code
		 title = body.course_title
		 desc = body.course_desc
		 cat = body.course_cat
		 cert = body.certificate
		 duration = body.course_dur
		 cost = body.course_cost		 

	/*	 
		var query3 = "INSERT INTO `courses` (`code`, `title`, `description`, `category`, `certificate`, `duration`, `cost`, `image-path`) VALUES(?,?,?,?,?,?,?,?)";
		dbConn.query(query3, [code, title, desc, cat, cert, duration, cost, '0'], 
					(error, rows)=>{
						if(error)
						{
							console.log (error);
							throw error;
						}
						
						if (rows.affectedRows !== 1) {
							return res.render('pages/add', 
												{error: 'Error: Record not added.'});
						}

						res.render("pages/add", {
								msg: 'Record successfully added!'});
				    });*/
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
		//res.send ({data: result[0]});
		res.render('pages/edit', {data: result[0]});
	});
}

/* Record Editing Page */
exports.editRecord = (request, response, next) =>{

		code = body.course_code
		title = body.course_title
		desc = body.course_desc
		cat = body.course_cat
		cert = body.certificate
		duration = body.course_dur
		cost = body.course_cost
		img = body.course_img
		 
		var query = `UPDATE courses SET 
						fname = "${first_name}", 
						lname = "${last_name}",  
						gender = "${gender}" 
						WHERE id = "${id}"`;

		database.query(query, function(error, data){

			if(error)
			{
				throw error;
			}
			else
			{
				request.flash('success', 'Sample Data Updated');
				response.redirect('/sample_data');
			}

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