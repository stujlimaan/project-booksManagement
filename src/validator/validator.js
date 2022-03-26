
const isValid=function(value){
    if(typeof value == "undefined" || value=="null") return false
    if(typeof value == "string" && value.trim().length===0) return false
    return true
}

const isValidTitle = function(title) {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}

module.exports.isValid=isValid
module.exports.isValidTitle=isValidTitle