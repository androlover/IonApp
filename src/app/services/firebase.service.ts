
import { Injectable } from '@angular/core';
import { Database, ref, push, set, get, child } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private db: Database) {
      console.log('🔥 FirebaseService initialized with DB:', db);
  }

  // ✅ Push data to a list-like collection (auto-generated key)
  pushData(path: string, data: any): Promise<void> {
    const newRef = push(ref(this.db, path)); // auto-increment style
    return set(newRef, data)
      .then(() => console.log(`✅ Data added at dynamic path: ${path}/${newRef.key}`))
      .catch((err) => console.error(`❌ Push error at ${path}:`, err));
  }

  // ✅ Read all items from a list path
  readAll(path: string): Promise<any> {
    const dbRef = ref(this.db);
    return get(child(dbRef, path))
      .then(snapshot => {
        if (snapshot.exists()) {
          console.log(`📥 Data from ${path}:`, snapshot.val());
          return snapshot.val();
        } else {
          console.warn(`⚠️ No data at ${path}.`);
          return null;
        }
      })
      .catch(err => {
        console.error(`❌ Error reading from ${path}:`, err);
        throw err;
      });
  }
}
