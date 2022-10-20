const puppeteer = require('puppeteer');
(async () => {
  // Create a browser instance
  const browser = await puppeteer.launch();

  // Create a new page
  const page = await browser.newPage();

  // Set viewport width and height
  await page.setViewport({ width: 1280, height: 720 });
  const website_url = 'https://www.GuessThePin.com/';

  // Open URL in current page
  await page.goto('https://www.guessthepin.com/', { waitUntil: 'networkidle2' });

  // Enter digits into input field on webpage with name attribute of 'guess'
  let input = 0000 // First declare input int
  let inputStr = input.toString() // Convert int to string

  // toString will parse out 0s, so if input parsed to string less than 1000, 
  // add corresponding amount of 0s so that inputStr is 4 digits
  if (input < 10) {
    inputStr = "000" + inputStr
  }
  else if (input < 100) {
    inputStr = "00" + inputStr
  }
  else if (input < 1000) {
    inputStr = "0" + inputStr
  }

  await page.type('input[name=guess]', inputStr); // Enter digits

  // Automate clicking "Submit" or "Guess" button using input element with type of 'submit'
  await Promise.all([
    page.click('input[type="submit"]'),
    page.waitForNavigation(),
  ]);

  // Identify result element
  const resultLabel = await page.$("label[for='pin']")

  // Parse text from result element  
  const text = await (await resultLabel.getProperty('textContent')).jsonValue()   

  let result = text.includes("Sorry")
  console.log("Incorrect. Text is: " + text) // Print text to log

  if(result){
    while (result && (input <= 9999)) {
      // Increment test input
      input++
      inputStr = input.toString() // Convert int to string

      // Add 0s
      if (input < 10) {
        inputStr = "000" + inputStr
      }
      else if (input < 100) {
        inputStr = "00" + inputStr
      }
      else if (input < 1000) {
        inputStr = "0" + inputStr
      }
      
      // Input digits into input field on webpage, with name attribute of 'guess'
      await page.type('input[name=guess]', inputStr);

      // Automate clicking "Submit" or "Guess" button using input element with type of 'submit'
      await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForNavigation(),
      ]);

      // Identify result element
      let tempResultLabel = await page.$("label[for='pin']")

      // Parse text from result element  
      let tempText = await (await tempResultLabel.getProperty('textContent')).jsonValue()   

      result = tempText.includes("Sorry") // If result label includes "Sorry":
      console.log("Incorrect guess. Text is: " + tempText) // Print text to log

      // If result element does not include "Sorry"
      if(!result) {
        console.log("Success! The pin is: " + tempText)
        input = 10000
      } // end if 
    } // end while
  } // end if

  // // Capture screenshot
  // await page.screenshot({
  //   path: 'screenshot.jpg',
  // });
  // Close the browser instance
  await browser.close();
})();