/* 
* Node js validation - check these links for details
* https://express-validator.github.io/docs/check-api.html
* https://github.com/validatorjs/validator.js#validators
*/

const { body } = require("express-validator");

exports.validate = async()=> {
	
		// Course title sanitization and validation
	if (body('course_title').notEmpty().trim().escape())
		console.log ('Course title is required')
	
	else if (body('course_title').matches(/^[a-zA-Z ]*$/))
		console.log ('Course title: Only Characters with white space are allowed')

		// Course code sanitization and validation
	else if(body('course_code').trim().escape().notEmpty())
		console.log ('Course code is required')
	
	else if (body('course_code').isLength({min: 4}))
		console.log ('Course code must be a minimum of 4 alphnumeric length')
	
	else if (body('course_code').matches(/^[a-zA-Z0-9]*$/))
		console.log ('Course code must be alphnumeric')	
}
/*
		// Course description sanitization and validation
		body('course_desc')
			.trim()
			.escape()
			.notEmpty()
			.withMessage('Course description is required'),

		// Course category sanitization and validation
		body('course_cat')
			.trim()
			.escape()
			.notEmpty().withMessage('Course category is required')
			.matches(/^[a-zA-Z ]*$/)
			.withMessage('Course Category: Only Characters with white space are allowed'),

		// Certificate type sanitization and validation
		body('certificate')
			.trim()
			.escape()
			.notEmpty().withMessage('Certificate type is required')
			.matches(/^[a-zA-Z ]*$/)
			.withMessage('Certificate type: Only Characters with white space are allowed'),

		// Course duration validation
		body('course_dur')
			.notEmpty().withMessage('Course duration is required')
			.matches(/^[0-9]*$/)
			.withMessage('Course duration: Only numbers are allowed'),

		// Course cost validation
		body('course_cost')
			.notEmpty().withMessage('Course cost is required')
			.isNumeric()
			.withMessage('course_cost: Only decimal values are allowed'),
	];
}
*/