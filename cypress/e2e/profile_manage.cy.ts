describe("profile management page spec", () => {
  it("not logged in", () => {
    cy.fixture("auth.json").then((data: AuthData) => {
      cy.visit(`/profile/${data.id}/manage`);

      cy.url().should("not.include", `/profile/${data.id}/manage`);
    });
  });

  it("logged in", () => {
    cy.signIn();
    cy.visit("/home");

    cy.fixture("auth.json").then((data: AuthData) => {
      cy.visit(`/profile/${data.id}/manage`);

      cy.url().should("include", `/profile/${data.id}/manage`);
    });
  });
});
