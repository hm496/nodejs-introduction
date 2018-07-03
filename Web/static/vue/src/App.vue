<template>
  <div class="App">

    <el-row>
      <el-col :span="6" :offset="1">
        <el-input v-model="CID" placeholder="请输入CID"></el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="warning" icon="el-icon-search" circle @click="search"></el-button>
      </el-col>
    </el-row>


    <el-row>
      <el-col :span="20" :offset="1">
        <el-table
          border
          :data="tableData2"
          style="width: 100%"
          :row-class-name="tableRowClassName">
          <el-table-column
            prop="cid"
            label="cid"
          >
          </el-table-column>
          <el-table-column
            prop="account_id"
            label="account_id"
          >
          </el-table-column>
          <el-table-column
            prop="account_pwd"
            label="account_pwd"

          >
          </el-table-column>
          <el-table-column
            prop="nick_name"
            label="nick_name"
            >
          </el-table-column>
          <el-table-column
            prop="gender"
            label="gender"
            >
          </el-table-column>
          <el-table-column
            prop="img_url"
            label="img_url"
            >
          </el-table-column>
          <el-table-column
            prop="role"
            label="role"
            >
          </el-table-column>
          <el-table-column
            prop="like_num"
            label="like_num"
            >
          </el-table-column>
          <el-table-column
            prop="last_login_date"
            label="last_login_date"
            >
          </el-table-column>
          <el-table-column
            prop="last_lon"
            label="last_lon"
            >
          </el-table-column>
          <el-table-column
            prop="last_lat"
            label="last_lat"
            >
          </el-table-column>
          <el-table-column
            prop="token"
            label="token"
            >
          </el-table-column>
          <el-table-column
            prop="device_type"
            label="device_type"
            >
          </el-table-column>
          <el-table-column
            prop="email"
            label="email"
            >
          </el-table-column>
          <el-table-column
            prop="email_pass"
            label="email_pass"
            >
          </el-table-column>
          <el-table-column
            prop="sys_remark"
            label="sys_remark"
            >
          </el-table-column>
          <el-table-column
            prop="sys_status"
            label="sys_status"
            >
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

  </div>
</template>

<style>
  .el-table .warning-row {
    background:oldlace;
  }

  .el-table .success-row {
    background:#f0f9eb;
  }
</style>

<script>
  export default {
    // methods: {
    //   tableRowClassName ({ row, rowIndex }) {
    //     if (rowIndex % 2 === 1) {
    //       return 'warning-row';
    //     }
    //     return '';
    //   }
    // },
    data () {
      return {
        CID: "",

        tableData2: []
      }
    },
    methods: {
      tableRowClassName ({ row, rowIndex }) {
        if (rowIndex % 2 === 0) {
          return 'warning-row';
        }
        return '';
      },
      search () {
        let startTime = Date.now();
        fetch(`/user/userinfo?cid=${this.CID}&_time=${startTime}`).then(res => res.json()).then(res => {
          if (res.code === 0) {
            console.log(res)
            this.tableData2 = [res.data]
            this.$message({
              message: '恭喜你，查询成功 耗时' + (Date.now() - startTime) + 'ms',
              type: 'success'
            });
          } else {
            this.$message(res.message)
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
