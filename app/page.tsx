import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import React from "react";

const Home=()=>{ 
  return (

  <Container className="bg-shop-light-pink">
    <h2 className="text-xl font-semibold">Home</h2>
    <p>IT is a website for car accessories</p>
    <Button> check out</Button>
  </Container>
  );
};

export default Home;