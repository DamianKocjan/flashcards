describe("flashcard detail page spec", () => {
  it("not logged in", () => {
    cy.intercept("GET", "/api/trpc/*").as("dataLoad");

    cy.fixture("auth.json").then((data: AuthData) => {
      cy.visit(`/profile/${data.id}`);

      const popularTab = cy.get("[data-cy='tab-popular']");
      popularTab.should("exist");
      popularTab.should("have.attr", "data-headlessui-state", "selected");

      cy.wait("@dataLoad").then(() => {
        cy.get("[data-cy='flashcardset'").first().click();

        cy.url().should("include", "/sign-in");
      });
    });
  });

  it("logged in", () => {
    cy.signIn();

    cy.intercept("GET", "/api/trpc/*").as("dataLoad");

    cy.fixture("auth.json").then((data: AuthData) => {
      cy.visit(`/profile/${data.id}`);

      const popularTab = cy.get("[data-cy='tab-popular']");
      popularTab.should("exist");
      popularTab.should("have.attr", "data-headlessui-state", "selected");

      cy.wait("@dataLoad").then(() => {
        cy.get("[data-cy='flashcardset'").first().click();

        cy.url().should("include", "/flashcardset/");

        // test flashcard tab
        {
          const getPagination = () => {
            let pagination: [number, number] = [-1, -1];
            cy.get("[data-cy='flashcardset-pagination']")
              .invoke("val")
              .as("flashcardsetPagination");
            cy.get("@flashcardsetPagination").then((flashcardsetPagination) => {
              const paginationString = flashcardsetPagination.text().split("/");
              pagination = [
                parseInt(paginationString?.[0] ?? "-1"),
                parseInt(paginationString?.[1] ?? "-1"),
              ];
            });

            return pagination;
          };

          const previous = () => {
            cy.get("[data-cy='flashcardset-previous']").click();
          };

          const next = () => {
            cy.get("[data-cy='flashcardset-next']").click();
          };

          const initialPagination = getPagination();
          expect(initialPagination[0]).to.equal(1);
          expect(initialPagination[1]).to.be.greaterThan(1);

          previous();
          expect(initialPagination[0]).to.equal(1);
          expect(initialPagination[1]).to.be.greaterThan(1);

          next();
          let paginationAfterNext = getPagination();
          expect(paginationAfterNext[0]).to.equal(2);
          expect(paginationAfterNext[1]).to.be.greaterThan(1);

          previous();
          paginationAfterNext = getPagination();
          expect(paginationAfterNext[0]).to.equal(1);
          expect(paginationAfterNext[1]).to.be.greaterThan(1);

          next();
          next();
          paginationAfterNext = getPagination();
          expect(paginationAfterNext[0]).to.equal(3);
          expect(paginationAfterNext[1]).to.be.greaterThan(1);
        }

        // test learn tab
        {
          cy.get("[data-cy='tab-learn']").click();

          const getText = () => {
            // it's a word or translation (depends if it's flipped)
            let wordOrTranslation = "";
            cy.get("[data-cy='flashcardset-word']")
              .invoke("val")
              .as("flashcardsetWord");
            cy.get("@flashcardsetWord").then((wordOrTranslationEl) => {
              wordOrTranslation = wordOrTranslationEl.text();
            });

            return wordOrTranslation;
          };

          const flip = () => {
            cy.get("[data-cy='flashcardset-word']").click();
          };

          const initialText = getText();
          expect(initialText).to.not.equal("");

          flip();
          const flippedText = getText();
          expect(flippedText).to.not.equal(initialText).and.not.equal("");

          flip();
          const flippedBackText = getText();
          expect(flippedBackText).to.equal(initialText);
        }

        // test practice tab
        // TODO
      });
    });
  });
});
