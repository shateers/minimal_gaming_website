
import { useEffect } from "react";
import HomeLayout from "../components/home/HomeLayout";

const Index = () => {
  useEffect(() => {
    document.title = "Shateer Games - Minimalist Gaming Experience";
  }, []);

  return <HomeLayout />;
};

export default Index;
