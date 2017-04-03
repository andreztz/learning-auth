# Autenticação e Autorização com NodeJS

**Autenticação** é permitir que os usuários loguem nos sistemas, que se autentiquem. Seja por meio de usuário e senha ou através de um perfil de redes sociais.

**Autorização** atribui papéis aos usuários, ou seja, o que ele poderá ou não fazer no sistema após estar autenticado. (ACL)


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
