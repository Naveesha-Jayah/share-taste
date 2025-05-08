import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Component/Home/Home"
import Plan from "./Component/CookingPlan/CookingPlan"
import Challenge from "./Component/Challenge/challenge"
import Recipe from "./Component/RecipeManagement/Recipe"


function App() {
  return (
    <div >
      <React.Fragment>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/challenge" element={<Challenge />} />
        <Route path="/recipe" element={<Recipe />} />
       
       
        </Routes>
      </React.Fragment>

    </div>
  );
}

export default App;
