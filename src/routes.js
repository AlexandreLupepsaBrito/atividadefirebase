import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import  Home  from "./pages/Home";
import  Verdura  from "./pages/Verdura";
import  Fruta  from "./pages/Fruta";
import  Legume  from "./pages/Legume";
import  Hortalica  from "./pages/Hortalica";
import  Outro from "./pages/Outro";
import  Paginapd  from "./pages/Paginapd";


import  Carrinho  from "./pages/Carrinho";
import  Login  from "./pages/Login";

import  Header  from "./conponents/Header";
import  Footer  from "./conponents/Footer";
import SearchResults from './pages/SearchResults';


function RoutesApp(){   
    return(
        
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Verdura" element={<Verdura />} />
                <Route path="/Fruta" element={<Fruta />} />
                <Route path="/Legume" element={<Legume />} />
                <Route path="/Hortalica" element={<Hortalica />} />
                <Route path="/Outro" element={<Outro />} />
                <Route path="/Paginapd/:id" element={<Paginapd />} />
                <Route path="/Carrinho" element={<Carrinho />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/search/:query" element={<SearchResults />} />
            </Routes>
            <Footer />
            
        </BrowserRouter>
    );
}

export default RoutesApp;