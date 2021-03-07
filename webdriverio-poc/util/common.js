//ts-check
const { default: AllureReporter } = require('@wdio/allure-reporter')
const { assert } = require('chai');
const path = require('path');
const fs = require('fs');
const { exception } = require('console');
const moment = require('moment');



let parentGUID;
let childWindowID;

class common {

    doClick(element) {
        element.waitForDisplayed()
        element.click()
    }

    doSetValue(element, value) {
        element.waitForDisplayed()
        element.setValue(value)
    }

    doGetText(element) {
        element.waitForDisplayed()
        return element.getText()
    }

    doIsDisplayed(element) {
        element.waitForDisplayed()
        return element.isDisplayed()
    }
    doGetPageTitle(pageTitle) {
        browser.waitUntil(function () {
            return (browser.getTitle() === pageTitle)
        }, 10000, 'title not displayed after the given time'
        )
        return browser.getTitle()
    }


    openUrl(url) {
        AllureReporter.addStep("Navigate to Url " + url)
        browser.url(url)
    }

    checkIfElementPresent(element, description) {
        AllureReporter.addStep("check if " + description + " is displayed")
        try {
            wdioExpect(element).toBeDisplayed()
        }
        catch (err) {
            AllureReporter.addStep("Error while checking if " + description + " is displayed... Error is " + err, "", "failed")
        }
    }

    checkElementPresent(element) {
        try {
            wdioExpect(element).toBeDisplayed()
            return true
        }
        catch (error) {
            return false
        }
    }

    click(element, descrition) {
        AllureReporter.addStep("Click on Element " + descrition)
        element.waitForDisplayed({ timeout: 10000 });
        element.click()
    }

    clickwithoutscoll(element, descrition) {
        AllureReporter.addStep("Click on Element --" + descrition)
        element.waitForDisplayed({ timeout: 10000 });
        element.click()
    }

    type(element, value, descrition) {
        AllureReporter.addStep("enter value -- " + value + " in --" + descrition)
        try {
            element.waitForDisplayed({ timeout: 10000 });
            element.setValue(value)
        } catch (error) {
            AllureReporter.addStep("Getting error " + error + " on entering--" + value + descrition, "", "failed")
            throw error
        }
    }

    opennewTab(url, pagename, size) {
        AllureReporter.addStep("Open " + url + " a new tab")
        parentGUID = browser.getWindowHandle();
        browser.newWindow(url, pagename, size)
        var allGUID = browser.getWindowHandles();
        for (var i = 0; i < allGUID.length; i++) {
            // one enter into if block if the GUID is not equal to parent window's GUID
            var guid = allGUID[i]
            if (guid != parentGUID) {
                browser.switchToWindow(guid)
                childWindowID = guid
            }
        }

    }

    closeWindow() {
        AllureReporter.addStep("Close Window")
        browser.closeWindow()
    }

    switchtoParentWindow() {
        AllureReporter.addStep("Switch to Parent Window")
        browser.switchToWindow(parentGUID)
    }

    gettext(element, description) {
        try {
            AllureReporter.addStep("Get text " + description)
            element.waitForDisplayed({ timeout: 10000 });
            var text = element.getText()
            AllureReporter.addStep("found text as  " + text)
            return text
        } catch (error) {
            AllureReporter.addStep("unable to get text --error occurred as " + error, "", "failed")
            return null
        }
    }

    
    selectByIndex(element, index, description) {
        AllureReporter.addStep("Select " + description + " by index" + index)
        try {
            element.selectByIndex(index)
        } catch (error) {
            AllureReporter.addStep("Error " + error + " on Select " + description + " by index" + index, "", "failed")
        }
    }

    selectByValue(element, value, description) {
        AllureReporter.addStep("Select " + value + " for" + description)
        try {
            element.selectByVisibleText(value)
        }
        catch (err) {
            AllureReporter.addStep(("Error on Selecting  " + value + " for" + description + "- error is " + err))
        }
    }

    getElementAttrubute(element, attribute, description) {
        AllureReporter.addStep("Get " + attribute + " for" + description)
        try {
            return element.getAttribute(attribute)
        }
        catch (err) {
            AllureReporter.addStep("Error on Selecting  " + attribute + " for" + description + "- error is " + err, "", "failed")
            return null
        }
    }

    generaterandomString(length) {
        var result = '';
        var characters = 'xyzabcdefghijklmnopqrstuvABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    compareText(actual, expected, description) {
        if (actual.trim() == expected.trim()) {
            AllureReporter.addStep(description + " - Actual and Expected Values are same as " + actual)
            return true

        } else {
            // const outputdir = this.takeScreenShot()
            AllureReporter.addStep(description + " - Actual and Expected Values are not same. Actual value is " + actual + " and expected value is " + expected, "", "failed")

            return false
        }
    }

    scrollElement(element, description) {
        AllureReporter.addStep("scroll element " + description)
        try {
            element.scrollIntoView()
        } catch (error) {
            AllureReporter.addStep("Error while scrolling the element as " + error, "", "failed")
        }
    }

    waitForNotVisible(element, description) {
        AllureReporter.addStep("Wait untill " + description + " to disappear ")
        let i = 0
        try {
            while (element.isDisplayed() && i <= 24) {
                AllureReporter.addStep(description + " is visible")
                browser.pause(2000)
                i++
            }
        }
        catch (error) {
            AllureReporter.addStep(description + " is not visible now")
            return true
        }
        return false
    }

    switchToFrame(element) {
        AllureReporter.addStep("Switch to Frame")
        browser.switchToFrame(element)
    }

    switchToParentFrame() {
        AllureReporter.addStep("Exit from frame")
        browser.switchToParentFrame()
    }

    clearText(element, decription) {
        AllureReporter.addStep("clear text for " + decription)
        try {
            element.clearValue()
        } catch (error) {
            AllureReporter.addStep("Error while clear text..Error thrown as " + error, "", "failed")
        }
    }

    waitForFileExists(filePath, timeout) {
        return new Promise(function (resolve, reject) {

            var timer = setTimeout(function () {
                watcher.close();
                reject(new Error('File did not exists and was not created during the timeout.'));
            }, timeout);

            fs.access(filePath, fs.constants.R_OK, function (err) {
                if (!err) {
                    clearTimeout(timer);
                    watcher.close();
                    resolve();
                }
            });

            var dir = path.dirname(filePath);
            var basename = path.basename(filePath);
            var watcher = fs.watch(dir, function (eventType, filename) {
                if (eventType === 'rename' && filename === basename) {
                    clearTimeout(timer);
                    watcher.close();
                    resolve();
                }
            });
        });
    }

    takeScreenShot(errorText) {
        browser.takeScreenshot();

        // // AllureReporter.addStep
        // const filename = "screnshot.png";
        // const outputFile = path.join(__dirname, filename);
        // browser.saveScreenshot(outputFile);
        // return outputFile
        // AllureReporter.addAttachment(filename, fs.readFileSync(outputFile))
        //reporter.sendFile(LEVEL.ERROR, filename, fs.readFileSync(outputFile));
    }

    waitforElementToDisplay(element, waittimeout) {
        element.waitForDisplayed({ timeout: waittimeout });
    }

   

    takebrowserScreenshot() {
        browser.takeScreenshot();
    }

    containsText(actualText, expectedText, actdescription, expdescription) {
        if (actualText.includes(expectedText)) {
            AllureReporter.addStep(expdescription + "-" + expectedText + " present in " + actdescription)
            return true
        } else {
            AllureReporter.addStep(expdescription + "-" + expectedText + " is not present in " + actdescription, "", "failed")
            return false
        }
    }

}







module.exports = new common();