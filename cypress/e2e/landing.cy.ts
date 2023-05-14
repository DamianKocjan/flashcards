type LandingData = {
  query: string;
};

describe("landing page spec", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("nav contains", () => {
    const homeLink = cy.get("[data-cy='link-home']");
    expect(homeLink).to.exist;
    homeLink.should("have.attr", "href", "/");

    cy.get("[data-cy='link-profile']").should("not.exist");

    const linkSignIn = cy.get("[data-cy='link-signin']");
    expect(linkSignIn).to.exist;
  });

  it("header section", () => {
    cy.viewport("macbook-16");

    cy.get("[data-cy='hero-image'", {
      timeout: 10000,
    }).should("be.visible");

    cy.viewport("iphone-6");

    cy.get("[data-cy='hero-image'", {
      timeout: 10000,
    }).should("not.be.visible");
  });

  it("learn section", () => {
    const searchInput = cy.get("[data-cy='input-search']");
    expect(searchInput).to.exist;

    cy.fixture("landing.json").then((data: LandingData) => {
      searchInput.type(data.query);
      searchInput.should("have.value", data.query);

      searchInput.type("{enter}");

      cy.url().should("include", "/search");
    });
  });
});
