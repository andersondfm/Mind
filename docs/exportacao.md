# Exportar e importar um desenho no MIND

O MIND troca arquitetura por um arquivo **JSON**. Você desenha, exporta, envia o arquivo e a outra pessoa importa no MIND dela. Não precisa de conta nem de servidor.

## Passar para um terceiro

1. Abra o desenho no MIND.
2. No topo, clique em **Exportar JSON**.
3. O navegador baixa um arquivo no formato:

   `mind-arquitetura-AAAA-MM-DD.json`

   Exemplo: `mind-arquitetura-2026-09-21.json`
4. Envie esse arquivo (e-mail, Slack, Teams, WhatsApp, pendrive).
5. Quem receber abre o MIND, clica em **Importar** e escolhe o `.json`.

A lousa da outra pessoa é **substituída** pelo conteúdo do arquivo. O que ela tinha aberto some. Se ela quiser guardar o desenho atual, exporta antes de importar o seu.

## O que vai no arquivo

| Conteúdo | Vai no JSON? |
|---|---|
| Componentes (React, Node, S3…) | Sim |
| Posição de cada card na lousa | Sim |
| Nome e texto de cada card | Sim |
| Links entre componentes | Sim |
| Rótulo do link (`REST`, `HTTPS`…) | Sim |
| Cor, categoria e ícone (`catalogId`) | Sim |
| Conta, senha ou dados do servidor | Não |
| Histórico de undo | Não |

O arquivo é só o desenho. Pode abrir no Bloco de Notas para conferir.

## Como o MIND lê o arquivo

O import aceita um JSON com duas listas obrigatórias:

```json
{
  "nodes": [],
  "edges": []
}
```

- `nodes` — os cards
- `edges` — as linhas que ligam os cards

Se faltar uma das duas, o MIND avisa **Arquivo JSON inválido.**

### Card (`nodes`)

```json
{
  "id": "n-a1b2c3d4",
  "type": "arch",
  "position": { "x": 120, "y": 80 },
  "data": {
    "catalogId": "react",
    "label": "React",
    "note": "SPA do cliente",
    "color": "#61dafb",
    "initials": "RCT",
    "category": "frontend"
  }
}
```

| Campo | Função |
|---|---|
| `id` | Identificador único do card |
| `type` | Sempre `arch` |
| `position` | Onde o card aparece na lousa |
| `data.catalogId` | Qual item da paleta é (define o ícone) |
| `data.label` | Nome visível |
| `data.note` | Texto escrito dentro do card |
| `data.color` | Cor do componente |
| `data.category` | Grupo da paleta (`frontend`, `aws`, `azure`…) |

### Link (`edges`)

```json
{
  "id": "e-e5f6g7h8",
  "source": "n-a1b2c3d4",
  "target": "n-b2c3d4e5",
  "sourceHandle": null,
  "targetHandle": null,
  "label": "REST",
  "type": "smoothstep"
}
```

| Campo | Função |
|---|---|
| `source` | `id` do card de origem |
| `target` | `id` do card de destino |
| `label` | Texto em cima da linha (pode ser vazio) |
| `sourceHandle` / `targetHandle` | Qual bolinha foi usada (`top`, `bottom` ou vazio = laterais) |

`source` e `target` precisam apontar para `id` de cards que existem em `nodes`.

## Exemplo mínimo

React ligado a uma API:

```json
{
  "nodes": [
    {
      "id": "n-react01",
      "type": "arch",
      "position": { "x": 80, "y": 120 },
      "data": {
        "catalogId": "react",
        "label": "React",
        "note": "SPA do cliente",
        "color": "#61dafb",
        "initials": "RCT",
        "category": "frontend"
      }
    },
    {
      "id": "n-api01",
      "type": "arch",
      "position": { "x": 360, "y": 120 },
      "data": {
        "catalogId": "api",
        "label": "API",
        "note": "",
        "color": "#7c8cff",
        "initials": "API",
        "category": "architecture"
      }
    }
  ],
  "edges": [
    {
      "id": "e-link01",
      "source": "n-react01",
      "target": "n-api01",
      "label": "HTTPS",
      "type": "smoothstep"
    }
  ]
}
```

Salve como `.json` e use **Importar**.

## Recados úteis

- O desenho do dia a dia fica no navegador (`localStorage`). Exportar é o jeito de **levar** o arquivo para outra máquina ou outra pessoa.
- Importar **troca** a lousa inteira. Não junta com o que já estava aberto.
- O terceiro precisa do MIND aberto (mesmo site ou mesma instalação). O JSON sozinho não vira imagem.
- `catalogId` precisa ser um item que o MIND conhece (`react`, `nodejs`, `s3`, `aks`…). Se o id não existir, o card aparece, mas o ícone pode cair no desenho genérico.
- Pode mandar vários arquivos: um por sistema, por ambiente ou por versão.

## Texto pronto para enviar

> Segue o desenho de arquitetura no formato do MIND (`mind-arquitetura-….json`).
> Abra o MIND → **Importar** → escolha esse arquivo.
> A lousa atual será substituída pelo desenho. Se quiser guardar o que já tem, exporte antes.
