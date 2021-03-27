module.exports = {
  res(p) {
    return (req, res) => {
      p(req, res).then(data => {
        res.send({code: 1000, data, message: 'success'});
      }).catch(err => {
        const code = err && err.code ? err.code : 500;
        const message = err ? err.message || err : 'system error';
        res.send({code, message, data: err.data});
      });
    };
  }
}
