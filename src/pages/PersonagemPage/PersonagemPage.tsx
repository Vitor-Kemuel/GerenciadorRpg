import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "./PersonagemPage.module.css";

type PersonagemPageProps = {
  personagemId: number;
  onVoltar: () => void;
};

type Atributos = {
  forca: number;
  destreza: number;
  constituicao: number;
  inteligencia: number;
  sabedoria: number;
  carisma: number;
};

type Inventario = {
  itens: string[];
};

type Personagem = {
  id: number;
  nome: string;
  classe?: string;
  nivel?: number;
  atributos?: Atributos;
  inventario?: Inventario;
};

export default function PersonagemPage({ personagemId, onVoltar }: PersonagemPageProps) {
  const [personagem, setPersonagem] = useState<Personagem | null>(null);

  // Formulário completo
  const [form, setForm] = useState({
    nome: "",
    classe: "",
    nivel: 1,
    atributos: {
      forca: 10,
      destreza: 10,
      constituicao: 10,
      inteligencia: 10,
      sabedoria: 10,
      carisma: 10,
    } as Atributos,
    inventario: {
      itens: [] as string[],
    } as Inventario,
  });

  const [novoItemInventario, setNovoItemInventario] = useState("");

  async function carregarDados() {
    const { data: p, error } = await supabase
      .from("personagens")
      .select("*")
      .eq("id", personagemId)
      .single();

    if (error) {
      alert("Erro ao carregar personagem: " + error.message);
      return;
    }

    if (p) {
      setPersonagem(p);
      setForm({
        nome: p.nome || "",
        classe: p.classe || "",
        nivel: p.nivel || 1,
        atributos: p.atributos || {
          forca: 10,
          destreza: 10,
          constituicao: 10,
          inteligencia: 10,
          sabedoria: 10,
          carisma: 10,
        },
        inventario: p.inventario || { itens: [] },
      });
    }
  }

  useEffect(() => {
    carregarDados();
  }, [personagemId]);

  function handleAtributoChange(nome: keyof Atributos, valor: number) {
    setForm((f) => ({
      ...f,
      atributos: {
        ...f.atributos,
        [nome]: valor,
      },
    }));
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    if (name === "nivel") {
      setForm((f) => ({ ...f, nivel: Number(value) }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  async function salvarPersonagem() {
    const { error } = await supabase
      .from("personagens")
      .update({
        nome: form.nome,
        classe: form.classe,
        nivel: form.nivel,
        atributos: form.atributos,
        inventario: form.inventario,
      })
      .eq("id", personagemId);

    if (error) {
      alert("Erro ao salvar: " + error.message);
    } else {
      alert("Personagem salvo com sucesso!");
      carregarDados();
    }
  }

  function adicionarItemInventario() {
    const item = novoItemInventario.trim();
    if (!item) return alert("Nome do item é obrigatório");
    setForm((f) => ({
      ...f,
      inventario: {
        itens: [...f.inventario.itens, item],
      },
    }));
    setNovoItemInventario("");
  }

  function removerItemInventario(index: number) {
    setForm((f) => ({
      ...f,
      inventario: {
        itens: f.inventario.itens.filter((_, i) => i !== index),
      },
    }));
  }

  return (
    <div className={styles.container}>
      <button onClick={onVoltar} className={styles.voltarBtn}>← Voltar</button>

      <h1>Gerenciar Personagem</h1>

      <div className={styles.formGroup}>
        <label>Nome</label>
        <input
          name="nome"
          value={form.nome}
          onChange={handleInputChange}
          className={styles.input}
          type="text"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Classe</label>
        <input
          name="classe"
          value={form.classe}
          onChange={handleInputChange}
          className={styles.input}
          type="text"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Nível</label>
        <input
          name="nivel"
          value={form.nivel}
          onChange={handleInputChange}
          className={styles.input}
          type="number"
          min={1}
        />
      </div>

      <h2>Atributos</h2>
      <div className={styles.atributosGrid}>
        {(Object.keys(form.atributos) as (keyof Atributos)[]).map((attr) => (
          <div key={attr} className={styles.formGroup}>
            <label>{attr.charAt(0).toUpperCase() + attr.slice(1)}</label>
            <input
              type="number"
              min={1}
              value={form.atributos[attr]}
              onChange={(e) => handleAtributoChange(attr, Number(e.target.value))}
              className={styles.input}
            />
          </div>
        ))}
      </div>

      <h2>Inventário</h2>
      <ul className={styles.lista}>
        {form.inventario.itens.length > 0 ? (
          form.inventario.itens.map((item, i) => (
            <li key={i}>
              {item}{" "}
              <button
                className={styles.removerBtn}
                onClick={() => removerItemInventario(i)}
                type="button"
              >
                Remover
              </button>
            </li>
          ))
        ) : (
          <p>Inventário vazio.</p>
        )}
      </ul>

      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder="Novo item"
          value={novoItemInventario}
          onChange={(e) => setNovoItemInventario(e.target.value)}
          className={styles.input}
        />
        <button onClick={adicionarItemInventario} className={styles.button} type="button">
          Adicionar Item
        </button>
      </div>

      <button onClick={salvarPersonagem} className={styles.button}>
        Salvar Personagem
      </button>
    </div>
  );
}
