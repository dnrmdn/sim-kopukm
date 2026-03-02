// routes/rencanaAksi.js
router.get("/", async (req, res) => {
  const { tahun } = req.query;

  const [rows] = await db.query(
    `SELECT * FROM rencana_aksi WHERE tahun = ?`,
    [tahun]
  );

  res.json(rows);
});