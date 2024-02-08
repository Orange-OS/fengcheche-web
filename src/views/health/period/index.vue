<template>
  <el-container style="height: 100%">
    <el-header style="border-bottom: solid 1px #ebeef5;background-color: #FFFFFF;border-radius: 10px;margin-bottom: 5px;padding: 20px">
      <el-row>
        <el-col>
          <el-button style="width: 100px" size="mini" type="primary">新建</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main style="border: solid 1px #ebeef5;background-color: #FFFFFF;border-radius: 10px 10px 0 0;">
      <el-table :data="periods" :loading="false" style="width: 100%;height: 670px" border>
        <el-table-column label="生理周期" prop="period" />
        <el-table-column label="备注" prop="notes" />
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column label="更新时间" prop="updateTime" />
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="showDialog(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteCategory(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer style="height: 70px;border-bottom: solid 1px #ebeef5;background-color: #FFFFFF;border-radius: 0 0 10px 10px;padding: 20px;margin: 0 1px 0 1px">
      <el-pagination
        style="margin-bottom: 5px"
        background
        :current-page="page.current"
        :page-sizes="[10, 50, 100, 200]"
        :page-size="page.size"
        :total="page.total"
        layout="->,sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-footer>
  </el-container>
</template>

<script>
import { periodList, test } from '@/api/health/period'
export default {
  data() {
    return {
      page: {
        size: 10,
        current: 1,
        total: 100,
        condition: {}
      },
      periods: [{
        'id': 3,
        'period': '美食',
        'notes': 'my',
        'createTime': '2023-09-02 12:06:59',
        'updateTime': '2023-09-02 12:06:59'
      }]
    }
  },
  created() {
    this.getTableData()
    this.getTest()
  },
  methods: {
    getTableData() {
      periodList(this.page).then(result => {
        console.log('pageResult', result)
      }).catch(error => {
        // 处理请求错误
        console.error('pageError', error.message)
      })
    },
    getTest() {
      test().then(result => {
        console.log('testResult', result)
      })
    },
    handleSizeChange(num) {
      this.page.size = num
      // TODO 获取姨妈数据
    },
    handleCurrentChange(num) {
      this.page.current = num
      // TODO 获取姨妈数据
    }

  }
}

</script>

<style scoped lang="scss">

</style>
