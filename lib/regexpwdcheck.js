'use strict';
module.exports = function (pwd) {

var regexObj = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$&+,:;=?@#|'<>.^*()%!-]).{6,20})/;
return regexObj.test(pwd);

};
