const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After } = require("cucumber");
const {
  clickElement,
  getText,
  dateSelection,
  hallSelection,
  randomUnoccupiedSeat,
} = require("../../lib/commands.js");

Before(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("user is on cinema hall page", { timeout: 60 * 1000 }, async function () {
  await this.page.goto("http://qamid.tmweb.ru");
});

When(
  "user selects day {string}",
  { timeout: 60 * 1000 },
  async function (string) {
    await dateSelection(this.page, Number(string));
  }
);

When(
  "user selects hall {string}",
  { timeout: 60 * 1000 },
  async function (string) {
    await hallSelection(this.page, Number(string));
  }
);

When(
  "user selects {string} free chairs",
  { timeout: 60 * 1000 },
  async function (string) {
    for (let i = 0; i < Number(string); i++) {
      freeSeat = await randomUnoccupiedSeat(this.page);
      await clickElement(this.page, freeSeat);
    }
  }
);

When("user click `book` button", { timeout: 60 * 1000 }, async function () {
  return await clickElement(this.page, ".acceptin-button");
});

When("user return to cinema hall", { timeout: 60 * 1000 }, async function () {
  await this.page.goto("http://qamid.tmweb.ru");
});

When("user selects same chair", { timeout: 60 * 1000 }, async function () {
  await clickElement(this.page, freeSeat);
});

Then("user sees the booked ticket", async function () {
  const title = await getText(this.page, "h2");
  expect(title).contain("Вы выбрали билеты:");
});

Then("button 'Booking' not active", async function () {
  const actual = await this.page.$eval(
    ".acceptin-button",
    (button) => button.disabled
  );
  expect(actual).equal(true);
});
