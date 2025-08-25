import { useState } from 'react';

function useOllamaHook(model = 'deepseek-r1:1.5b') {
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (_prompt, useStream = false) => {
    console.log('handleSubmit called with prompt:', _prompt);
    setLoading(true);
    setResponse('');
    setError(null);

    try {
      const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt: _prompt,
          max_tokens: 500,
          stream: useStream, // 🔑 aquí decides si llega todo junto o en streaming
        }),
      });

      if (!res.ok) throw new Error('Respuesta inválida');

      // 🚀 Modo simple: respuesta completa
      if (!useStream) {
        const data = await res.json();
        setResponse(data.response || '');
      } else {
        // ⚡ Modo streaming
        if (!res.body) throw new Error('Streaming no soportado');
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n');
          buffer = lines.pop(); // la última puede estar incompleta

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const parsed = JSON.parse(line);
              if (parsed.done) {
                console.log('🟢 FIN DE GENERACIÓN');
                return;
              }
              if (parsed.response) {
                setResponse((prev) => prev + parsed.response);
              }
            } catch (err) {
              console.warn('❗ Error parseando línea JSON', err, line);
            }
          }
        }
      }
    } catch (err) {
      console.error('Error en handleSubmit:', err);
      setError(err.message || 'Error en streaming');
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, response, error, loading };
}

export default useOllamaHook;