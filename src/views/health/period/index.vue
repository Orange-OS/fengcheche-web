<template>
  <el-container style="height: 92vh;display: flex; flex-direction: column;">
    <el-header
      style="height: 70px;border-bottom: solid 1px #ebeef5;background-color: #FFFFFF;border-radius: 10px;margin-bottom: 10px;padding: 20px;"
    >
      <el-row>
        <el-col :span="2">
          <el-button style="width: 100px" size="mini" type="primary" @click="addPeriod">新增</el-button>
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="timeRange"
            size="small"
            style="width: 500px"
            type="monthrange"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            @change="handleDateChange"
          />
        </el-col>
        <el-col :span="1">
          <el-button type="primary" icon="el-icon-search" size="small" :loading="searchLoading" plain @click="search">
            搜索
          </el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main style="border: solid 1px #ebeef5;background-color: #FFFFFF;border-radius: 10px 10px 0 0;">
      <el-table
        v-loading="loading"
        :data="tableData"
        :cell-style="{'text-align':'center'}"
        style="width: 100%;"
        max-height="703px"
        stripe
        border
      >
        <el-table-column label="编号" type="index" width="200px" />
        <el-table-column label="生理周期" prop="period" width="200px" />
        <el-table-column label="备注" prop="note" />
        <el-table-column label="创建时间" prop="createTime" width="300px" />
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <el-form ref="periodFormRef" :model="periodEntity" :rules="periodFormRules" label-width="150px">
          <el-form-item label="生理周期" prop="period">
            <el-date-picker
              v-model="periodEntity.period"
              type="date"
              size="small"
              style="width:70%;"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
            />
            <!--            <el-input v-model="period.period" size="small" style="width:70%;" placeholder="请输入内容" />-->
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input
              v-model="periodEntity.note"
              type="textarea"
              :rows="3"
              size="small"
              style="width:70%;"
              placeholder="请输入备注"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
    <el-footer
      style="border-bottom: solid 1px #ebeef5;background-color: #FFFFFF;border-radius: 0 0 10px 10px;padding: 20px;margin: 0 1px 0 1px"
    >
      <el-pagination
        :current-page="page.current"
        :page-size="page.size"
        :total="page.total"
        :page-sizes="[20, 50, 100, 200]"
        layout="prev, pager, next, jumper, sizes"
        background
        style="float: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-footer>
  </el-container>
</template>

<script>
import { periodAdd, periodDel, periodPage } from '@/api/health/period'

export default {
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '',
      loading: false,
      searchLoading: false,
      timeRange: [],
      tableData: [],
      page: {
        size: 20,
        current: 1,
        total: 100,
        condition: {
          startTime: '',
          endTime: ''
        }
      },
      periodEntity: {
        id: '',
        period: '',
        note: ''
      },
      periodFormRules: {
        period: [
          { required: true, message: '请选择生理周期', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getPeriodPage()
  },
  methods: {
    getPeriodPage() {
      this.loading = true
      periodPage(this.page).then(result => {
        this.tableData = result.data.list
        this.page.total = result.data.total
        this.loading = false
      }).catch(error => {
        // 处理请求错误
        console.error('pageError', error.message)
        this.loading = false
      })
    },
    handleSizeChange(num) {
      this.page.size = num
      this.getPeriodPage()
    },
    handleCurrentChange(num) {
      this.page.current = num
      this.getPeriodPage()
    },
    addPeriod() {
      this.dialogTitle = '新增'
      this.dialogVisible = true
    },
    handleEdit(index, row) {
      this.dialogTitle = '编辑'
      this.dialogVisible = true

      // 数据回填
      this.periodEntity = {
        id: row.id,
        period: row.period,
        note: row.note
      }
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        periodDel(row.id).then(result => {
          this.$message.success('删除成功')

          const totalPage = Math.ceil((this.page.total - 1) / this.page.size)
          const currentPage = this.page.current > totalPage ? totalPage : this.page.current
          this.page.current = currentPage < 1 ? 1 : currentPage

          this.getPeriodPage()
        }).catch(() => {
          this.$message.error('删除失败')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleConfirm() {
      if (this.periodEntity.id === null) {
        this.$refs.periodFormRef.validate((valid) => {
          if (valid) {
            this.page.current = 1
            periodAdd(this.periodEntity).then(result => {
              this.$message.success('新增成功')
              this.getPeriodPage()
              this.handleClose()
            }).catch(err => {
              console.log('err :', err)
            })
          }
        })
      } else {
        periodAdd(this.periodEntity).then(result => {
          this.$message.success('修改成功')
          this.getPeriodPage()
          this.handleClose()
        }).catch(err => {
          console.log('err :', err)
        })
      }
    },
    handleClose() {
      this.dialogVisible = false

      // 清除校验状态和数据
      if (this.$refs.periodFormRef != null) {
        this.$refs.periodFormRef.resetFields()
      }
      this.periodEntity = {
        id: null,
        period: '',
        note: ''
      }
    },
    handleDateChange(value) {
      if (value) {
        this.page.condition.startTime = value[0]
        this.page.condition.endTime = value[1]
      } else {
        this.page.condition.startTime = ''
        this.page.condition.endTime = ''
      }
    },
    search() {
      // 不在第一页查询
      if (this.page.current !== 1) {
        this.page.current = 1
        this.page.total = 0
      }

      this.searchLoading = true
      this.loading = true
      periodPage(this.page).then(result => {
        this.tableData = result.data.list
        this.page.total = result.data.total
        this.loading = false
        this.searchLoading = false
      }).catch(error => {
        // 处理请求错误
        this.loading = false
        this.searchLoading = false
        console.error('pageError', error.message)
      })
    }
  }
}

</script>

<style scoped lang="scss">

</style>
