# ADR 0003 — PDF Generation

Status: Accepted — 2026-08-17

## Context

O arquivo precisa ser profissional, imprimível e conter texto selecionável; captura de tela não atende.

## Decision

Mapear `Resume` e template para uma definição pdfmake 0.3 pura. Carregar o adapter no preview lazy, baixar no browser e, no Android, escrever base64 em `Directory.Cache/shared` antes de chamar Share.

## Consequences

O PDF contém texto selecionável e não depende do DOM. O chunk lazy de preview cresce, mas não penaliza o carregamento inicial. A definição tem testes de conteúdo; abertura/compartilhamento ainda exigem validação em dispositivo.
