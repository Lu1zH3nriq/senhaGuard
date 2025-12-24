import { useEffect, useState } from "react";
import Realm from "realm";

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
export function getRealm() {
  if (!realmInstance) {
    realmInstance = new Realm({ schema: [Password] });
  }
  return realmInstance;
}

export function getPasswords() {
  const realm = getRealm();
  return realm.objects<Password>("Password").sorted("createdAt", true);
}

export function addPassword(data: Omit<Password, "_id" | "createdAt">) {
  const realm = getRealm();
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

export function updatePassword(id: Realm.BSON.ObjectId, data: Partial<Password>) {
  const realm = getRealm();
  realm.write(() => {
    const pwd = realm.objectForPrimaryKey<Password>("Password", id);
    if (pwd) Object.assign(pwd, data);
  });
}

export function removePassword(id: Realm.BSON.ObjectId) {
  const realm = getRealm();
  realm.write(() => {
    const pwd = realm.objectForPrimaryKey<Password>("Password", id);
    if (pwd) realm.delete(pwd);
  });
}

export function getPasswordById(id: Realm.BSON.ObjectId): Password | undefined {
  const realm = getRealm();
  return realm.objectForPrimaryKey<Password>("Password", id) ?? undefined;
}

export function usePasswords(): Password[] {
  const [passwords, setPasswords] = useState<Password[]>([]);
  useEffect(() => {
    const realm = getRealm();
    const results = realm.objects<Password>("Password").sorted("createdAt", true);
    setPasswords([...results]);
    const listener = () => setPasswords([...results]);
    results.addListener(listener);
    return () => {
      results.removeListener(listener);
      // Não feche o realm globalmente aqui
    };
  }, []);
  return passwords;
}
