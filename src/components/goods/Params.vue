<template>
  <div>
     <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 警示框 -->
      <el-alert show-icon 
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning">
      </el-alert>
       <!-- 选择商品分类 -->
      <el-row clas="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 商品级联选择框 -->
          <!--  v-model="value"
            :options="options"
            @change="handleChange" -->
          <el-cascader :options="cateList"
           >
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tab栏 -->
      <el-tabs >
        <el-tab-pane label="用户管理" name="first">
            <el-button >添加参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
      </el-tabs>

    </el-card>

  </div>
</template>

<script>
export default {

  data () {
    return {
      // 商品分类列表
      cateList:[],
      
    }
  },

  methods: {
    // 获取商品分类列表
    async getCateList(){
        const {data: res} = await this.$http.get('categories');
        console.log(res)

        if(res.meta.status != 200) return this.$message.error('商品分类数据获取失败')

        this.cateList = res.data;
    }
  },

  created () {
    this.getCateList();
  }
}
</script>

<style lang='less' scoped>
.el-row {
  margin: 10px 0;
  font-size: 18px;
}
.el-cascader {
  margin-left: 10px;
}
</style>
