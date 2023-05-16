/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>;
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>;
//       dismiss(
//         subject: string,
//         options?: Partial<TypeOptions>
//       ): Chainable<Element>;
//       visit(
//         originalFn: CommandOriginalFn,
//         url: string,
//         options: Partial<VisitOptions>
//       ): Chainable<Element>;
//     }
//   }
// }

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      signOut(): Chainable<void>;
      signIn(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("signOut", () => {
  cy.log("signing out.");

  const menuButton = cy.get(".cl-userButtonTrigger");
  expect(menuButton).to.exist;

  menuButton.click().then(() => {
    const signOutButton = cy.get(".cl-userButtonPopoverActionButton__signOut");
    expect(signOutButton).to.exist;
    signOutButton.click();
  });

  cy.log("signed out.");
});

type AuthData = {
  identifier: string;
  password: string;
};

Cypress.Commands.add("signIn", () => {
  cy.log("Signing in.");
  cy.visit("/sign-in");

  cy.visit("/sign-in").then(() => {
    cy.fixture("auth.json").then((data: AuthData) => {
      cy.get("#identifier-field").type(data.identifier);
      cy.get(".cl-formButtonPrimary").click();

      cy.get("#password-field").type(data.password);
      cy.get(".cl-formButtonPrimary").click();

      const profileLink = cy.get("[data-cy='link-profile']");
      expect(profileLink).to.exist;
    });
  });

  cy.log("signed in.");
});

export {};
