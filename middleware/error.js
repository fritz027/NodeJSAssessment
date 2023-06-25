const ErrorResponse = require('../utils/errorResponse')
const errorHandler = (err, req, res, next) => {
    //Log error to console on dev
    let error = {...err}
    error.message = err.message

    //Mongoose Duplicate Key
    if (err.code === 11000) {
        const message = `${err.KeyValue.ID} is already exist`
        error = new ErrorResponse(message, 400)
    }

    //Mongoose Validation Error
    if (err.name === 'ValidationError'){
        const message = Object.values(err.errors).map( err => err.message )
        error  = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        error: error.message || 'Server Error'
    })
}

module.exports = errorHandler