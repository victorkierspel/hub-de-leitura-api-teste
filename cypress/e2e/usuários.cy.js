/// <reference types ="cypress"/>

let token;

beforeEach(() => {
  cy.geraToken("admin@biblioteca.com", "admin123").then((tkn) => {
    token = tkn;
  });
});

describe("Teste de API - Gestão de Usuários", () => {
  (it("Teste Token", () => {
    cy.geraToken("admin@biblioteca.com", "admin123").then((tkn) => {
      //cy.log (tkn)
    });
  }),
    it("Deve listar usuários com sucesso", () => {
      cy.api({
        method: "GET",
        url: "users",
        headers: { Authorization: token },
      }).should((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.users).to.be.an("array");
      });
    }));

  it("Deve validar propriedades de um usuário", () => {
    cy.api({
      method: "GET",
      url: "users",
      headers: { Authorization: token },
    }).should((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.users[0]).to.have.property("id");
      expect(response.body.users[0]).to.have.property("name");
      expect(response.body.users[0]).to.have.property("email");
    });
  });

  it("Deve listar um usuário com sucesso buscando por ID", () => {
    cy.api({
      method: "GET",
      url: "users/2",
      headers: { Authorization: token },
    }).should((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("name");
      expect(response.body).to.have.property("email");
    });
  });

  it("Deve listar usuário com sucesso usando filtro - Parâmetros", () => {
    cy.api({
      method: "GET",
      url: "users",

      headers: { Authorization: token },
      qs: {
        page: 1,
        limit: 20,
        search: "Usuário",
      },
    }).should((response) => {
      expect(response.status).to.equal(200);
    });
  });
});

describe(" GET - Teste de API - Gestão de Usuários - POST", () => {
  it("Deve cadastrar um usuário com sucesso", () => {
    let email = `teste${Date.now()}@email.com`;
    cy.api({
      method: "POST",
      url: "users",
      body: {
        name: "Maria Santos",
        email: email,
        password: "senha123",
      },
    }).should((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal("Usuário criado com sucesso.");
    });
  });
  it("Deve validar um usuário cadastrado com email inválido", () => {
    cy.api({
      method: "POST",
      url: "users",
      body: {
        name: "Maria Santos",
        email: "teste6email.com",
        password: "senha123",
      },
      failOnStatusCode: false,
    }).should((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal("Formato de email inválido.");
    });
  });
});

describe("PUT - Teste de API - Gestão de Usuários", () => {
  it("Deve atualizar um usuário com sucesso", () => {
    cy.api({
      method: "PUT",
      url: "users/50",
      headers: { Authorization: token },
      body: {
        name: "Victor Fernandes Alterado",
        email: "victor.novo.alterado@email.com",
        password: "novaSenha123",
      },
    }).should((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Usuário atualizado com sucesso.");
    });
  });
  it("Deve atualizar usuário com sucesso - De forma dinâmica", () => {
    let email = `victor${Date.now()}@email.com`;
    cy.cadastrarUsuario("Victor Fernandes", email, "senha123").then(
      (userID) => {
        cy.api({
          method: "PUT",
          url: `users/${userID}`,
          headers: { Authorization: token },
          body: {
            name: "Victor Fernandes Alterado",
            email: email,
            password: "novaSenha123",
          },
        }).should((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.message).to.equal(
            "Usuário atualizado com sucesso.",
          );
        });
      },
    );
  });
});

describe("DELETE - Teste de API - Gestão de Usuários - DELETE", () => {
  it("Deve deletar um usuário com sucesso", () => {
    cy.api({
      method: "DELETE",
      url: "users/34",
      headers: { Authorization: token },
    }).should((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Usuário removido com sucesso.");
    });
  });

  it("Deve deletar usuário com sucesso - De forma dinâmica", () => {
    cy.cadastrarUsuario(
      "Victor para Deletar",
      "email@deletar.com",
      "senha123",
    ).then((userID) => {
      cy.api({
        method: "DELETE",
        url: `users/${userID}`,
        headers: { Authorization: token },
      }).should((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Usuário removido com sucesso.");
      });
    });
  });
});
