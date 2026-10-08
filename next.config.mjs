// Keep the default Vercel deployment; export only for static hosting.
export default process.env.NEXT_STATIC_EXPORT === '1'
  ? { output: 'export' }
  : {};
