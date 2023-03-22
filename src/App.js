import "./App.css";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import React from "react";
import YouTube from "react-youtube";
import Footer from "./components/footer/footer";
import Header from "./components/header/header";
import RepoMovie from "./repo/repoMovie";

function App() {
    return (
        <>
            <Header></Header>
            <RepoMovie></RepoMovie>
            <Footer></Footer>
        </>
    );
}

export default App;
