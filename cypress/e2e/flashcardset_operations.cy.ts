type FlashcardSet = {
  name: string;
  description: string;
  category: string;
  privacy: "public" | "private" | "unlisted";
  flashcards: {
    word: string;
    translation: string;
  }[];
};

describe("flashcard operations pages spec", () => {
  it("not logged in", () => {
    cy.visit("/home");

    cy.url().should("include", "/sign-in");
  });

  it("logged in", () => {
    cy.signIn();

    cy.fixture("flashcardset.json").then((data: FlashcardSet[]) => {
      cy.visit("/flashcardset/create");
      cy.url().should("include", "/flashcardset/create");

      data.map((flashcardset) => {
        cy.get("[data-cy='input-name']")
          .should("exist")
          .should("be.visible")
          .type(flashcardset.name);
        cy.get("[data-cy='input-description']")
          .should("exist")
          .should("be.visible")
          .type(flashcardset.description);

        // FIXME: cannot select category due to uncontrolled behaviour of it
        // select category
        cy.get("[data-cy='input-category']")
          .should("exist")
          .should("be.visible")
          .type(flashcardset.category);
        cy.get("[data-cy='category-list']")
          .should("exist")
          .should("be.visible")
          .children("[data-cy='category-option']")
          .first()
          .click();

        // select privacy
        cy.get("[data-cy='input-privacy']")
          .should("exist")
          .should("be.visible")
          .click()
          .get("[data-cy='privacy-list']")
          .should("exist")
          .should("be.visible")
          .find(
            `[data-cy='input-privacy-${flashcardset.privacy.toLocaleLowerCase()}']`
          )
          .click();

        // select thumbnail
        cy.get("[data-cy='input-thumbnail']").should("exist").selectFile(
          {
            contents: "cypress/fixtures/thumbnail.png",
            fileName: "thumbnail.png",
          },
          {
            force: true,
          }
        );

        flashcardset.flashcards.map((flashcard) => {
          cy.wait(200);

          cy.get("[data-cy='input-word']")
            .should("exist")
            .should("be.visible")
            .type(flashcard.word);
          cy.get("[data-cy='input-translation']")
            .should("exist")
            .should("be.visible")
            .type(flashcard.translation);
          cy.get("[data-cy='button-submit-flashcard']")
            .should("exist")
            .should("be.visible")
            .click();
        });

        cy.get("[data-cy='flashcard']").should(
          "have.length",
          flashcardset.flashcards.length
        );

        cy.get("[data-cy='button-submit-flashcardset']")
          .should("exist")
          .should("be.visible")
          .click();

        cy.wait(500);

        cy.url().should("include", "/flashcardset");

        cy.get("[data-cy='flashcardset-name']")
          .should("contain", flashcardset.name)
          .should("contain", flashcardset.category);

        // update set
        cy.get("[data-cy='flashcardset-managment-menu']")
          .should("exist")
          .should("be.visible")
          .click();
        cy.get("[data-cy='flashcardset-edit-link']")
          .should("exist")
          .should("be.visible")
          .click();

        cy.get("[data-cy='flashcardset-name']")
          .should("have.value", flashcardset.name)
          .type(" edited");

        const flashcards = cy
          .get("[data-cy='flashcard-list']")
          .should("be.visible")
          .children("[data-cy='flashcard']");

        // update first flashcard
        flashcards.first().get("[data-cy='flashcard-edit']").click();
        cy.get("[data-cy='input-word']").type(" edited");
        cy.get("[data-cy='input-translation']").type(" edited");
        cy.get("[data-cy='button-submit-flashcard']")
          .should("contain", "Update flashcard")
          .click();

        // remove last flashcard
        flashcards.last().get("[data-cy='flashcard-remove']").click();

        cy.get("[data-cy='button-submit-flashcardset']").click();

        cy.wait(500);

        cy.get("[data-cy='flashcardset-name']").should(
          "contain",
          `${flashcardset.name} edited`
        );

        // remove set
        cy.get("[data-cy='flashcardset-managment-menu']")
          .should("exist")
          .should("be.visible")
          .click();
        cy.get("[data-cy='flashcardset-delete-button']")
          .should("exist")
          .should("be.visible")
          .click();
      });
    });
  });
});
