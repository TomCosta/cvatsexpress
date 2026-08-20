# ADR 0001 — Offline First

Status: Accepted — 2026-08-16

## Context

O currículo contém dados pessoais e o fluxo precisa ser rápido, privado e disponível sem conexão.

## Decision

Criação, edição, storage, templates, ATS Score, PDF e gestão funcionarão localmente. Rede nunca será pré-condição do fluxo principal.

## Consequences

Adapters locais são padrão. Falhas ou remoção de backend não quebram o MVP. Sincronização multi-dispositivo fica fora do MVP.
