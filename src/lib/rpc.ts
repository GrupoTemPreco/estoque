import { isSupabaseConfigured, MISSING_ENV_MESSAGE, supabase } from '@/lib/supabase';

export function parseRpcPayload<T extends object>(raw: unknown): T | null {
  if (!raw) return null;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value || typeof value !== 'object') return null;
  return value as T;
}

export async function callEstoqueRpc<T extends object>(
  name: string,
  params: Record<string, unknown>
): Promise<T> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error(MISSING_ENV_MESSAGE);
  }

  const { data, error } = await supabase.schema('estoque').rpc(name, params);
  if (error) throw new Error(error.message);

  const payload = parseRpcPayload<T>(data);
  if (!payload) throw new Error('A RPC não devolveu um payload válido.');
  return payload;
}
