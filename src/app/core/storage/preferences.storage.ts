import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

import { KeyValueStorage } from './key-value.storage';

@Injectable()
export class PreferencesStorage extends KeyValueStorage {
  override async get(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key });
    return value;
  }

  override async set(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value });
  }

  override async remove(key: string): Promise<void> {
    await Preferences.remove({ key });
  }
}
