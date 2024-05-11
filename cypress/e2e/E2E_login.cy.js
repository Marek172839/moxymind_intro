beforeEach(() => {
  cy.visit("/");
  cy.url().should("include", "saucedemo");
});

describe("Login Page", () => {
  var users;
  before(() => {
    // Load fixture data
    cy.fixture("credentials.json").then((fixture) => {
      users = fixture.users;
    });
  });

  it("standard user logs in", () => {
    cy.userLogin(users.standard_user);
    cy.url().should("include", "inventory.html");
  });

  it("locked out_user cant log in", () => {
    cy.userLogin(users.locked_out_user);
    cy.getByDataTest("error").should(
      "include.text",
      "Sorry, this user has been locked out"
    );
  });

  it("cant login with wrong password", () => {
    cy.userLogin(users.wrong_password_user);
    cy.getByDataTest("error").should(
      "include.text",
      "Username and password do not match any user in this service"
    );
  });

  it("user logs out", () => {
    cy.userLogin(users.standard_user);
    cy.get("#react-burger-menu-btn").click();
    cy.getByDataTest("logout-sidebar-link").click();
    cy.url().should("include", "saucedemo");
  });
});
