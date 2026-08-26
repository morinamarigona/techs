/**
 * Self-ping çdo 14 minuta kur serveri është aktiv.
 * Nuk zgjon instancën nga sleep — për këtë përdoret GitHub Actions / cron-job.org.
 * Ndihmon të mos fletë midis ping-ave të jashtëm dhe mban lidhjen me MongoDB të gjallë.
 */
export function startKeepAlive() {
  if (process.env.KEEP_ALIVE_ENABLED === 'false') {
    return;
  }

  const baseUrl = process.env.KEEP_ALIVE_URL || process.env.RENDER_EXTERNAL_URL;
  if (!baseUrl) {
    console.log('[keep-alive] RENDER_EXTERNAL_URL / KEEP_ALIVE_URL nuk është vendosur — skip self-ping');
    return;
  }

  const healthUrl = `${baseUrl.replace(/\/$/, '')}/api/health`;
  const intervalMinutes = Number(process.env.KEEP_ALIVE_INTERVAL_MINUTES || 14);
  const intervalMs = intervalMinutes * 60 * 1000;

  const ping = async () => {
    try {
      const res = await fetch(healthUrl, { signal: AbortSignal.timeout(30000) });
      console.log(`[keep-alive] ping ${healthUrl} -> ${res.status}`);
    } catch (err) {
      console.warn(`[keep-alive] ping dështoi: ${err.message}`);
    }
  };

  setInterval(ping, intervalMs);
  console.log(`[keep-alive] self-ping çdo ${intervalMinutes} min -> ${healthUrl}`);
}
