describe("unauthenticated home page spec", () => {
  it("not logged in", () => {
    cy.visit("/home");

    cy.url().should("include", "/sign-in");
  });
});

describe("home page spec", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.signIn();

    cy.visit("/home");
  });

  it("passes", () => {
    expect(true).to.be.true;
  });
});
