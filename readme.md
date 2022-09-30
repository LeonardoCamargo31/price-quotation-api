# Price quotation API

## Índice
- [Sobre](#-sobre)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e execução](#-instalação-e-execução)
- [Tecnologias](#-tecnologias)
- [Testes](#-testes)

## 💻 Sobre
API para busca de cotação de preço de quartos disponíveis em um determinado hotel. Para isso é preciso informar somente a data de check-in e check-out, e a API retornará os quartos disponíveis.

### Request
`POST /search`

```
curl -X POST http://localhost:3000/search 
  -H 'Content-Type: application/json'  
  -d '{"checkin": "2022-11-26", "checkout": "2022-11-30"}'
```
```json
{
  "checkin": "YYYY-MM-DD",
  "checkout": "YYYY-MM-DD"
}
```


### Response
```json
[
  {
    "name": "STUDIO CASAL",
    "description": "Apartamentos no prédio principal do Resort",
    "price": "R$ 1.092,00",
    "image": "https://any.com/1/quartos/1/fotoprincipal.jpg"
  },
  {
    "name": "CABANA",
    "description": "Apartamentos pelos jardins do Resort",
    "price": "R$ 1.321,00",
    "image": "https://any.com/1/quartos/2/fotoprincipal.jpg"
  }
]
```

## 🗂 Pré-requisitos
Antes de começar, você vai precisar ter instalado:
- NodeJS >= 14

## 🔥 Instalação e execução
```bash
# Instale as dependências
npm install

# Criar arquivo .env
PORT=3000
NODE_ENV=dev

# Execute a aplicação em modo de desenvolvimento
npm run dev
```
Pronto! Projeto estará disponível em http://localhost:3000.

## 🛠 Tecnologias

As principais ferramentas usadas na construção do projeto:
- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Puppeteer](https://pptr.dev/)

## 🧪 Testes

### Testes unitários
Testes unitários utilizando o [Jest](https://jestjs.io/pt-BR/). Esses testes podem ser executados com:
```bash
npm run test:unit
```

### Testes de integração
Testes de integração utilizando o [Jest](https://jestjs.io/pt-BR/) e [SuperTest](https://github.com/visionmedia/supertest). Esses testes podem ser executados com:
```bash
npm run test:integration
```

### Cobertura de testes
Para obter a cobertura de testes pode executar o seguinte comando:
```bash
npm run test:ci
```
**importante**: Não é possível gerar cobertura de código para arquivos de teste usando o Puppeteer se o teste usar `page.$eval`, `page.$$eval` ou `page.evaluate` se a função passada for executada fora do escopo do Jest. Problema relatado em uma [issue](https://github.com/facebook/jest/issues/7962#issuecomment-495272339) no github e na própria [documentação do jest](https://jestjs.io/docs/puppeteer).

