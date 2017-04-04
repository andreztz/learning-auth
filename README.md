# Autenticação e Autorização com NodeJS

**Autenticação** é permitir que os usuários loguem nos sistemas, que se autentiquem. Seja por meio de usuário e senha ou através de um perfil de redes sociais.

**Autorização** atribui papéis aos usuários, ou seja, o que ele poderá ou não fazer no sistema após estar autenticado. (ACL)


## Cookies VS Tokens

Existem duas maneiras de implementarmos um sistema de autenticação em aplicações *server-side* com um front-end e uma API:  

1. Autenticação baseada em Cookies;  
2. Autenticação baseada em Tokens.


![Autenticação baseada em Cookies](https://raw.githubusercontent.com/ednilsonamaral/learning-auth/master/img/cookie.png)

![Autenticação baseada em Tokens](https://raw.githubusercontent.com/ednilsonamaral/learning-auth/master/img/token.png)


### Benefícios de utilizar autenticação baseada em Tokens

**- CORS:** Cookies e CORS não funcionam bem em diferentes domínios. Já com Tokens, é possível trabalharmos com diferentes domínios tranquilamente, em qualquer requisição, pois usamos o cabeçalho HTTP para transmitir as informações do usuário.  
**-Stateless (escabilidade do servidor)** não há necessidade de mantermos armazenado em sessões, já que o token é uma entidade auto-contida que tranmite todas as informações do usuário.  
**-CDN:** podemos ter todos os *assets* da nossa aplicação em um servidor diferente da API.  
**-Decoupling (dissociação):**  não ficamos limitados a um *Schema* específico de autenticação, pois o token pode ser gerado de qualquer lugar.  
**-Mobile Apps:**  trabalhar com cookies em plataformas nativas (iOS / Android) não é um método seguro para consumir uma API, pois temos que lidar com vários *cookies containers**. Já adotar o token em mobile apps, facilita muito o nosso trabalho.  
**-Performance**  
**-Baseado em padrões:** nossa API pode aceitar como padrão JWT (Json Web Token). Esse é um padrão utilizado por grandes empresas de Tech e existem inúmeras libs para utilizarmos no back-end.


## JWT - Json Web Token

> JWT (JSON Web Tokens) é uma estratégia de autenticação para APIs em REST simples e segura. Trata-se de um padrão aberto para autenticações web e é totalmente baseada em requests JSON entre o cliente e servidor.

É uma solução para autenticação utilizada em APIs em REST. É um container para que possamos validar e armazenar algum tipo de informação. Ele é composto por três estruturas: cabeçalho, conteúdo e assinatura.

Seu mecanismo funciona assim:

**1.** Cliente faz solicitação com credenciais de login/senha;  
**2.** O servidor valida as credenciais. Se tudo estiver certo, ele retorna para o cliente um JSON com um token que codifica dados de um usuário logado no sistema;  
**3.** Após receber o token, o cliente pode armazená-lo da forma que preferir, seja por LocalStorage, Cookie ou outros mecanismos de armazenamento do lado do cliente;  
**4.** Toda vez que o cliente acessa uma rota que requere autenticação, ele apenas envia esse token para a API para autenticar e liberar os dados de consumo;  
**5.** O servidor sempre valida esse token para permitir ou bloquear uma solicitação de cliente.

Para circular o JWT nas requisições em nossa API, devemos utilizá-lo no cabeçalho **Authorization**. Por exemplo: **Authorization: JWT token**. Com o *header* **JWT token** é utilizado na estratégia `passport-jwt`, por exemplo. Tem também o **Bearer token** é utilizado com o OAuth2.

Para fazer um token expirar, basta utilizarmos a propriedade **expiresIn** no `passport-jwt`, por exemplo:

```js  
const token = jwt.sign(user, secret, {
  expiresIn: 28800 // seconds - 8 horas
});
```

Em uma API do tipo REST, podemos adotar as seguintes estratégias para utilizarmos token:

**1.** Ter uma endpoint `/token` ou `/auth` ou `/login`, que será responsável por verificar se o usuário é válido e irá fazer o login dele na aplicação.  
**2.** Quando o login for bem sucedido, ele gera um novo token e salvar esse token em LocalStorage no front-end para trabalhar nas requisições a API.  
**3.** Então, todas as endpoints da aplicação que necessitem de login, basta protegê-las, informando isso quando criar a endpoint, por exemplo `router.get('/', passport.authenticate('jwt', { session: false }), controller.index);`.


## OAuth 2

É um protocolo para autorização para API's web voltado a permitir que aplicações client acessem um recurso protegido em nome de um usuário. Ele substitui o OAuth 1. Seu foco é a simplicidade de desenvolvimento para aplicações web, desktop, mobile, etc.

De uma forma resumida, ele permite uma aplicação acessar uma API no lugar do usuário, de forma segura e padronizada.

> OAuth 2.0 fornece uma estrutura de autorização que permite aos usuários autorizar o acesso a aplicativos de terceiros. Quando autorizado, o aplicativo recebe um token para usar como credencial de autenticação. Isso tem dois benefícios de segurança primários:

> 1. O aplicativo não precisa armazenar o nome de usuário e a senha do usuário.
> 2. O token pode ter um escopo restrito (por exemplo: acesso somente leitura).

O OAuth define quatro papéis, sendo eles:  


1. Resource Owner: dono do recurso (Facebook, Google, Twitter);  
2. Client: aplicação que irá utilizar o recurso;  
3. Resource Server: API;  
4. Authorization Server: API.


## HTTP Bearer Authentication com Passport

É uma estratégia de autenticação do Passport, para HTTP Bearer. Esse módulo nos permite autenticar solicitações HTTP usando tokens de **Bearer**, conforme especificação RFC 6750. São utilizadas para proteger endpoints de uma API, e oferece suporte para utilizarmos juntamente com OAuth 2.0.


- `passport-http-bearer`  
- `passport-oauth2-jwt-bearer`  
- `express-jwt`


# Referências

- [JSON Web Tokens (JWT) com Node.js - Pre NodeConf](https://www.youtube.com/watch?v=PgAO4YhOsKw)  
- [Cookies vs Tokens - Getting auth right with Angular.JS](https://auth0.com/blog/angularjs-authentication-with-cookies-vs-token/)  
- [10 Things You Should Know about Tokens](https://auth0.com/blog/ten-things-you-should-know-about-tokens-and-cookies/)  
- [Easy Node Authentication: Setup and Local](https://scotch.io/tutorials/easy-node-authentication-setup-and-local)  
- [Easy Node Authentication: Facebook](https://scotch.io/tutorials/easy-node-authentication-facebook)  
- [Easy Node Authentication: Twitter](https://scotch.io/tutorials/easy-node-authentication-twitter)  
- [Easy Node Authentication: Google](https://scotch.io/tutorials/easy-node-authentication-google)  
- [Easy Node Authentication: Linking All Accounts Together](https://scotch.io/tutorials/easy-node-authentication-linking-all-accounts-together)  
- [Upgrading Our “Easy Node Authentication” Series to ExpressJS 4.0](https://scotch.io/tutorials/upgrading-our-easy-node-authentication-series-to-expressjs-4-0)  
- [Token based authentication in node.js using passport](https://blog.hyphe.me/token-based-authentication-with-node/)  
- [Using refresh tokens in node.js to stay authenticated](https://blog.hyphe.me/using-refresh-tokens-for-permanent-user-sessions-in-node/)  
- [Token based, sessionless auth using express and passport](https://jeroenpelgrims.com/token-based-sessionless-auth-using-express-and-passport)
