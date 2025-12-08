import app from './app.js';

const PORT = process.env.PORT || 5858;

const server = app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server started on http://localhost:${PORT}`);
  console.log('='.repeat(50));
});

["SIGTERM", "SIGINT"].forEach(signal => {
  process.on(signal, () => {
    console.log(`\n${signal} signal received: closing server...`);
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
});