import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import Realm from "realm";

const ENCRYPTION_KEY_STORAGE = "senhaguard_encryption_key";

export class Password extends Realm.Object<Password> {
  _id!: Realm.BSON.ObjectId;
  titulo!: string;
  usuario!: string;
  senha!: string;
  url?: string;
  createdAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: "Password",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      titulo: "string",
      usuario: "string",
      senha: "string",
      url: "string?",
      createdAt: "date",
    },
  };
}

let realmInstance: Realm | null = null;

async function getOrCreateEncryptionKey(): Promise<Uint8Array> {
  try {
    let keyString = await SecureStore.getItemAsync(ENCRYPTION_KEY_STORAGE);
    if (!keyString) {
      // Gerar uma chave aleatória de 64 bytes (512 bits)
      const key = new Uint8Array(64);
      for (let i = 0; i < key.length; i++) {
        key[i] = Math.floor(Math.random() * 256);
      }
      keyString = Buffer.from(key).toString("base64");
      await SecureStore.setItemAsync(ENCRYPTION_KEY_STORAGE, keyString);
      return key;
    }
    return new Uint8Array(Buffer.from(keyString, "base64"));
  } catch (error) {
    console.warn("SecureStore não disponível, usando Realm sem criptografia:", error);
    // Fallback para modo sem criptografia se SecureStore falhar
    return new Uint8Array(64);
  }
}

export async function getRealm(): Promise<Realm> {
  if (!realmInstance) {
    const encryptionKey = await getOrCreateEncryptionKey();
    realmInstance = new Realm({ schema: [Password], encryptionKey });
  }
  return realmInstance;
}

export async function getPasswords() {
  const realm = await getRealm();
  return realm.objects<Password>("Password").sorted("createdAt", true);
}

export async function addPassword(data: Omit<Password, "_id" | "createdAt">) {
  const realm = await getRealm();
  let created;
  realm.write(() => {
    created = realm.create("Password", {
      _id: new Realm.BSON.ObjectId(),
      ...data,
      createdAt: new Date(),
    });
  });
  return created;
}

export async function updatePassword(id: Realm.BSON.ObjectId, data: Partial<Password>) {
  const realm = await getRealm();
  realm.write(() => {
    const pwd = realm.objectForPrimaryKey<Password>("Password", id);
    if (pwd) Object.assign(pwd, data);
  });
}

export async function removePassword(id: Realm.BSON.ObjectId) {
  const realm = await getRealm();
  realm.write(() => {
    const pwd = realm.objectForPrimaryKey<Password>("Password", id);
    if (pwd) realm.delete(pwd);
  });
}

export async function getPasswordById(id: Realm.BSON.ObjectId): Promise<Password | undefined> {
  const realm = await getRealm();
  return realm.objectForPrimaryKey<Password>("Password", id) ?? undefined;
}

export function usePasswords(): Password[] {
  const [passwords, setPasswords] = useState<Password[]>([]);
  useEffect(() => {
    let mounted = true;
    getRealm().then((realm) => {
      if (!mounted) return;
      const results = realm.objects<Password>("Password").sorted("createdAt", true);
      setPasswords([...results]);
      const listener = () => setPasswords([...results]);
      results.addListener(listener);
      return () => {
        results.removeListener(listener);
      };
    });
    return () => {
      mounted = false;
    };
  }, []);
  return passwords;
}
