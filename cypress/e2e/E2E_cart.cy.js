beforeEach(() => {
  cy.userLogin({ username: "standard_user", password: "secret_sauce" });
  cy.url().should("include", "inventory.html");
});

describe("Shopping Cart", () => {
  it.only("adds product to cart, then removes it", () => {
    cy.addItemToCartByIndex(0);

    // Check if "Remove" button appears
    cy.get("@invItem")
      .getByDataTestLike("remove")
      .should("have.text", "Remove");

    // Check updated cart badge
    cy.getByDataTest("shopping-cart-badge").contains("1");

    // Save the item name and price
    cy.get("@invItem")
      .getByDataTestLike("inventory-item-name")
      .invoke("text")
      .as("itemName");
    cy.get("@invItem")
      .getByDataTestLike("inventory-item-price")
      .invoke("text")
      .as("itemPrice");

    cy.openCart();
    cy.getByDataTest("inventory-item").should("have.length", 1);

    // Check if the item name and price are the same
    cy.getByDataTestLike("inventory-item-name")
      .first()
      .invoke("text")
      .then((name) => {
        cy.get("@itemName").should("eq", name);
      });
    cy.getByDataTestLike("inventory-item-price")
      .first()
      .invoke("text")
      .then((price) => {
        cy.get("@itemPrice").should("eq", price);
      });

    cy.removeItemFromCart();
    cy.assertCartIsEmpty();
  });

  it.only("adds 2 products to cart and completes order", () => {
    // Add 2 products to the cart
    cy.addItemToCartByIndex(0);
    cy.addItemToCartByIndex(1);

    cy.openCart();
    cy.getByDataTest("inventory-item").should("have.length", 2);

    cy.getByDataTestLike("checkout").click();
    cy.url().should("contain", "checkout-step-one");

    cy.fillCheckoutForm("firstname", "lastName", "12345");

    // Continue to the next steps
    cy.getByDataTestLike("continue").click();
    cy.url().should("contain", "checkout-step-two");
    cy.getByDataTestLike("finish").click();
    cy.url().should("contain", "checkout-complete");
  });
});
