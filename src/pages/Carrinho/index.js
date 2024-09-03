import React from 'react';
import { Link } from 'react-router-dom';

function Carrinho() {
  return (
    <div className="container-carrinho">
      <div className="box-carrinho">
        <div>
          <img src="imagens/carrinho-carrinho.png" alt="Carrinho" width="200" />
        </div>
        <div className="text-container-carrinho">
          <div className="name-carrinho">Seu Carrinho de Compras está Vazio.</div>
          <div className="texto-estra-carrinho">
            Volte as compras e Adicione ao seu Carrinho.
          </div>
          <Link to="/">Produtos</Link>
          <hr />
        </div>
      </div>
    </div>
  );
}

export default Carrinho;