<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
   <el-card class="box-card">
        <el-table :data="rightsList" style="width: 100%" border  stripe>
          <el-table-column type="index" > </el-table-column>
           <el-table-column prop="authName" label="权限名称"> </el-table-column>
           <el-table-column prop="path" label="路径"> </el-table-column>
           <el-table-column  label="权限等级" > 
              <template slot-scope="scope">
                  <el-tag v-if="scope.row.level==0" >一级</el-tag>
                  <el-tag type="success" v-else-if="scope.row.level==1" >二级</el-tag>
                  <el-tag type="warning" v-else>一级</el-tag>
              </template>
           </el-table-column>
        
        </el-table>
 
   </el-card>

  </div>
</template>

<script>
export default {

  data () {
    return {
      rightsList: [],
    }
  },

  methods: {
    // 获取权限列表
    async getRightsList(){
      const {data: res} = await this.$http.get('rights/list');
      // console.log(res)
      
      // 获取权限失败
      if(res.meta.status !== 200) return this.$message.error('权限获取失败')

      // 获取权限成功
      this.rightsList = res.data;
      // console.log(this.rightsList)
    }
  },

  created () {
    // 获取权限列表
    this.getRightsList();
  }
}
</script>

<style lang='less' scoped>

</style>
