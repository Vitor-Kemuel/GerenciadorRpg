import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "./MissoesPage.module.css";

type MissoesPageProps = {
  campanhaId: number;
  onVoltar: () => void;
};

type Missao = {
  id: number;
  titulo: string;
  descricao: string;
  status: string; // pendente, andamento, concluida
};

export default function MissoesPage({ campanhaId, onVoltar }: MissoesPageProps) {
  const [missoes, setMissoes] = useState<Missao[]>([]);
  const [editMissao, setEditMissao] = useState<Missao | null>(null);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState("pendente");

  async function carregarMissoes() {
    const { data, error } = await supabase
      .from("missoes")
      .select("*")
      .eq("campanha_id", campanhaId)
      .order("id", { ascending: true });

    if (error) {
      alert("Erro ao carregar missões: " + error.message);
      return;
    }
    setMissoes(data || []);
  }

  useEffect(() => {
    carregarMissoes();
  }, [campanhaId]);

  function limparFormulario() {
    setTitulo("");
    setDescricao("");
    setStatus("pendente");
    setEditMissao(null);
  }

  async function salvarMissao() {
    if (!titulo.trim()) return alert("Título é obrigatório");

    if (editMissao) {
      // editar
      const { error } = await supabase
        .from("missoes")
        .update({ titulo, descricao, status })
        .eq("id", editMissao.id);

      if (error) {
        alert("Erro ao salvar missão: " + error.message);
        return;
      }
    } else {
      // criar
      const { error } = await supabase.from("missoes").insert([
        {
          titulo,
          descricao,
          status,
          campanha_id: campanhaId,
        },
      ]);

      if (error) {
        alert("Erro ao criar missão: " + error.message);
        return;
      }
    }
    limparFormulario();
    carregarMissoes();
  }

  async function excluirMissao(id: number) {
    if (!confirm("Tem certeza que quer excluir essa missão?")) return;
    const { error } = await supabase.from("missoes").delete().eq("id", id);
    if (error) {
      alert("Erro ao excluir missão: " + error.message);
      return;
    }
    carregarMissoes();
  }

  function editarMissaoForm(missao: Missao) {
    setEditMissao(missao);
    setTitulo(missao.titulo);
    setDescricao(missao.descricao);
    setStatus(missao.status);
  }

  return (
    <div className={styles.container}>
      <button onClick={onVoltar} className={styles.voltarBtn}>← Voltar</button>
      <h1>Missões da Campanha</h1>

      <div className={styles.listaMissoes}>
        {missoes.length === 0 && <p>Nenhuma missão cadastrada.</p>}
        <ul>
          {missoes.map((m) => (
            <li key={m.id} className={styles.missaoItem}>
              <div>
                <strong>{m.titulo}</strong> <em>({m.status})</em>
                <p>{m.descricao}</p>
              </div>
              <div className={styles.acoes}>
                <button
                  onClick={() => editarMissaoForm(m)}
                  className={styles.buttonEdit}
                  type="button"
                >
                  Editar
                </button>
                <button
                  onClick={() => excluirMissao(m.id)}
                  className={styles.buttonDelete}
                  type="button"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.form}>
        <h2>{editMissao ? "Editar Missão" : "Nova Missão"}</h2>
        <label>Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className={styles.input}
        />

        <label>Descrição</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className={styles.textarea}
        />

        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={styles.input}>
          <option value="pendente">Pendente</option>
          <option value="andamento">Andamento</option>
          <option value="concluida">Concluída</option>
        </select>

        <button onClick={salvarMissao} className={styles.button} type="button">
          {editMissao ? "Salvar" : "Criar"}
        </button>

        {editMissao && (
          <button onClick={limparFormulario} className={styles.buttonCancel} type="button">
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
