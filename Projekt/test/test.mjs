import { equal } from "assert";
import {Builder, By, Capabilities, until} from "selenium-webdriver";
import { get_all_wycieczki } from "../database/queries.mjs";
import { init_func } from "../database/init_db.mjs";
import { get_db_postgres } from "../database/database.mjs";
import * as should from 'should';

const TIMEOUT = 10000;

let db = {};

// Tests whether pages with all existing trips in database exists and a page with nonexistent
// trip prints error.
describe("Test trip pages", function () {
    this.timeout(TIMEOUT);
    const driver = new Builder().withCapabilities(Capabilities.firefox()).build();

    before(async () => {
        db = await get_db_postgres();
        await init_func(db);
    });

    it("should catch error", async () => {
        await driver.get("http://localhost:3000/trip/0");
        const web_error = await driver.findElement(By.id("error_msg"));
        const error = await web_error.getText();
        equal(error, "Nie znaleziono strony o podanym adresie!");
    });

    it("should successfully open page with given trip", async () => {
        const trips = await get_all_wycieczki(db);
        // Tests whether given trip page displays correct trip name.
        for (let id = 1; id <= trips.length; id++) {
            await driver.get(`http://localhost:3000/trip/${id}/`);
            const web_trip_name = await driver.findElement(By.xpath("//h1"));
            const trip_name = await web_trip_name.getText();
            // Checks if a page has correct name trip.
            equal(trip_name, trips[id - 1].nazwa);
        }
    });

});

// Tests whether the return and reserve button on trip page work properly.
describe("Test reserve and return button", function () {
    this.timeout(TIMEOUT);
    const driver = new Builder().withCapabilities(Capabilities.firefox()).build();

    before(async () => {
        db = await get_db_postgres();
        await init_func(db);
    });

    const trip_id = 1;
    it("should redirect to /main/ page", async() => {
        await driver.get(`http://localhost:3000/trip/${trip_id}`);
        await driver.findElement(By.xpath("//a[@id='return']")).click();
        const current_url = await driver.getCurrentUrl();
        equal(current_url, "http://localhost:3000/");
    });

    it("should redirect to /book/id page", async () => {
        await driver.get(`http://localhost:3000/trip/${trip_id}`);
        await driver.findElement(By.xpath("//a[@id='reserve']")).click();
        const current_url = await driver.getCurrentUrl();
        equal(current_url, "http://localhost:3000/book/" + trip_id);
    });

});

// Tests whether the exact amount of trips in database is seen on the main page.
describe("Test number of trips on main page", function () {
    this.timeout(TIMEOUT);
    const driver = new Builder().withCapabilities(Capabilities.firefox()).build();

    before(async () => {
        db = await get_db_postgres();
        await init_func(db);
    });

    it("should have the same amount of trips", async () => {
        const trips = await get_all_wycieczki(db);
        await driver.get("http://localhost:3000/");
        const web_trips = await driver.findElements(By.className("trip"));
        web_trips.should.have.lengthOf(trips.length)
    });

});

// Tests whether a form is added properly to database and available spots show correct number.
// Additionally, tests if a form without gdpr permission can be send.
describe("Test form", function () {
    this.timeout(TIMEOUT);
    const driver = new Builder().withCapabilities(Capabilities.firefox()).build();

    before(async () => {
        db = await get_db_postgres();
        await init_func(db);
    });

    // Sends correct/incorrect form depending on is_correct value.
    async function send_form(is_correct) {
        await driver.findElement(By.id("first_name")).sendKeys("Julia");
        await driver.findElement(By.id("last_name")).sendKeys("Podrazka");
        await driver.findElement(By.id("phone")).sendKeys("111111111");
        await driver.findElement(By.id("email")).sendKeys("J@gmail.com");
        await driver.findElement(By.id("n_people")).sendKeys("1");
        if (is_correct)
            await driver.findElement(By.id("gdpr_permission")).click();
        await driver.findElement(By.id("submitid")).click();
    }

    it("should subtract available spots after form", async () => {
        await driver.get("http://localhost:3000/book/1");

        // Function getting number of available spots from the page.
        async function get_number_of_available_spots() {
            const web_number_of_spots = await driver.findElement(By.xpath("//h2"));
            const string_number_of_spots = await web_number_of_spots.getText();
            return parseInt(string_number_of_spots.split(' ').pop());
        }

        const number_of_spots_before = await get_number_of_available_spots();
        await send_form(true);
        const number_of_spots_after = await get_number_of_available_spots();
        equal(number_of_spots_before, number_of_spots_after + 1);
    });

    it("should add to table", async () => {
        await driver.get("http://localhost:3000/book/1");
        const reservations_before = await db.Zgloszenie.findAll();
        const number_of_reservations_before = reservations_before.length;

        await send_form(true);

        const reservations_after = await db.Zgloszenie.findAll();
        const number_of_reservations_after = reservations_after.length;
        equal(number_of_reservations_before + 1, number_of_reservations_after);
    });

    it("should not send form with wrong data", async () => {
        await driver.get("http://localhost:3000/book/1");
        await send_form(false);
        const current_url = await driver.getCurrentUrl();
        equal(current_url, "http://localhost:3000/book/1");
    });

});

