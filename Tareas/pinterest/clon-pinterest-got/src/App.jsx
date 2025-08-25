
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

function App() {
  const [personajes, setPersonajes] = useState([]);

  const traerPersonajes = async () => {
    try {
      const url = `https://thronesapi.com/api/v2/Characters`;
      const respuesta = await fetch(url);
      if (!respuesta.ok) throw new Error("Error al obtener personajes");

      const data = await respuesta.json();
      setPersonajes(data); // data ya es un array completo
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    traerPersonajes();
  }, []);

  return (
    <InfiniteScroll
      dataLength={personajes.length}
      next={() => {}} // no hay más páginas
      hasMore={false}
      loader={<h4 className="text-center mt-4">Cargando...</h4>}
      endMessage={
        <p className="text-center text-red-500 mt-10">
          <b>-------------- Este es el fin -------------</b>
        </p>
      }
    >
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 p-10">
        {personajes.map((personaje, index) => (
          <div
            className="border border-slate-400 pb-10 rounded-md shadow-xl"
            key={index}
          >
            <div className="w-full bg-blue-500">
              <img
                src={personaje.imageUrl}
                alt={personaje.fullName}
                className="w-full"
              />
            </div>
            <div className="flex flex-col p-6 gap-3">
              <h2>
                Nombre:{" "}
                <span className="font-extrabold">{personaje.fullName}</span>
              </h2>
              <p>
                Título: <span className="font-extrabold">{personaje.title}</span>
              </p>
              <p>Familia: {personaje.family}</p>
            </div>
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
}

export default App;