# Ford Intel — Inteligência Competitiva Automotiva

Aplicativo mobile para analistas da Ford acompanharem fichas técnicas de veículos concorrentes com dados padronizados e comparação lado a lado.

## Funcionalidades

- **Busca de veículos** — marca, modelo, versão e ano com sugestões automáticas
- **Ficha técnica padronizada** — motor, dimensões, eficiência, segurança, tecnologia e preço FIPE
- **Preço em tempo real** — integração com a API pública FIPE
- **Comparação lado a lado** — dois veículos com destaque para o vencedor em cada métrica
- **Histórico com filtros** — por categoria, favoritos e gráfico de preços comparados
- **Alertas de preço** — notificações locais para veículos salvos

## Stack

- Expo SDK 54 + Expo Router v6
- TypeScript (strict)
- Zustand + AsyncStorage
- Expo Notifications
- API FIPE — `parallelum.com.br/fipe/api/v1`

## Como rodar

```bash
npm install
npx expo start
```

Credenciais demo: `analista@ford.com` / `ford2026`

## Participantes

| Nome | RM |
|---|---|
| Guilherme Barbiero | RM555185 |
| Marco Antonio Gonçalves | RM556818 |
| Vinicius Castro | RM556137 |
| Camila Mie Takara | RM555418 |
| Matheus Cantiere | RM558479 |
