<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; // 用于登录后跳转

// 配置后端接口基础路径（替换为你的后端实际地址）
axios.defaults.baseURL = 'http://localhost:8080';

// 路由实例（用于跳转）
const router = useRouter();

// 表单数据
const credentials = reactive({
  username: '',
  password: '',
  code: '' // 验证码输入
});

// 验证码相关
const captcha = ref({
  uuid: '',       // 验证码唯一标识
  imgUrl: '',     // 验证码图片地址（Base64）
  enabled: true   // 是否启用验证码
});

// 加载状态
const loading = ref(false);

// 获取验证码
const getCaptcha = async () => {
  try {
    const res = await axios.get('/captchaImage', {
      headers: { 'isToken': false } // 登录相关接口无需Token
    });

    // 因为验证码图片没有显示
    // 在 getCaptcha 函数中打印完整的接口返回结果，确认后端是否真的返回了数据
    console.log('验证码接口完整响应：', res);
    console.log('响应数据：', res.data);

    // 验证接口返回是否正常
    if (res.data.code === 200) {
      captcha.value.uuid = res.data.uuid;
      // 只保留这一次正确的赋值（带DataURL前缀）

      // 后端返回的img字段是纯 Base64 字符串
      // 缺少data:image/png;base64,${base64字符串}
      // 手动拼接
      captcha.value.imgUrl = `data:image/jpeg;base64,${res.data.img}`;
      captcha.value.enabled = res.data.captchaEnabled;
      console.log('赋值后的imgUrl：', captcha.value.imgUrl);
    } else {
      // 接口返回错误时的提示
      alert('获取验证码失败：' + (res.data?.msg || '接口返回异常'));
    }
  } catch (error) {
    let errorMsg = '获取验证码失败：';
    if (error.response) {
      errorMsg += `后端返回状态码 ${error.response.status}，请检查后端地址是否正确`;
    } else if (error.request) {
      errorMsg += '后端服务未启动或网络不通';
    } else {
      errorMsg += error.message;
    }
    alert(errorMsg);
    console.error('验证码请求错误：', error);
  }
};

// 登录逻辑
const login = async () => {
  // 表单验证
  if (!credentials.username) return alert('请输入用户名');
  if (!credentials.password) return alert('请输入密码');
  if (captcha.value.enabled && !credentials.code) return alert('请输入验证码');

  loading.value = true;
  try {
    const res = await axios.post('/login', {
      username: credentials.username,
      password: credentials.password,
      code: credentials.code,         // 验证码（若启用）
      uuid: captcha.value.uuid        // 验证码唯一标识（必须传）
    }, {
      headers: { 'isToken': false }
    });

    if (res.data.code === 200) {
      // 登录成功：存储Token并设置全局请求头
      const token = res.data.token;
      localStorage.setItem('Admin-Token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // 跳转到首页（根据你的路由配置修改）
      router.push('/').then(() => {
        alert('登录成功');
      });
    } else {
      // 登录失败：提示错误并刷新验证码
      alert(`登录失败：${res.data.msg || '用户名或密码错误'}`);
      await getCaptcha(); // 刷新验证码
    }
  } catch (error) {
    alert('登录请求失败：' + (error.response?.data?.msg || error.message));
  } finally {
    loading.value = false;
  }
};

// 页面加载时获取验证码
getCaptcha();
</script>

<template>
  <div class="login-form" style="max-width: 300px; margin: 50px auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
    <h2 style="text-align: center; margin-bottom: 20px;">系统登录</h2>

    <!-- 用户名 -->
    <div style="margin-bottom: 15px;">
      <label style="display: block; margin-bottom: 5px;">用户名</label>
      <input
          type="text"
          v-model="credentials.username"
          placeholder="请输入用户名"
          style="width: 100%; padding: 8px; box-sizing: border-box;"
      />
    </div>

    <!-- 密码 -->
    <div style="margin-bottom: 15px;">
      <label style="display: block; margin-bottom: 5px;">密码</label>
      <input
          type="password"
          v-model="credentials.password"
          placeholder="请输入密码"
          style="width: 100%; padding: 8px; box-sizing: border-box;"
      />
    </div>

    <!-- 验证码（仅当启用时显示） -->
    <div v-if="captcha.enabled" style="margin-bottom: 15px;">
      <label style="display: block; margin-bottom: 5px;">验证码</label>
      <div style="display: flex; gap: 10px;">
        <input
            type="text"
            v-model="credentials.code"
            placeholder="请输入验证码"
            style="flex: 1; padding: 8px; box-sizing: border-box;"
        />
        <!-- 验证码图片标签 -->
        <img
            :src="captcha.imgUrl"
            alt="验证码"
            @click="getCaptcha"
            style="width: 120px; height: 40px; cursor: pointer;"
        />
      </div>
    </div>

    <!-- 登录按钮 -->
    <button
        @click="login"
        :disabled="loading"
        style="width: 100%; padding: 10px; background: #42b983; color: white; border: none; border-radius: 4px; cursor: pointer;"
    >
      {{ loading ? '登录中...' : '登录' }}
    </button>
  </div>
</template>



  <style scoped>
  .login-container {
    width: 300px;
    margin: 100px auto;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .login-container h1{
   color:#007bff;
    text-align: center;
  }
  form div {
    margin: 10px 0;
  }
  label {
    display: block;
    margin-bottom: 5px;
  }
  input[type="text"], input[type="password"] {
    width: 100%;
    padding: 8px;
    margin-top: 2px;
  }
  button {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>