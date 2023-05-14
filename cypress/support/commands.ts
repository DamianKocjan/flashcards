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

  interface Window {
    Clerk: {
      isReady: () => boolean;
      client: {
        signIn: {
          create: (params: {
            identifier: string;
            password: string;
          }) => Promise<{ createdSessionId: string }>;
        };
      };
      setActive: (session: any) => Promise<void>;
    };
  }
}

Cypress.Commands.add("signOut", () => {
  cy.log("sign out by clearing all cookies.");
  cy.clearCookies();
});

Cypress.Commands.add("signIn", () => {
  cy.log("Signing in.");
  cy.visit("/");

  cy.window()
    .should((window) => {
      expect(window).to.not.have.property("Clerk", undefined);
      expect(window.Clerk.isReady()).to.eq(true);
    })
    .then(async (window) => {
      cy.clearCookies({ domain: window.location.hostname });
      const res = await window.Clerk.client.signIn.create({
        identifier: "braden@clerk.dev",
        password: "clerkpassword1234",
      });

      await window.Clerk.setActive({
        session: res.createdSessionId,
      });

      cy.log("Finished Signing in.");
    });
});

export {};
