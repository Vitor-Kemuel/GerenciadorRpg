import { supabase } from "../lib/supabaseClient";

export type Personagem = {
  id?: number;
  nome: string;
  classe?: string;
  nivel?: number;
  raca?: string;
  pontos_vida?: number;
  atributos?: Record<string, number>;
  inventario?: Record<string, any>;
  jogador_id?: number;
  campanha_id?: number;
};

export async function listarPersonagens(campanhaId?: number) {
  let query = supabase.from("personagens").select("*");
  if (campanhaId) query = query.eq("campanha_id", campanhaId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function criarPersonagem(personagem: Personagem) {
  const { data, error } = await supabase
    .from("personagens")
    .insert([personagem])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletarPersonagem(id: number) {
  const { error } = await supabase.from("personagens").delete().eq("id", id);
  if (error) throw error;
}
