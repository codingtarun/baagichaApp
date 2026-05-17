/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USE ADDRESSES HOOK
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback } from 'react';
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type Address,
} from '../services/shopApi';

interface UseAddressesResult {
  addresses: Address[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  add: (data: Omit<Address, 'id'>) => Promise<Address>;
  update: (id: number, data: Partial<Address>) => Promise<Address>;
  remove: (id: number) => Promise<void>;
  setDefault: (id: number) => Promise<Address>;
}

export function useAddresses(): UseAddressesResult {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAddresses();
      setAddresses(data);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(
    async (data: Omit<Address, 'id'>) => {
      const address = await createAddress(data);
      await load();
      return address;
    },
    [load]
  );

  const update = useCallback(
    async (id: number, data: Partial<Address>) => {
      const address = await updateAddress(id, data);
      await load();
      return address;
    },
    [load]
  );

  const remove = useCallback(
    async (id: number) => {
      await deleteAddress(id);
      await load();
    },
    [load]
  );

  const setDefault = useCallback(
    async (id: number) => {
      const address = await setDefaultAddress(id);
      await load();
      return address;
    },
    [load]
  );

  return {
    addresses,
    loading,
    error,
    refresh: load,
    add,
    update,
    remove,
    setDefault,
  };
}
