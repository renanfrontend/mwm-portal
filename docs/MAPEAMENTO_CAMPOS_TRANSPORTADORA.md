<!-- BACKEND MAPPING: Campo SQL → Campo Frontend -->

## Mapeamento de Campos: SQL Server → Frontend (camelCase)

### Tabela: bio_transportadora

| SQL Server | Frontend (camelCase) | Tipo | Obrigatório |
|-----------|----------------------|------|-------------|
| id | id | string | ✅ |
| nome_fantasia | nomeFantasia | string | ✅ |
| razao_social | razaoSocial | string | ✅ |
| cnpj | cnpj | string | ✅ |
| telefone | telefone | string | ❌ |
| email | email | string | ❌ |
| telefone_comercial | telefoneComercial | string | ✅ |
| email_comercial | emailComercial | string | ✅ |
| cidade | cidade | string | ✅ |
| uf | uf | string | ✅ |
| endereco | endereco | string | ❌ |
| categoria | categoria | string | ❌ |
| status | status | 'Ativo' \| 'Inativo' | ✅ |
| criado_em | criadoEm | datetime | ❌ |
| atualizado_em | atualizadoEm | datetime | ❌ |
| contato_principal_nome | contatoPrincipal.nome | string | ❌ |
| contato_principal_telefone | contatoPrincipal.telefone | string | ❌ |
| contato_principal_email | contatoPrincipal.email | string | ❌ |
| contato_comercial_nome | contatoComercial.nome | string | ❌ |
| contato_comercial_telefone | contatoComercial.telefone | string | ❌ |
| contato_comercial_email | contatoComercial.email | string | ❌ |
| contato_financeiro_nome | contatoFinanceiro.nome | string | ❌ |
| contato_financeiro_telefone | contatoFinanceiro.telefone | string | ❌ |
| contato_financeiro_email | contatoFinanceiro.email | string | ❌ |
| contato_juridico_nome | contatoJuridico.nome | string | ❌ |
| contato_juridico_telefone | contatoJuridico.telefone | string | ❌ |
| contato_juridico_email | contatoJuridico.email | string | ❌ |

### Tabela: bio_veiculo_transportadora (Sub-recurso)

| SQL Server | Frontend (camelCase) | Tipo | Obrigatório |
|-----------|----------------------|------|-------------|
| id | id | string | ✅ |
| transportadora_id | transportadoraId | string | ✅ |
| tipo | tipo | string | ✅ |
| capacidade | capacidade | string | ✅ |