import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "./AuthPage.module.css";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [modo, setModo] = useState<"login" | "registro">("login");
  const [mensagem, setMensagem] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMensagem("");

    try {
      if (modo === "registro") {
        const { error } = await supabase.auth.signUp({ email, password: senha });
        if (error) throw error;
        setMensagem("Conta criada! Verifique seu e-mail.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) throw error;
        setMensagem("Login realizado com sucesso!");
      }
    } catch (err: any) {
      setMensagem(err.message);
    }
  }

  return (
    <div className={styles.container}>
      <h1>{modo === "login" ? "Entrar" : "Criar Conta"}</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className={styles.input}
        />

        <button type="submit" className={styles.button}>
          {modo === "login" ? "Entrar" : "Registrar"}
        </button>
      </form>

      {mensagem && (
        <p
          className={
            mensagem.includes("sucesso") || mensagem.includes("criada")
              ? styles.sucesso
              : styles.erro
          }
        >
          {mensagem}
        </p>
      )}

      <p className={styles.toggle}>
        {modo === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
        <button
          type="button"
          onClick={() => setModo(modo === "login" ? "registro" : "login")}
          className={styles.link}
        >
          {modo === "login" ? "Criar conta" : "Entrar"}
        </button>
      </p>
    </div>
  );
}
