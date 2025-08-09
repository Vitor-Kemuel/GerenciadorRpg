import { useEffect, useState } from "react";
import { listarCampanhas, criarCampanha } from "../services/campanhasService";

export default function Campanhas() {
  const [campanhas, setCampanhas] = useState<any[]>([]);
  const [nome, setNome] = useState("");

  useEffect(() => {
    carregarCampanhas();
  }, []);

  async function carregarCampanhas() {
    const lista = await listarCampanhas();
    setCampanhas(lista);
  }

  async function adicionarCampanha() {
    if (!nome.trim()) return;
    await criarCampanha({ nome });
    setNome("");
    carregarCampanhas();
  }

  return (
    <div>
      <h1>Campanhas</h1>
      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome da campanha"
      />
      <button onClick={adicionarCampanha}>Adicionar</button>
      <ul>
        {campanhas.map((c) => (
          <li key={c.id}>{c.nome}</li>
        ))}
      </ul>
    </div>
  );
}
