<template>
  <div class="login_container">
    <!-- 登录盒子 -->
    <div class="login_box">
        <!-- 登录logo -->
        <div class="avatar_box">
          <img src="../assets/logo.png" alt="">
        </div>
        <!-- 登录表单 -->
        <!-- 属性绑定 rules  model-->
        <el-form ref="loginFormRef" :model="loginForm" label-width="0px" class="login_form" :rules="loginFormrRules">
          <!-- 用户名 -->
          <!-- prefix-icon 是elementUi的提供的属性，用来添加图标，iconfont icon-user是通过引入fonts中的css文件，使用其中的类，来添加图标 -->
          <el-form-item prop="username" >
            <el-input v-model="loginForm.username"  prefix-icon="iconfont icon-user" ></el-input>
          </el-form-item>
          <!-- 密码 -->
           <el-form-item prop="password" >
            <el-input v-model="loginForm.password"  prefix-icon="iconfont icon-3702mima" type="password" ></el-input>
          </el-form-item>
          <!-- 登录按钮 -->
          <el-form-item class="btns" >
           <el-button type="primary" @click="login">登录</el-button>
           <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
    </div>  
  </div>
</template>

<script>
export default {

  data () {
    return {
      // 数据绑定：
     loginForm:{
       username:'admin',
       password:'123456'
     },
      // 表单验证规则
      loginFormrRules: {
        // 验证用户的合法性
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          // 验证用户名的合法性
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
         
      }
    }
  },

  methods: {
    // 1.重置
    resetLoginForm(){
      // this.refs.loginFormRef表单的实例对象
      // resetFields() 是elementui的表单form对象封装的方法
      // this 指向当前这个组件实例对象login.vue
      this.$refs.loginFormRef.resetFields()
    },

    // 2.登录
    login(){
        // console.log(this.$refs.loginFormRef)
        // 预校验; 点击登录后先调用validate方法验证表单内容是否有误
        // 有误将不发送请求 ， valid 布尔值，验证结果
        this.$refs.loginFormRef.validate(async valid=> {
          // console.log(valid)
          // 验证失败，直接终止
          if(!valid) return;
          
          // 预验证成功 ，就发送请求进行登录   解构赋值
          const {data: res} = await this.$http.post('login',this.loginForm);
          console.log(res)
          if(res.meta.status !== 200) {
            // 登录失败，即用户名或密码有误 return 则后续代码不再执行
            return this.$message.error('登录失败:'+ res.meta.msg)
          }
           this.$message.success('登录成功');
           // 登录成功把服务器返回的token存储在sessionStorage
           window.sessionStorage.setItem('token', res.data.token);
           // 导航至 /home
          //  this.$router.push('/home')
        })
    },
    
  },

  created () {
  }
}
</script>

<style lang='less' scoped>

  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);

    .avatar_box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow:  0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }
 
  .btns {
    display: flex;
    // 调整主轴对齐方式， 从尾部开始对齐
    justify-content: flex-end;
  }

</style>
