const ENDPOINT = "https://reqres.in/api/users";
const METHOD = "POST";

const NEW_USER = {
  name: "George",
  job: "plumber",
};

describe("Users POST", () => {
  var users;
  before(() => {
    // Load fixture data
    cy.fixture("users_POST.json").then((fixture) => {
      users = fixture.users;
    });
  });

  it("should create a new user", () => {
    cy.request(METHOD, ENDPOINT, users[0]).then((res) => {
      checkResponseTime(res.body.createdAt, 500);
      expect(res.status).to.eq(201);
      validateResponseType(res.body);
    });
  });

  it("should respond with status code 201 under 250ms", () => {
    cy.request(METHOD, ENDPOINT, users[0]).then((res) => {
      checkResponseTime(res.body.createdAt, 250);
      expect(res.status).to.eq(201);
    });
  });
});

const checkResponseTime = (createdAt, maxResponseTime) => {
  const currentTime = new Date().getTime();
  const responseTime = new Date(createdAt).getTime();
  const difference = currentTime - responseTime;
  cy.log("Response time: " + difference + "ms");
  expect(difference).to.be.at.most(maxResponseTime);
};

const validateResponseType = (res) => {
  expect(res).to.have.property("name").and.to.be.a("string");
  expect(res).to.have.property("job").and.to.be.a("string");
  expect(res).to.have.property("id").and.to.be.a("string");
  expect(res).to.have.property("createdAt").and.to.be.a("string");
};

const validateUserType = (user) => {
  expect(user).to.have.property("id").and.to.be.a("number");
  expect(user).to.have.property("email").and.to.be.a("string");
  expect(user).to.have.property("first_name").and.to.be.a("string");
  expect(user).to.have.property("last_name").and.to.be.a("string");
  expect(user).to.have.property("avatar").and.to.be.a("string");
};
