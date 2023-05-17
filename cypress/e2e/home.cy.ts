describe("unauthenticated home page spec", () => {
  it("not logged in", () => {
    cy.visit("/home");

    cy.url().should("include", "/sign-in");
  });
});

type HomeData = {
  query: string;
};

describe("home page spec", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.signIn();

    cy.visit("/home");
  });

  it("search section", () => {
    const searchInput = cy.get("[data-cy='input-search']");
    expect(searchInput).to.exist;

    cy.fixture("home.json").then((data: HomeData) => {
      searchInput.type(data.query);
      searchInput.should("have.value", data.query);

      searchInput.type("{enter}");

      cy.url().should("include", "/search");
    });
  });

  it("categories section", () => {
    cy.intercept("GET", "/api/trpc/*").as("dataLoad");

    let container = cy.get("[data-cy='container-categories']");

    const skeletons = container.children("[data-cy='skeleton-category']");
    expect(skeletons).to.exist;
    skeletons.should("have.length", 6);

    cy.wait("@dataLoad").then(() => {
      // update container reference
      container = cy.get("[data-cy='container-categories']");

      const categories = container.children("[data-cy='category']");
      expect(categories).to.exist;
      categories.should("have.length", 6);
    });
  });

  it("popular section", () => {
    cy.intercept("GET", "/api/trpc/*").as("dataLoad");

    let container = cy.get("[data-cy='container-popular']");

    const skeletons = container.children("[data-cy='skeleton-flashcardset']");
    expect(skeletons).to.exist;
    skeletons.should("have.length", 6);

    cy.wait("@dataLoad").then(() => {
      // update container reference
      container = cy.get("[data-cy='container-popular']");

      const sets = container.children("[data-cy='flashcardset']");
      expect(sets).to.exist;
      sets.should("have.length.above", 0);
    });
  });
});
