import { promises as fsp } from "fs";
import { equal } from "assert";
import {Builder, By, Capabilities, until} from "selenium-webdriver";
import { fun, asyncfun } from "./example.mjs";
import { get_all_wycieczki, get_wycieczka } from "../database/queries.mjs";
import { init_func } from "../database/init_db.mjs";
import { get_db_memory, get_db_postgres } from "../database/database.mjs";
import * as should from 'should';

async function takeScreenshot(driver, file) {
  const image = await driver.takeScreenshot();
  await fsp.writeFile(file, image, "base64");
}

describe("Function", () => {
  it("should output string equal to 'test'", () => {
    equal(fun(), "test");
  });
});

describe("Async function", () => {
  it("should output string equal to 'atest'", async () => {
    const a = await asyncfun();
    console.log(a);
    equal(a, "atest");
  });
});

describe("Selenium test", function () {
  const TIMEOUT = 10000;
  // Added timeout because of slow drivers.
  this.timeout(TIMEOUT);
  const driver = new Builder().withCapabilities(Capabilities.firefox()).build();

  before(async () => {
    await driver
      .manage()
      .setTimeouts({ implicit: TIMEOUT, pageLoad: TIMEOUT, script: TIMEOUT });
  });

  it("should go to google.com and check title", async () => {
    await driver.get("https://www.google.com");
    await takeScreenshot(driver, "test.png");
    const title = await driver.getTitle();
    equal(title, "Google");
  });

  after(() => driver.quit());
});

// Task 2
describe("Test database operations", () => {
    let db = {};
    before(async () => {
        db = await get_db_memory();
        await init_func(db);
    });
    it("should zgloszenia exist and have length of 2", async () => {
        const pk = 1;
        const { zgloszenia } = await get_wycieczka(db, pk);
        zgloszenia.should.have.lengthOf(2);
    });
    it("should wycieczki have length of 2", async () => {
        const wycieczki = await get_all_wycieczki(db);
        wycieczki.should.have.lengthOf(2);
    });
});

// Task 3 and 4
describe("Test error page and form", function () {
    let db = {};
    const TIMEOUT = 10000;
    this.timeout(TIMEOUT);
    const driver = new Builder().withCapabilities(Capabilities.firefox()).build();

    before(async () => {
        db = await get_db_postgres();
        await init_func(db);
        await driver
            .manage()
            .setTimeouts({ implicit: TIMEOUT, pageLoad: TIMEOUT, script: TIMEOUT });
    });
    // Task 3
    it("should catch error", async () => {
        await driver.get("http://localhost:3000/error");
        const web_error = await driver.findElement(By.id("error_msg"));
        const error = await web_error.getText();
        equal(error, "Nie znaleziono strony o podanym adresie!");
    });
    // Task 4
    it("should successfully send form", async () => {
        await driver.get("http://localhost:3000/book/1");
        await driver.findElement(By.id("first_name")).sendKeys("Julia");
        await driver.findElement(By.id("last_name")).sendKeys("Podrazka");
        await driver.findElement(By.id("phone")).sendKeys("111111111");
        await driver.findElement(By.id("email")).sendKeys("J@gmail.com");
        await driver.findElement(By.id("n_people")).sendKeys("2");
        await driver.findElement(By.id("gdpr_permission")).click();
        await driver.findElement(By.id("submitid")).click();
        // If info is present, than the page was redirected to book-success.
        await driver.wait(until.elementLocated(By.id("info")));
    });
});
