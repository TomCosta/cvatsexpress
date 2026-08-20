# ADR 0002 — Local Persistence

Status: Accepted — 2026-08-16

## Context

O volume inicial é pequeno, mas storage pode evoluir para IndexedDB, SQLite ou cloud opcional.

## Decision

Usar `ResumeRepository` como boundary. O primeiro adapter persistente usará Capacitor Preferences, JSON e envelope com `schemaVersion`.

## Consequences

Componentes não acessam Preferences. `PreferencesStorage` é substituível; mutações são serializadas. Migrações precisam ser explícitas e testadas antes de aceitar outro schema.
