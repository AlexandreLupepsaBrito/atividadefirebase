import React from 'react';
import { Link } from 'react-router-dom';
import { data } from '../../data';

function SearchResults() {
  const searchQuery = window.location.pathname.split('/').pop(); // pega parte final do caminho URL assumindo que é o termo de busca
  const filteredData = data.filter((produto) => produto.name.toLowerCase().includes(searchQuery.toLowerCase())); // divide a URL pelo caractere e pega o último segmento 

  return (
    <div className="container-carrinho">
      <div className="search-results-container">
        <h1>Resultados de busca para "{searchQuery}"</h1>
        <ul className="search-results-list">
          {filteredData.map((produto) => (
            <li key={produto.id}>
              <div className="col-12">
                <div className="row">
                    <div key={searchQuery} className="produto-container-prisncipal"> 
                      <div className="produto-prisncipal">
                        <Link to={`/paginapd/${produto.id}`} >
                          <img src={produto.image} alt={produto.name} className="img-fluid" />
                        </Link>
                        <span>{produto.name}</span>
                        <span>
                          R$ <span className="price">{produto.price}</span> <span className="unit">{produto.unit}</span>
                        </span>
                      </div>
                    </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {filteredData.length === 0 && (
          <p>Nenhum resultado encontrado para "{searchQuery}"</p>
        )}
      </div>
    </div>
  );
}

export default SearchResults;