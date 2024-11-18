// Fichier util.js ou utils/responseFormatter.js
function Response(successful = false, message = null, data = null, error = null) {
    const type = data && data.constructor && data.constructor.modelName
        ? data.constructor.modelName
        : Array.isArray(data) && data.length > 0 && data[0].constructor.modelName
            ? data[0].constructor.modelName+"s"
            : "Response";

    if(successful === true){
        return {
            message,
            timestamp: new Date().toLocaleString(undefined, { timeZoneName: 'short' }),
            count: Array.isArray(data) ? data.length : 1 ,
            type,
            data,
        };
    }else {
        return {
            message : message == null ? error.message : message,
            timestamp: new Date().toLocaleString(undefined, { timeZoneName: 'short' }),
            error
        };
    }


}

module.exports = Response;
