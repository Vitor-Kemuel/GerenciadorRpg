import { supabase } from "../lib/supabaseClient";

export type Campanha = {
  id?: number;
  nome: string;
  descricao?: string;
  sistema_regras?: string;
  mestre_id?: number;
};

export async function listarCampanhas() {
  const { data, error } = await supabase
    .from("campanhas")
    .select("*")
    .order("id", { ascending: true });
  if (error) throw error;
  return data;
}

export async function criarCampanha(campanha: Campanha) {
  const { data, error } = await supabase
    .from("campanhas")
    .insert([campanha])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletarCampanha(id: number) {
  const { error } = await supabase.from("campanhas").delete().eq("id", id);
  if (error) throw error;
}
