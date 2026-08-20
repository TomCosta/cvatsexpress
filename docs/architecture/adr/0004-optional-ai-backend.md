# ADR 0004 — Optional AI Backend

Status: Accepted — 2026-08-16

## Context

IA exige processamento remoto e pode lidar com dados pessoais; o produto principal não precisa dela.

## Decision

Manter `ai=false` por padrão. Futuro serviço de IA terá adapter disabled e remote. Chaves vivem apenas no servidor; envio exige aviso e ação clara do usuário. O backend não armazenará currículos nem registrará conteúdo integral.

## Consequences

Nenhum backend ou SDK de IA existe no MVP inicial. O app continua funcional quando o recurso é removido ou indisponível.
