import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Component/Home/Home"
import Plan from "./Component/CookingPlan/CookingPlan"
import Challenge from "./Component/Challenge/challenge"
import Recipe from "./Component/RecipeManagement/Recipe"
import Login from "./Component/Login/Login";
import Profile from "./Component/Login/Profile";
import UserList from "./Component/Login/UserList";
import { GoogleOAuthProvider } from '@react-oauth/google';


function App() {
  return (
    <GoogleOAuthProvider clientId="30251687755-nsd5v8ruas9a0ookq7rj108oi28qkoib.apps.googleusercontent.com">
    <div >
      <React.Fragment>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/challenge" element={<Challenge />} />
        <Route path="/recipe" element={<Recipe />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users" element={<UserList />} />
        </Routes>
      </React.Fragment>
    
    </div>
    </GoogleOAuthProvider>
  );
}

export default App;
