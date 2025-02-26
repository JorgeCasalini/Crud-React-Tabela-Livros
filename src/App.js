import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import Menu from "./components/Menu";
import TabelaLivros from "./components/TabelaLivros";
import CadastrarLivros from "./components/CadastrarLivros";
import NotFound from "./components/NotFound";
import SimpleStorage from "react-simple-storage";

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
  state = { livros: [] };

  componentDidMount() {
    // Quando o componente é montado, verificamos se existem livros armazenados no localStorage
    const livrosSalvos = localStorage.getItem('livros');
    if (livrosSalvos) {
      this.setState({ livros: JSON.parse(livrosSalvos) });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Sempre que o estado de livros mudar, vamos salvar os livros no localStorage
    if (prevState.livros !== this.state.livros) {
      localStorage.setItem('livros', JSON.stringify(this.state.livros));
    }
  }

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
    if (window.confirm("Remover esse livro?")) {
      const livros = this.state.livros.filter(p => p.isbn !== livro.isbn);
      this.setState({ livros });
    }
  };

  render() {
    return (
      <Router>
        {/* SimpleStorage permite persistir automaticamente o estado */}
        <SimpleStorage parent={this} /> 
        <Menu />
        <Routes>
          <Route
            path="/"
            element={<TabelaLivros livros={this.state.livros} removerLivro={this.removerLivro} />}
          />
          <Route
            path="/cadastrar"
            element={<CadastrarLivros inserirLivro={this.inserirLivro} livro={{ id: 0, isbn: "", titulo: "", autor: "" }} />}
          />
          <Route
            path="/editar/:isbnLivro"
            element={<EditarLivro livros={this.state.livros} editarLivro={this.editarLivro} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
