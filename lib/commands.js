module.exports = {
  clickElement: async function (page, selector) {
    try {
      await page.waitForSelector(selector);
      await page.click(selector);
    } catch (error) {
      throw new Error(`Selector is not clickable: ${selector}`);
    }
  },
  getText: async function (page, selector) {
    try {
      await page.waitForSelector(selector);
      return await page.$eval(selector, (link) => link.textContent);
    } catch (error) {
      throw new Error(`Text is not available for selector: ${selector}`);
    }
  },
  putText: async function (page, selector, text) {
    try {
      const inputField = await page.$(selector);
      await inputField.focus();
      await inputField.type(text);
      await page.keyboard.press("Enter");
    } catch (error) {
      throw new Error(`Not possible to type text for selector: ${selector}`);
    }
  },

  // Выбор даты
  dateSelection: async function (page, day) {
    await page.waitForSelector("h1");
    let sessionDay = await page.$$("a.page-nav__day");
    await sessionDay[day].click();
  },

  // Выбор зала
  hallSelection: async function (page, hall) {
    let cinemaHalls = await page.$$("div>ul>li");
    await cinemaHalls[hall].click();
    await page.waitForSelector("p.buying__info-hall");
  },

  // Выбор свободного места
  randomUnoccupiedSeat: async function (page) {
    let numberOfRows = await page.$$("div.buying-scheme__row");
    let rows = numberOfRows.length; // количество рядов в зале
    let numberSeatsInRow = await page.$$("div>span.buying-scheme__chair");
    let seatsInARow = numberSeatsInRow.length / rows; // количество мест в ряду
    let tries = seatsInARow * rows * 2;
    // цикл для поиска и проверки свободного места
    for (let i = 0; i < tries; i++) {
      let row = Math.round(Math.random() * (rows - 1)) + 1;
      let seat = Math.round(Math.random() * (seatsInARow - 1)) + 1;
      let selector =
        "div:nth-child(" + row + ") > span:nth-child(" + seat + ")";
      let seatStatus = await page.$eval(selector, (el) => el.classList[2]);
      if (
        seatStatus !== "buying-scheme__chair_selected" &&
        seatStatus !== "buying-scheme__chair_taken"
      ) {
        return selector;
      }
    }
    throw new Error(`Selector is not clickable: ${selector}`);
  },
};
