const express = require('express');
const router = express.Router();
const utils = require('./../utils');
const pool = require('./../pool');

// 提交收货信息
router.post('/submit', utils.res(async function(req, res) {
  const {phoneno, address} = req.body;
  if (!phoneno) return Promise.reject({code: 400, message: 'phoneno required'});
  if (!address) return Promise.reject({code: 400, message: 'address required'});
  const date = new Date().getDate() - 1;
  // 最近一个月的收货信息总数(每月限额100份)
  const p1 = pool.query(`SELECT COUNT(id) total FROM receivers WHERE ctime > TIMESTAMPADD(DAY,-${date},CURRENT_DATE)`);
  // 最近半年相同手机号的收货信息(同一用户每六个月只能领取一次)
  const p2 = pool.query('SELECT * FROM receivers WHERE ctime > TIMESTAMPADD(MONTH,-6,CURRENT_TIMESTAMP) AND phoneno=?', [phoneno]);
  const [[[{total}]], [[receiver]]] = await Promise.all([p1, p2]);
  const limit = 100;
  if (total >= limit) return Promise.reject({code: 3001, message: '本月配额已送完', data: {limit}});
  if (receiver) return Promise.reject({code: 3002, message: '对不起，同一用户每六个月只能领取一次'});
  await pool.query('INSERT INTO receivers (phoneno,address) VALUES (?,?)', [phoneno, address]);
  return;
}));

// 获取收货信息列表
router.get('/receivers', utils.res(async function(req, res) {
  const page = req.query.page ? Number(req.query.page) : 1;
  // 总条数
  const p1 = pool.query('SELECT COUNT(id) total FROM receivers');
  // 20条
  const p2 = pool.query('SELECT phoneno,address,UNIX_TIMESTAMP(ctime)*1000 ctime FROM receivers ORDER BY ctime DESC LIMIT 20 OFFSET ?', [(page - 1) * 20]);
  const [[[{total}]], [rows]] = await Promise.all([p1, p2]);
  return {total, rows};
}));

module.exports = router;
