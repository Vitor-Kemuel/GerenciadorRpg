import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "./HomePage.module.css";
import CampanhaPage from "../CampanhaPage/CampanhaPage";

type HomePageProps = {
  email: string;
};

type Campanha = {
  id: number;
  nome: string;
  descricao?: string;
};

export default function HomePage({ email }: HomePageProps) {
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [novaCampanha, setNovaCampanha] = useState("");
  const [loading, setLoading] = useState(false);
  const [campanhaSelecionada, setCampanhaSelecionada] = useState<number | null>(null);

  async function carregarCampanhas() {
    const { data, error } = await supabase
      .from("campanhas")
      .select("*")
      .order("id", { ascending: true });
    if (!error && data) {
      setCampanhas(data);
    }
  }

  async function criarCampanha() {
    if (!novaCampanha.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("campanhas").insert([{ nome: novaCampanha }]);
    setLoading(false);
    if (!error) {
      setNovaCampanha("");
      carregarCampanhas();
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  useEffect(() => {
    carregarCampanhas();
  }, []);

  if (campanhaSelecionada) {
    return (
      <CampanhaPage
        campanhaId={campanhaSelecionada}
        onVoltar={() => setCampanhaSelecionada(null)}
      />
    );
  }

  return (
    <div className={styles.container}>
      <h1>Bem-vindo(a), {email}!</h1>
      <p>Gerencie suas campanhas de RPG 🎲</p>

      <div className={styles.menu}>
        <input
          type="text"
          placeholder="Nome da nova campanha"
          value={novaCampanha}
          onChange={(e) => setNovaCampanha(e.target.value)}
          className={styles.input}
        />
        <button onClick={criarCampanha} className={styles.button} disabled={loading}>
          {loading ? "Criando..." : "Criar Campanha"}
        </button>
      </div>

      <h2>Suas Campanhas</h2>
      <ul className={styles.lista}>
        {campanhas.length > 0 ? (
          campanhas.map((c) => (
            <li key={c.id} onClick={() => setCampanhaSelecionada(c.id)}>
              {c.nome}
            </li>
          ))
        ) : (
          <p>Nenhuma campanha encontrada.</p>
        )}
      </ul>

      <button onClick={handleLogout} className={styles.logoutButton}>
        Sair
      </button>
    </div>
  );
}
