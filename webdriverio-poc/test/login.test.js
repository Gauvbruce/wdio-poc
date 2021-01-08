//@ts-check
const { loginBtn } = require('../pages/login.page')

const loginPage = require('../pages/login.page')
const { assert } = require('chai')

const configData = require('../config')

const constants = require('../constants')

describe('login page feature test', function(){

it('verify login page title', function(){

    browser.url('/')
    browser.maximizeWindow()
    const title = loginPage.getPageTitle()
    console.log('login page title is ', title)
    assert.equal(constants.LOGIN_PAGE_TITLE, title, 'title not found')
})

it('verify sign up link exists', function(){

assert.equal(true, loginPage.isSignUpLinkExists(),'link not exists')

})

it('verify login', function(){
loginPage.doLogin(configData.username,configData.password)

})

})