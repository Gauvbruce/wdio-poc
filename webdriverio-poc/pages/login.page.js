//@ts-check
const elementUtil = require('../util/elementUtil')
const constants = require('../constants')

class LoginPage{

//page locators:
get username() {return $('#username') }
get password() {return $('#password') }
get loginBtn() {return $('#loginBtn') }
get signUpLink() {return $('=Sign up')}


//page actions:
getPageTitle() {
    elementUtil.doGetPageTitle(constants.LOGIN_PAGE_TITLE)
}

isSignUpLinkExists(){
    elementUtil.doIsDisplayed(this.signUpLink)
}

doLogin(email,pwd){
    elementUtil.doSetValue(this.username, email)
    elementUtil.doSetValue(this.password, pwd)
    elementUtil.doClick(this.loginBtn)
}


}

module.exports = new LoginPage()