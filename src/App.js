import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import Menu from "./components/Menu";
import TabelaLivros from "./components/TabelaLivros";
import CadastrarLivros from "./components/CadastrarLivros";
import NotFound from "./components/NotFound";

// Componente para edição de livro usando o hook useParams
const EditarLivro = ({ livros, editarLivro }) => {
  const { isbnLivro } = useParams();  // Obtendo o isbn da URL
  const livro = livros.find(livro => livro.isbn === isbnLivro); // Encontrando o livro com o ISBN

  if (!livro) {
    return <Navigate to="/" />; // Redireciona se o livro não for encontrado
  }

  return (
    <CadastrarLivros editarLivro={editarLivro} livro={livro} />
  );
};

class App extends Component {
  state = {
    livros: [
      {
        id: 1,
        isbn: "978-85-7522-403-8",
        titulo: "HTML5 - 2° Edição",
        autor: "Maurício Samy Silva"
      },
      {
        id: 2,
        isbn: "978-85-7522-807-4",
        titulo: "Introdução ao Pentest",
        autor: "Daniel Moreno"
      },
      {
        id: 3,
        isbn: "978-85-7522-780-8",
        titulo: "Internet das Coisas para Desenvolvedores",
        autor: "Ricardo da Silva Ogliari"
      }
    ]
  };

  inserirLivro = livro => {
    livro.id = this.state.livros.length + 1;
    this.setState({
      livros: [...this.state.livros, livro]
    });
  };

  editarLivro = livroEditado => {
    this.setState(prevState => ({
      livros: prevState.livros.map(livro =>
        livro.id === livroEditado.id ? { ...livroEditado } : livro
      )
    }));
  };


  removerLivro = livro => {
    if (window.confirm("Remover esse livro ?")) {
      const livros = this.state.livros.filter(p => p.isbn !== livro.isbn);
      this.setState({ livros });
    }
  };

  render() {
    return (
      <Router>
        <Menu />
        <Routes>
          <Route path="/" element={<TabelaLivros
            livros={this.state.livros}
            removerLivro={this.removerLivro} />
          } />
          <Route path="/cadastrar" element={<CadastrarLivros
            inserirLivro={this.inserirLivro}
            livro={{ id: 0, isbn: "", titulo: "", autor: "" }} />} />
          <Route path="/editar/:isbnLivro" element={<EditarLivro
            livros={this.state.livros}
            editarLivro={this.editarLivro} />}
            />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
