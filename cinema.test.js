const puppeteer = require("puppeteer");
const {
  clickElement,
  dateSelection,
  hallSelection,
  randomUnoccupiedSeat,
  randomLocationSelector,
  getText,
} = require("./lib/commands.js");
const { expect } = require("chai");

let page;
let timeoutTest = 20000;
const day = Math.round(Math.random() * 5) + 1;
var halls = [1, 2, 4, 5]; // номера залов
// Рандомайзер номера зала
function randomHall(halls) {
  var rand = Math.floor(Math.random() * halls.length);
  return halls[rand];
}

let seatsNum = randomHall(halls) + 1; // рандомный выбор количества бронируемых мест

beforeEach(async () => {
  page = await browser.newPage();
});

afterEach(() => {
  page.close();
});

describe("`Lets go to the cinema` tests", () => {
  beforeEach(async () => {
    await page.goto("https://qamid.tmweb.ru/client/index.php");
  }, timeoutTest);

  test("Should reserve one seat", async () => {
    await dateSelection(page, day);
    await hallSelection(page, randomHall(halls));
    let freeSeat = await randomUnoccupiedSeat(page);
    await clickElement(page, freeSeat);
    await clickElement(page, ".acceptin-button");
    await page.waitForSelector("h1");

    const actual = await getText(page, "h2");
    expect(actual).include("Вы выбрали билеты:");
  });

  test("Should reserve some seats", async () => {
    await dateSelection(page, day);
    await hallSelection(page, randomHall(halls));

    for (let i = 0; i < seatsNum; i++) {
      let freeSeat = await randomUnoccupiedSeat(page);
      await clickElement(page, freeSeat);
    }

    await clickElement(page, ".acceptin-button");
    await page.waitForSelector("h1");

    const actual = await getText(page, "h2");
    expect(actual).include("Вы выбрали билеты:");
  });

  test("Shouldn't book the same place twice", async () => {
    let date = day;
    await dateSelection(page, date);
    let hall = randomHall(halls);
    await hallSelection(page, hall);
    let freeSeat = await randomUnoccupiedSeat(page);
    await clickElement(page, freeSeat);
    await clickElement(page, ".acceptin-button");
    await clickElement(page, ".acceptin-button");

    await page.goto("https://qamid.tmweb.ru/client/index.php");
    await dateSelection(page, date);
    await hallSelection(page, hall);

    let className = await page.$eval(freeSeat, (el) => el.classList[2]);
    expect(className).include("buying-scheme__chair_taken");
  });
});
