import express from 'express';

const router = express.Router();

router.post('/');
router.get('/');
router.get('/:id');
router.patch('/:id');
router.delete('/:id');

export default router;
