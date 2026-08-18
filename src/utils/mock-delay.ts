/** Simula latência de rede — trocar por chamada HTTP real não muda a API das stores. */
export function mockDelay(ms = 150): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
