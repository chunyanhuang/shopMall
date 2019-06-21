<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
          <!-- 顶部 -->
         <el-button type="primary" @click="addRolesVisible=true">添加角色</el-button>
          <!-- 表格 -->
          <el-table  border stripe :data="roleList" >
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row :class="['bdbottom', i1==0?'bdTop':'' ]" :key="item1.id" v-for="(item1, i1) in scope.row.children" >
                      <!-- 一级权限 -->
                      <el-col :span="5">
                        <el-tag  closable>{{item1.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <!-- 二三级权限 -->
                      <el-col :span="19">
                          <el-row :class="[ i2==0?'':'bdTop']" :key="item2.id" v-for="(item2, i2) in item1.children"  >
                            <!-- 二级权限 -->
                            <el-col :span="6">
                                 <el-tag type="success" closable>{{item2.authName}}</el-tag>
                                  <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 三级权限 -->
                            <el-col :span="18">
                                <el-tag type="warning" closable :key="item3.id" v-for="(item3) in item2.children">{{item3.authName}}</el-tag>
                            </el-col>
                          </el-row>
                      </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index" ></el-table-column>
            <el-table-column label="角色名称" prop="roleName" ></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"  ></el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作" width="320px">
              <template >
                <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
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
      // 是否显示添加角色弹框
      addRolesVisible: false,

      // 角色数据列表
      roleList: [],
    }
  },

  methods: {
    async getRolesList(){
      const {data: res} = await this.$http.get('roles')
      console.log(res)

      // 权限获取失败
      if(res.meta.status != 200) return this.$message.error('权限信息获取失败')
      
      // 获取成功
      this.roleList = res.data
      
    }
  },

  created () {
    this.getRolesList();
  }
}
</script>

<style lang='less' scoped>

  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .bdTop {
    border-top: 1px solid #eee;
  }

  .el-row {
    display: flex;
    align-items: center;

  } 
  .el-tag {
    margin:  10px;
    

  }

</style>
