const ENDPOINT = "https://reqres.in/api/users";
const METHOD = "GET";

describe("Users API", () => {
  context("GET requests", () => {
    it("gets valid response", () => {
      cy.request(METHOD, ENDPOINT).as("users");
      cy.get("@users").its("status").should("eq", 200);
      cy.get("@users").then((res) => {
        validateResponseType(res.body);
        res.body.data.forEach(validateUserType);
      });
    });

    it("checks user lastname", () => {
      cy.request(METHOD, `${ENDPOINT}?id=1`).then((res) => {
        validateUserType(res.body.data);
        expect(res.body.data.last_name).to.eq("Bluth");
      });
      cy.request(METHOD, `${ENDPOINT}?id=2`).then((res) => {
        validateUserType(res.body.data);
        expect(res.body.data.last_name).to.eq("Weaver");
      });
    });

    it("checks total number of users", () => {
      cy.request(METHOD, ENDPOINT).as("initialRequest");
      let allUsers = [];
      let requests = [];
      let totalPages;

      // Retrieve the initial request and process its response
      cy.get("@initialRequest").then((response) => {
        totalPages = response.body.total_pages;

        // Loop through all pages to fetch all users
        for (let i = 1; i <= totalPages; i++) {
          const pageRequest = cy
            .request(METHOD, `${ENDPOINT}?page=${i}`)
            .then((pageResponse) => {
              // Validate response data
              validateResponseType(pageResponse.body);
              pageResponse.body.data.forEach(validateUserType);
              expect(pageResponse.status).to.equal(200);
              expect(pageResponse.body.page).to.equal(i);
              expect(pageResponse.body.data).to.have.length(
                pageResponse.body.per_page
              );

              // Add users from current page to the allUsers list
              allUsers = allUsers.concat(pageResponse.body.data);
            });

          // Add the request to the list of requests
          requests.push(pageRequest);
        }

        // Wait for all requests to complete and then verify the total number of users
        cy.wrap(Promise.all(requests)).then(() => {
          expect(allUsers).to.have.length(response.body.total);
        });
      });
    });
  });

  const validateResponseType = (res) => {
    expect(res).to.have.property("page").and.to.be.a("number");
    expect(res).to.have.property("per_page").and.to.be.a("number");
    expect(res).to.have.property("total").and.to.be.a("number");
    expect(res).to.have.property("total_pages").and.to.be.a("number");
    expect(res).to.have.property("data").and.to.be.an("array");
  };

  const validateUserType = (user) => {
    expect(user).to.have.property("id").and.to.be.a("number");
    expect(user).to.have.property("email").and.to.be.a("string");
    expect(user).to.have.property("first_name").and.to.be.a("string");
    expect(user).to.have.property("last_name").and.to.be.a("string");
    expect(user).to.have.property("avatar").and.to.be.a("string");
  };
});