// Sends registration form with correct/incorrect information depending on is_correct value
// with given email.
async function register(is_correct, email, driver) {
    await driver.findElement(By.id("name")).sendKeys("Julia");
    await driver.findElement(By.id("surname")).sendKeys("Podrazka");
    await driver.findElement(By.id("email")).sendKeys(email);
    await driver.findElement(By.id("password")).sendKeys("okokokok");
    let confirm_password = "okokokok";
    if (!is_correct)
        confirm_password = "notnotnotnotnot";
    await driver.findElement(By.id("confirm_password")).sendKeys(confirm_password);
    await driver.findElement(By.id("submit-button")).click();
}

// Tests correct and incorrect registration.
describe("Test registration", function () {
    this.timeout(TIMEOUT);
    const driver = new Builder().withCapabilities(Capabilities.firefox()).build();

    before(async () => {
        db = await get_db_postgres();
    });

    it("should register and redirect to /successful_registration", async() => {
        await driver.get("http://localhost:3000/registration");
        await register(true, "przykladowy1@gmail.com", driver);
        const current_url = await driver.getCurrentUrl();
        equal(current_url, "http://localhost:3000/successful_registration");
    });

    it("should not register and redirect to /successful_registration with error page", async () => {
        await driver.get("http://localhost:3000/registration");
        await register(false, "przykladowy1@gmail.com", driver);
        const current_url = await driver.getCurrentUrl();
        equal(current_url, "http://localhost:3000/successful_registration");
        // If there is content, it means that there is an error page.
        await driver.findElement(By.id("content"));
    });

});

// Tests correct and incorrect login, if session recognizes logged-in users and tests logging out.
describe("Test login", function() {
    this.timeout(TIMEOUT);
    const driver = new Builder().withCapabilities(Capabilities.firefox()).build();

    before(async () => {
        db = await get_db_postgres();
    });

    async function login(email) {
        await driver.findElement(By.id("email")).sendKeys(email);
        await driver.findElement(By.id("password")).sendKeys("okokokok");
        await driver.findElement(By.id("submit-button")).click();
    }

    it("should login and redirect to /successful_login", async () => {
        await driver.get("http://localhost:3000/registration");
        await register(true, "przykladowy2@gmail.com", driver);
        await driver.get("http://localhost:3000/login");
        await login("przykladowy2@gmail.com");
        const current_url = await driver.getCurrentUrl();
        // Checking if user is still logged on.
        equal(current_url, "http://localhost:3000/successful_login");
        const current_url1 = await driver.getCurrentUrl();
        equal(current_url1, "http://localhost:3000/successful_login");
    });

    it("should logout and redirect to /login", async () => {
        await driver.get("http://localhost:3000/login");
        await driver.findElement(By.id("logout-button")).click();
        const current_url = await driver.getCurrentUrl();
        equal(current_url, "http://localhost:3000/login");
    });

    it("should get user not found error", async () => {
        await driver.get("http://localhost:3000/login");
        await login("zly@gmail.com");
        const web_body = await driver.findElement(By.tagName("body"));
        const body = await web_body.getText();
        equal(body, "User not found");
    });

});
