// Add a custom command to get elements by exact data-test attribute
// This command works both with and without a subject
Cypress.Commands.add(
  "getByDataTest",
  { prevSubject: "optional" }, // This command can be chained from a subject or used standalone
  (subject, selector, ...args) => {
    if (subject) {
      // If there's a subject, find elements within that subject
      return subject.find(`[data-test=${selector}]`, ...args);
    } else {
      // If there's no subject, search the entire document
      return cy.get(`[data-test=${selector}]`, ...args);
    }
  }
);

// Add a custom command to get elements by partial match of the data-test attribute
// This command works both with and without a subject
Cypress.Commands.add(
  "getByDataTestLike",
  { prevSubject: "optional" }, // This command can be chained from a subject or used standalone
  (subject, selector, ...args) => {
    if (subject) {
      // If there's a subject, find elements within that subject
      return subject.find(`[data-test*=${selector}]`, ...args);
    } else {
      // If there's no subject, search the entire document
      return cy.get(`[data-test*=${selector}]`, ...args);
    }
  }
);

Cypress.Commands.add("userLogin", (user) => {
  cy.visit("/");
  cy.get("#user-name").type(user.username).should("have.value", user.username);
  cy.get("#password").type(user.password).should("have.value", user.password);
  cy.get("#login-button").click();
});

Cypress.Commands.add("openCart", () => {
  cy.get(".shopping_cart_link").click();
  cy.url().should("contain", "/cart.html");
});

Cypress.Commands.add("addItemToCartByIndex", (index) => {
  cy.getByDataTest("inventory-item").eq(index).as("invItem");
  cy.get("@invItem").getByDataTestLike("add-to-cart").click();
});

Cypress.Commands.add("removeItemFromCart", () => {
  cy.getByDataTestLike("remove").click();
});

Cypress.Commands.add("assertCartIsEmpty", () => {
  cy.getByDataTestLike("inventory-item").should("have.length", 0);
  cy.getByDataTest("shopping-cart-badge").should("not.exist");
});

Cypress.Commands.add("fillCheckoutForm", (firstName, lastName, postalCode) => {
  cy.getByDataTest("firstName").type(firstName);
  cy.getByDataTest("lastName").type(lastName);
  cy.getByDataTest("postalCode").type(postalCode);
});
