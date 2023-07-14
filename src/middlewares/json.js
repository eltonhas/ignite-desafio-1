export const json = async (req, res) => {
  const buffers = []

  // espera todo o corpo da requisição preencher o buffer, de forma assincrona
  for await (const chunck of req) {
    buffers.push(chunck)
  }

  // Cria o body da requisição, qdo a requisição é GET e ele não existe cai no catch
  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    req.body = null
  }

  res.setHeader('Content-type', 'application/json')
}