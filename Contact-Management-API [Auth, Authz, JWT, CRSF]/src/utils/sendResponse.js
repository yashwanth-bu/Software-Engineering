function sendResponse(res, status, { message = null, data = null }){
    res.status(status).json({
        success: status < 400,
        message,
        data
    });
};

export default sendResponse;