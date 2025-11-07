import "./App.css";
import { Button } from "./composants/Button";

function App() {

  return (
    <>
      <div>
        <p className="text-3xl font-bold underline">hello word</p>
      </div>
       <div className="flex flex-rows gap-4 items-center justify-center bg-gray-50">
        <Button>Default</Button>
        <Button variant="secondary">Secondaire</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="danger">Supprimer</Button>
        <Button variant="ghost">Ghost</Button>
        <Button size="lg" variant="primary">
          Grand Bouton
        </Button>
    </div>
    </>
  );
}

export default App;
