<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useUsuariosStore } from '@/stores/usuarios'
import { useAreasStore } from '@/stores/areas'
import { PERFIL_LABEL, type Perfil, type Usuario, type UsuarioFormInput } from '@/types/usuario'

const usuariosStore = useUsuariosStore()
const areasStore = useAreasStore()

const PERFIS: Perfil[] = ['responsavel', 'validador', 'admin', 'auditor']

const usuarioEmEdicao = ref<Usuario | null>(null)
const formularioAberto = ref(false)
const confirmandoExclusaoId = ref<string | null>(null)

const form = reactive<UsuarioFormInput>({
  nome: '',
  matricula: '',
  email: '',
  perfil: 'responsavel',
  areaId: undefined,
})

function areaSigla(areaId?: string): string | undefined {
  return areaId ? areasStore.getById(areaId)?.sigla : undefined
}

function abrirCriacao(): void {
  usuarioEmEdicao.value = null
  Object.assign(form, { nome: '', matricula: '', email: '', perfil: 'responsavel', areaId: undefined })
  formularioAberto.value = true
}

function abrirEdicao(usuario: Usuario): void {
  usuarioEmEdicao.value = usuario
  Object.assign(form, {
    nome: usuario.nome,
    matricula: usuario.matricula,
    email: usuario.email,
    perfil: usuario.perfil,
    areaId: usuario.areaId,
  })
  formularioAberto.value = true
}

function fecharFormulario(): void {
  formularioAberto.value = false
  usuarioEmEdicao.value = null
}

function salvar(): void {
  const dados: UsuarioFormInput = {
    ...form,
    areaId: form.perfil === 'responsavel' ? form.areaId : undefined,
  }
  if (usuarioEmEdicao.value) {
    usuariosStore.atualizarUsuario(usuarioEmEdicao.value.id, dados)
  } else {
    usuariosStore.criarUsuario(dados)
  }
  fecharFormulario()
}

function pedirExclusao(id: string): void {
  confirmandoExclusaoId.value = id
}

function confirmarExclusao(id: string): void {
  usuariosStore.excluirUsuario(id)
  confirmandoExclusaoId.value = null
}
</script>

<template>
  <div>
    <header class="border-b border-line bg-card">
      <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <nav class="mb-4 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-ink-soft">
          <router-link to="/" class="hover:text-ink">Painel</router-link>
          <span>/</span>
          <router-link to="/admin" class="hover:text-ink">Administração</router-link>
          <span>/</span>
          <span class="text-ink">Usuários</span>
        </nav>

        <h1 class="font-display text-2xl font-extrabold text-ink sm:text-3xl">Usuários</h1>
        <p class="mt-1 text-sm text-ink-soft">
          {{ usuariosStore.usuarios.length }} usuários de demonstração — alimentam as opções de login.
        </p>
      </div>
    </header>

    <div class="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6">
      <button
        v-if="!formularioAberto"
        type="button"
        class="self-start rounded-sm border border-brand bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-2"
        @click="abrirCriacao"
      >
        + Novo usuário
      </button>

      <form v-if="formularioAberto" class="panel flex flex-col gap-4 p-6" @submit.prevent="salvar">
        <h3 class="font-display text-base font-bold text-ink">
          {{ usuarioEmEdicao ? 'Editar usuário' : 'Novo usuário' }}
        </h3>

        <div class="flex flex-col gap-1.5">
          <label class="font-mono text-[11px] uppercase tracking-widest text-ink-soft" for="uf-nome">Nome</label>
          <input
            id="uf-nome"
            v-model="form.nome"
            type="text"
            required
            class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
          />
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="flex flex-col gap-1.5">
            <label class="font-mono text-[11px] uppercase tracking-widest text-ink-soft" for="uf-matricula">Matrícula</label>
            <input
              id="uf-matricula"
              v-model="form.matricula"
              type="text"
              required
              class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="font-mono text-[11px] uppercase tracking-widest text-ink-soft" for="uf-email">E-mail</label>
            <input
              id="uf-email"
              v-model="form.email"
              type="email"
              required
              class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
            />
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <span class="font-mono text-[11px] uppercase tracking-widest text-ink-soft">Perfil</span>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="perfil in PERFIS"
              :key="perfil"
              type="button"
              class="rounded-sm border px-2.5 py-1.5 text-xs font-semibold transition"
              :class="
                form.perfil === perfil
                  ? 'border-brand bg-brand text-on-brand'
                  : 'border-line bg-card text-ink hover:border-brass'
              "
              @click="form.perfil = perfil"
            >
              {{ PERFIL_LABEL[perfil] }}
            </button>
          </div>
        </div>

        <div v-if="form.perfil === 'responsavel'" class="flex flex-col gap-1.5">
          <label class="font-mono text-[11px] uppercase tracking-widest text-ink-soft" for="uf-area">Área</label>
          <select
            id="uf-area"
            v-model="form.areaId"
            required
            class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
          >
            <option value="" disabled>Selecione uma área</option>
            <option v-for="area in areasStore.areas" :key="area.id" :value="area.id">
              {{ area.sigla }} — {{ area.nome }}
            </option>
          </select>
        </div>

        <div class="flex gap-2">
          <button
            type="submit"
            class="rounded-sm border border-brand bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-2"
          >
            {{ usuarioEmEdicao ? 'Salvar alterações' : 'Criar usuário' }}
          </button>
          <button
            type="button"
            class="rounded-sm border border-line px-4 py-2 text-sm font-semibold text-ink-soft transition hover:border-brass"
            @click="fecharFormulario"
          >
            Cancelar
          </button>
        </div>
      </form>

      <div class="panel flex flex-col divide-y divide-line">
        <div
          v-for="usuario in usuariosStore.usuarios"
          :key="usuario.id"
          class="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold text-ink">{{ usuario.nome }}</p>
            <p class="mt-0.5 font-mono text-xs text-ink-soft">
              {{ usuario.matricula }} · {{ PERFIL_LABEL[usuario.perfil] }}
              <template v-if="areaSigla(usuario.areaId)"> · {{ areaSigla(usuario.areaId) }}</template>
            </p>
          </div>

          <div class="flex shrink-0 items-center gap-2 self-start sm:self-center">
            <template v-if="confirmandoExclusaoId === usuario.id">
              <span class="text-xs font-semibold text-status-critical">Excluir mesmo?</span>
              <button
                type="button"
                class="rounded-sm border border-status-critical bg-status-critical px-2.5 py-1 text-xs font-semibold text-on-brand"
                @click="confirmarExclusao(usuario.id)"
              >
                Sim
              </button>
              <button
                type="button"
                class="rounded-sm border border-line px-2.5 py-1 text-xs font-semibold text-ink-soft"
                @click="confirmandoExclusaoId = null"
              >
                Cancelar
              </button>
            </template>
            <template v-else>
              <button
                type="button"
                class="rounded-sm border border-line px-2.5 py-1 text-xs font-semibold text-ink-soft transition hover:border-brass hover:text-ink"
                @click="abrirEdicao(usuario)"
              >
                Editar
              </button>
              <button
                type="button"
                class="rounded-sm border border-line px-2.5 py-1 text-xs font-semibold text-ink-soft transition hover:border-status-critical hover:text-status-critical"
                @click="pedirExclusao(usuario.id)"
              >
                Excluir
              </button>
            </template>
          </div>
        </div>

        <p v-if="usuariosStore.usuarios.length === 0" class="py-8 text-center text-sm text-ink-soft">
          Nenhum usuário cadastrado.
        </p>
      </div>
    </div>
  </div>
</template>
