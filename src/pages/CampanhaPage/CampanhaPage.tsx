import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "./CampanhaPage.module.css";
import PersonagemPage from "../PersonagemPage/PersonagemPage";
import MissoesPage from "../MissoesPage/MissoesPage";

type CampanhaPageProps = {
  campanhaId: number;
  onVoltar: () => void;
};

type Campanha = {
  id: number;
  nome: string;
  descricao?: string;
};

type Personagem = {
  id: number;
  nome: string;
  classe?: string;
  nivel?: number;
};

type Missao = {
  id: number;
  titulo: string;
  descricao?: string;
};

type Local = {
  id: number;
  nome: string;
  descricao?: string;
};

export default function CampanhaPage({ campanhaId, onVoltar }: CampanhaPageProps) {
  const [campanha, setCampanha] = useState<Campanha | null>(null);
  const [personagens, setPersonagens] = useState<Personagem[]>([]);
  const [missoes, setMissoes] = useState<Missao[]>([]);
  const [locais, setLocais] = useState<Local[]>([]);

  // Novos estados para os formulários
  const [novoPersonagemNome, setNovoPersonagemNome] = useState("");
  const [novoPersonagemClasse, setNovoPersonagemClasse] = useState("");
  const [novoPersonagemNivel, setNovoPersonagemNivel] = useState<number>(1);

  const [novaMissaoTitulo, setNovaMissaoTitulo] = useState("");
  const [novaMissaoDescricao, setNovaMissaoDescricao] = useState("");

  const [novoLocalNome, setNovoLocalNome] = useState("");
  const [novoLocalDescricao, setNovoLocalDescricao] = useState("");

  const [personagemSelecionado, setPersonagemSelecionado] = useState<number | null>(null);

  const [abrirMissoes, setAbrirMissoes] = useState(false);

  async function carregarDados() {
    const { data: campanhaData } = await supabase
      .from("campanhas")
      .select("*")
      .eq("id", campanhaId)
      .single();
    setCampanha(campanhaData);

    const { data: personagensData } = await supabase
      .from("personagens")
      .select("*")
      .eq("campanha_id", campanhaId);
    setPersonagens(personagensData || []);

    const { data: missoesData } = await supabase
      .from("missoes")
      .select("*")
      .eq("campanha_id", campanhaId);
    setMissoes(missoesData || []);

    const { data: locaisData } = await supabase
      .from("locais")
      .select("*")
      .eq("campanha_id", campanhaId);
    setLocais(locaisData || []);
  }

  useEffect(() => {
    carregarDados();
  }, [campanhaId]);

  async function criarPersonagem() {
    if (!novoPersonagemNome.trim()) return alert("Nome do personagem é obrigatório");
    await supabase.from("personagens").insert([{
      nome: novoPersonagemNome,
      classe: novoPersonagemClasse || null,
      nivel: novoPersonagemNivel || 1,
      campanha_id: campanhaId,
    }]);
    setNovoPersonagemNome("");
    setNovoPersonagemClasse("");
    setNovoPersonagemNivel(1);
    carregarDados();
  }

  async function criarMissao() {
    if (!novaMissaoTitulo.trim()) return alert("Título da missão é obrigatório");
    await supabase.from("missoes").insert([{
      titulo: novaMissaoTitulo,
      descricao: novaMissaoDescricao || null,
      campanha_id: campanhaId,
    }]);
    setNovaMissaoTitulo("");
    setNovaMissaoDescricao("");
    carregarDados();
  }

  if (abrirMissoes) {
    return <MissoesPage campanhaId={campanhaId} onVoltar={() => setAbrirMissoes(false)} />;
  }

  async function criarLocal() {
    if (!novoLocalNome.trim()) return alert("Nome do local é obrigatório");
    await supabase.from("locais").insert([{
      nome: novoLocalNome,
      descricao: novoLocalDescricao || null,
      campanha_id: campanhaId,
    }]);
    setNovoLocalNome("");
    setNovoLocalDescricao("");
    carregarDados();
  }

  if (personagemSelecionado) {
    return (
      <PersonagemPage
        personagemId={personagemSelecionado}
        onVoltar={() => setPersonagemSelecionado(null)}
      />
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={onVoltar} className={styles.voltarBtn}>
        ← Voltar
      </button>

      {campanha && (
        <>
          <h1>{campanha.nome}</h1>
          {campanha.descricao && <p>{campanha.descricao}</p>}
        </>
      )}

      <section className={styles.section}>
        <h2>Personagens</h2>
        <ul className={styles.lista}>
          {personagens.length > 0 ? (
            personagens.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => setPersonagemSelecionado(p.id)}
                  className={styles.linkButton}
                  type="button"
                >
                  {p.nome} {p.classe && `(${p.classe})`} {p.nivel && `- Nível ${p.nivel}`}
                </button>
              </li>

            ))
          ) : (
            <p>Nenhum personagem.</p>
          )}
        </ul>
        <div className={styles.formGroup}>
          <input
            placeholder="Nome do personagem"
            value={novoPersonagemNome}
            onChange={(e) => setNovoPersonagemNome(e.target.value)}
            className={styles.input}
          />
          <input
            placeholder="Classe"
            value={novoPersonagemClasse}
            onChange={(e) => setNovoPersonagemClasse(e.target.value)}
            className={styles.input}
          />
          <input
            type="number"
            min={1}
            placeholder="Nível"
            value={novoPersonagemNivel}
            onChange={(e) => setNovoPersonagemNivel(Number(e.target.value))}
            className={styles.input}
          />
          <button onClick={criarPersonagem} className={styles.button}>
            Adicionar Personagem
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <button
          onClick={() => setAbrirMissoes(true)}
          className={styles.linkButton}
          type="button"
        >
          <h2>Missões</h2>
        </button>

      </section>

      <section className={styles.section}>
        <h2>Locais</h2>
        <ul className={styles.lista}>
          {locais.length > 0 ? (
            locais.map((l) => (
              <li key={l.id}>
                {l.nome} {l.descricao && `- ${l.descricao}`}
              </li>
            ))
          ) : (
            <p>Nenhum local.</p>
          )}
        </ul>
        <div className={styles.formGroup}>
          <input
            placeholder="Nome do local"
            value={novoLocalNome}
            onChange={(e) => setNovoLocalNome(e.target.value)}
            className={styles.input}
          />
          <input
            placeholder="Descrição"
            value={novoLocalDescricao}
            onChange={(e) => setNovoLocalDescricao(e.target.value)}
            className={styles.input}
          />
          <button onClick={criarLocal} className={styles.button}>
            Adicionar Local
          </button>
        </div>
      </section>
    </div>
  );
}
