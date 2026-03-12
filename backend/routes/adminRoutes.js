const { registerAdmin, loginAdmin } = require('../controllers/authController');

// Auth Routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Get all admins
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, admin_id, name, email, role, created_at FROM admins');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get admin by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, admin_id, name, email, role, created_at FROM admins WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Admin not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
