type AuthData = {
  id: string;
  username: string;
};

describe("profile page spec", () => {
  it("not logged in", () => {
    cy.intercept("GET", "/api/trpc/*").as("dataLoad");

    cy.fixture("auth.json").then((data: AuthData) => {
      cy.visit(`/profile/${data.id}`);

      const popularTab = cy.get("[data-cy='tab-popular']");
      popularTab.should("exist");
      popularTab.should("have.attr", "data-headlessui-state", "selected");

      cy.get("[data-cy='tab-my-flashcards").should("not.exist");
      cy.get("[data-cy='tab-history").should("not.exist");

      cy.get("[data-cy='username']").contains(data.username);
      cy.get("[data-cy='num-of-flashcards']").contains("2 Flashcards");

      cy.get("[data-cy='profile-managment']").should("not.exist");

      cy.get("[data-cy='previous-page'").should("exist").should("be.disabled");
      cy.get("[data-cy='next-page'").should("exist").should("be.disabled");

      cy.get("[data-cy='skeleton-flashcardset']")
        .should("exist")
        .should("have.length", 3);

      cy.wait("@dataLoad").then(() => {
        cy.get("[data-cy='previous-page'")
          .should("exist")
          .should("be.disabled");
        cy.get("[data-cy='next-page'").should("exist").should("be.disabled");
      });
    });
  });

  it("logged in", () => {
    cy.signIn();
    cy.visit("/home");

    cy.intercept("GET", "/api/trpc/*").as("dataLoad");

    cy.fixture("auth.json").then((data: AuthData) => {
      cy.visit(`/profile/${data.id}`);

      const popularTab = cy.get("[data-cy='tab-popular']");
      popularTab.should("exist");
      popularTab.should("have.attr", "data-headlessui-state", "selected");

      const myFlashcardsTab = cy.get("[data-cy='tab-my-flashcards']");
      myFlashcardsTab.should("exist");

      const historyTab = cy.get("[data-cy='tab-history']");
      historyTab.should("exist");

      cy.get("[data-cy='username']").contains(data.username);
      cy.get("[data-cy='num-of-flashcards']").contains("4 Flashcards");

      cy.get("[data-cy='profile-managment']").should("exist");

      cy.get("[data-cy='previous-page'").should("exist").should("be.disabled");
      cy.get("[data-cy='next-page'").should("exist").should("be.disabled");

      cy.get("[data-cy='skeleton-flashcardset']")
        .should("exist")
        .should("have.length", 9);

      cy.wait("@dataLoad").then(() => {
        cy.get("[data-cy='previous-page'")
          .should("exist")
          .should("be.disabled");
        cy.get("[data-cy='next-page'").should("exist").should("be.disabled");

        cy.get("[data-cy='tab-my-flashcards']").click();
        cy.get("[data-cy='flashcardset']").should("exist");

        cy.get("[data-cy='tab-history']").click();
        cy.get("[data-cy='empty-list-info']")
          .should("exist")
          .should("contain", "No flashcard sets found.");
      });
    });
  });
});
