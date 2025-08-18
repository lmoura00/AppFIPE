# App FIPE - Consulta de Veículos

![App Icon](https://github.com/lmoura00/AppFIPE/assets/106556785/b7db97b8-9fdb-4220-83f1-9c4eef8c359e)

## 📄 Descrição

**App FIPE** é um aplicativo móvel, desenvolvido em React Native com Expo, que permite aos usuários consultar o valor de mercado de carros, motos e caminhões de acordo com a tabela FIPE. O aplicativo consome a API pública [FIPE API da Parallelum](https://parallelum.com.br/fipe/api/v1/) para obter dados atualizados sobre marcas, modelos, anos e preços de veículos.

O fluxo de navegação é intuitivo, guiando o usuário passo a passo desde a escolha do tipo de veículo até a visualização dos detalhes completos.

## ✨ Funcionalidades

* **Consulta por Tipo de Veículo:** Escolha entre Carros, Motos ou Caminhões.
* **Seleção de Marca:** Exibe uma lista de todas as marcas disponíveis para o tipo de veículo selecionado.
* **Seleção de Modelo:** Após escolher a marca, o app lista todos os modelos correspondentes.
* **Seleção de Ano:** Lista todos os anos disponíveis para um modelo específico.
* **Visualização de Detalhes:** Exibe o valor do veículo na tabela FIPE, juntamente com informações detalhadas como ano do modelo, combustível, código FIPE e mês de referência.

## 📸 Screenshots

| Tela Inicial | Seleção de Marca | Detalhes do Veículo |
| :---: | :---: | :---: |
| ![Tela Inicial](https://github.com/user-attachments/assets/da01be97-d455-4fae-861e-0df46620e0b0) | ![Seleção de Marca](https://github.com/user-attachments/assets/8ba76b75-c185-49d8-9fcb-37f1d905038f) | ![Detalhes do Veículo](https://github.com/user-attachments/assets/eb80b579-b4ad-4139-b76b-0617eb03df51) |

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando as seguintes tecnologias:

* **[React Native](https://reactnative.dev/)**: Framework para desenvolvimento de aplicativos móveis multiplataforma.
* **[Expo](https://expo.dev/)**: Plataforma e conjunto de ferramentas para facilitar o desenvolvimento com React Native.
* **[React Navigation](https://reactnavigation.org/)**: Biblioteca para gerenciamento de rotas e navegação entre telas.
* **[Axios](https://axios-http.com/)**: Cliente HTTP para realizar as requisições à API FIPE.

## 🚀 Como Executar o Projeto

Para rodar este projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/lmoura00/AppFIPE.git](https://github.com/lmoura00/AppFIPE.git)
    cd AppFIPE-f3b3b9bc13cae6afa73b41950955fc2c5d2e70cb
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Inicie o servidor de desenvolvimento do Expo:**
    ```bash
    expo start
    ```

4.  **Execute no seu dispositivo:**
    * Instale o aplicativo **Expo Go** no seu celular (Android ou iOS).
    * Escaneie o QR Code exibido no terminal para abrir o aplicativo.

## 📁 Estrutura do Projeto

A estrutura de pastas do projeto está organizada da seguinte forma para facilitar a manutenção:
```
AppFIPE/
├── assets/             # Imagens, ícones e fontes
├── Pages/              # Componentes de cada tela da aplicação
│   ├── Home.jsx        # Tela inicial de seleção de tipo de veículo
│   ├── 1.jsx           # Tela de seleção de marca
│   ├── 2.jsx           # Tela de seleção de modelo
│   ├── 3.jsx           # Tela de seleção de ano
│   └── 4.jsx           # Tela de exibição dos detalhes do veículo
├── Routes/             # Configuração da navegação
│   └── Index.jsx
├── api.js              # Configuração do Axios para a API FIPE
└── App.js              # Ponto de entrada principal da aplicação
```
