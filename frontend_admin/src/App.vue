<template>
  <div id="app">
    <el-table :data="rows" size="small">
      <el-table-column label="电话" prop="phoneno" width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="收货信息" prop="address" show-overflow-tooltip></el-table-column>
      <el-table-column align="right" label="提交时间" width="160">
        <template slot-scope="scope">{{scope.row.ctime | ctimeFormat}}</template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="p=>getList(p)"
      :current-page="page"
      :page-size="15"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
      page: 1,
      total: 1,
      rows: []
    };
  },
  methods: {
    getList(p) {
      this.$request({
        url: '/api/receivers',
        data: {page: p}
      }).then(data => {
        this.page = p;
        this.total = data.total;
        this.rows = data.rows;
      }).catch(() => {});
    }
  },
  filters: {
    ctimeFormat(s) {
      const d = new Date(s);
      const year = d.getFullYear().toString();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const date = d.getDate().toString().padStart(2, '0');
      const hour = d.getHours().toString().padStart(2, '0');
      const minute = d.getMinutes().toString().padStart(2, '0');
      return `${year}-${month}-${date} ${hour}:${minute}`;
    }
  },
  created() {
    this.getList(this.page);
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  padding: 10px 20px;
}
.el-pagination {
  text-align: end;
  margin-top: 20px;
}
</style>
