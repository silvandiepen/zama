import React, { useEffect, useMemo, useReducer } from "react";
import type { ApiKey, CreateApiKeyInput } from "@/types/apikey";
import { dbCreateKey, dbDeleteKey, dbGetKeys, dbRevokeKey, dbUpdateKey, dbRegenerateKey, dbDecryptKey } from "@/services/mockDb";
import { Ctx } from './keys.context';
import { STORAGE_KEY, type KeysState, type Action } from './keys.model';

function reducer(state: KeysState, action: Action): KeysState {
  switch (action.type) {
    case "loading":
      return { ...state, loading: action.value };
    case "set":
      return { ...state, items: action.items };
    case "add":
      return { ...state, items: [action.item, ...state.items] };
    case "remove":
      return { ...state, items: state.items.filter((k) => k.id !== action.id) };
    case "update":
      return {
        ...state,
        items: state.items.map((k) => (k.id === action.item.id ? action.item : k)),
      };
    default:
      return state;
  }
}

export const KeysProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { loading: false, items: [] }, (initial) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...initial, ...(JSON.parse(raw) as KeysState) } : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    // initial load from mock DB
    loadKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadKeys = async () => {
    dispatch({ type: "loading", value: true });
    const items = await dbGetKeys();
    dispatch({ type: "set", items });
    dispatch({ type: "loading", value: false });
  };

  const createKey = async (input: CreateApiKeyInput) => {
    dispatch({ type: "loading", value: true });
    const item = await dbCreateKey(input);
    dispatch({ type: "add", item });
    dispatch({ type: "loading", value: false });
    return item;
  };

  const deleteKey = async (id: string) => {
    dispatch({ type: "loading", value: true });
    await dbDeleteKey(id);
    dispatch({ type: "remove", id });
    dispatch({ type: "loading", value: false });
  };

  const revokeKey = async (id: string) => {
    dispatch({ type: "loading", value: true });
    const item = await dbRevokeKey(id);
    if (item) dispatch({ type: "update", item });
    dispatch({ type: "loading", value: false });
    return item;
  };

  const updateKey = async (partial: Partial<ApiKey> & { id: string }) => {
    dispatch({ type: "loading", value: true });
    const item = await dbUpdateKey(partial);
    if (item) dispatch({ type: "update", item });
    dispatch({ type: "loading", value: false });
    return item;
  };

  const regenerateKey = async (id: string) => {
    dispatch({ type: "loading", value: true });
    const item = await dbRegenerateKey(id);
    if (item) dispatch({ type: "update", item });
    dispatch({ type: "loading", value: false });
    return item;
  };

  const decryptKey = async (id: string): Promise<string | null> => {
    return await dbDecryptKey(id);
  };

  const value = useMemo(() => ({ state, loadKeys, createKey, deleteKey, revokeKey, updateKey, regenerateKey, decryptKey }), [state]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};