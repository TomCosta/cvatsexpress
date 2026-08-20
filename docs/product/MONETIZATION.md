# Monetization

## Modelo planejado

Free: criação de currículo dentro de limite configurável, Classic ATS, Modern ATS, PDF, compartilhamento e ATS Score básico.

Pro futuro: currículos ilimitados, templates premium, experiência sem anúncios e recursos detalhados/adicionais.

## Estado real

Não existe `MonetizationService`, billing, compra, anúncio ou bloqueio premium implementado. A configuração contém flags desligadas para IA, anúncios, billing real e templates premium. O limite Free é apenas dado de configuração; ainda não é aplicado.

## Regras

- O MVP offline não depende de monetização.
- UI não chama Google Play Billing diretamente.
- Desenvolvimento futuro começa com um adapter mock.
- Billing real será adapter separado, testado com infraestrutura oficial da Play Store.
- Nenhuma compra será simulada como produção e nenhum segredo de assinatura será commitado.
