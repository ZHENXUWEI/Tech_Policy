<script setup>
import { useCounterStore } from "../stores/counter";
import HomeHeader from "./HomeHeader.vue"
import { ref, onMounted, computed, onUnmounted } from "vue"
import zhCn from "element-plus/es/locale/lang/zh-cn";
const locale = zhCn;
import { policyclassinfoAPI, policyinfoAPI, policyNumberAPI } from "@/api/policy"
import { useRouter } from 'vue-router';
import Pagination from '@/components/Pagination.vue'
import { daysUntil } from "@/utils/daysUtil"
import { getKeyWordCookie, removeKeyWordCookie, getCookie, setTabCookie, getTabCookie, setCategoryCookie, getCategoryCookie } from '@/utils/cookie'
import { policyUserHobby } from "@/api/policy"
import { ElMessage } from "element-plus";
const router = useRouter();
// const route = useRoute();
const userId = ref(null)
const policyCalssinfo = ref([])
const policyinfoData = ref([])
let datalist = []
let newData = ref([])
const choose = ref({})
const currentPage = ref(1)
const itemsPerPage = 10
const activeIndex = ref(1)
const total = ref(0)
const tabs = ref([
  '热度推荐',
  '最新政策',
  // '精准推荐',
  // '可申报政策'
])
const dateRange = ref([])
const keyWord = ref('')
const timeRange = ref([])
// 新增状态
const showDistrictSelector = ref(false);
const currentCityDistricts = ref([]);
const currentCityName = ref('');
const selectedDistrictIndex = ref(0);

const changeIndex = (subItem, index, i) => {
  selectedDistrictIndex.value = 0
  // console.log(subItem, index, i)
  // 如果是适用区域分类（id=5）
  if (datalist[index].id === 5) {
    // 查找对应的城市数据
    const cityData = datalist[index].subChildren.find(c => c.name === subItem);

    // 显示区县选择器（需要新增状态）
    currentCityDistricts.value = cityData?.children || [];
    console.log(currentCityDistricts.value);
    if (currentCityDistricts.value.length > 0) {
      showDistrictSelector.value = true;
    } else {
      showDistrictSelector.value = false;
    }
    currentCityName.value = subItem;
  }
  newData.value = []
  choose.value.index = subItem
  datalist[index].index = i
  datalist.map(item => {
    let obj = {
      id: item.id,
      name: item.name,
      children: [item.children[item.index]],
      // 新增区域选择参数
      ...(item.id === 5 && {
        city: currentCityName.value,
        district: selectedDistrictIndex.value,
        selectedDistrict: '全部'
      })
    }
    obj.updateTime = null
    // obj.subCity = item.subChildren
    newData.value.push(obj)
  })
  // console.log(newData[newData.length-1])
  getPolicy({ categories: newData.value, index: activeIndex.value, keyWord: keyWord.value, timePeriod: timeRange.value })
  sessionStorage.setItem('categories', JSON.stringify(datalist))
}
// 新增：历史检索条件的初始化 storage有效期为关闭网页前
const initClass = () => {
  const cityData = datalist[5].subChildren.find(c => c.name === datalist[5].children[datalist[5].index]);
  // 显示区县选择器（需要新增状态）
  console.log('init', cityData)
  currentCityDistricts.value = cityData?.children || [];
  console.log(currentCityDistricts.value);
  if (currentCityDistricts.value.length > 0) {
    showDistrictSelector.value = true;
  } else {
    showDistrictSelector.value = false;
  }
  currentCityName.value = datalist[5].children[datalist[5].index]

  newData.value = []
  // choose.value.index = subItem
  // datalist[index].index = i
  datalist.map(item => {
    let obj = {
      id: item.id,
      name: item.name,
      children: [item.children[item.index]],
      // 新增区域选择参数
      ...(item.id === 5 && {
        city: currentCityName.value,
        selectedDistrict: currentCityDistricts.value[selectedDistrictIndex.value]
      })
    }
    obj.updateTime = null
    // console.log(obj);
    // obj.subCity = item.subChildren
    newData.value.push(obj)
  })
  /////////

  // console.log(newData.value);
}

// 获取政策列表
const getPolicy = async ({ categories, index, keyWord, timePeriod }) => {
  let params = {
    categories: newData.value,
    query1: tabs.value[index],
    query2: keyWord ? keyWord : '',
    timePeriod: timePeriod
  }
  activeIndex.value = index
  // console.log(keyWord)
  if (keyWord) {
    await searchFun()
    return
  }
  else {
    if (activeIndex.value == 2) {
      console.log('精准推荐');
      const res = await policyUserHobby(userId.value)
      console.log(res.row, 333);
      policyinfoData.value = res.data.row
      total.value = res.data.total
      return
    }
    const res = await policyinfoAPI(params)
    total.value = res.data.total
    console.log(params);

    if (res.status != 0) return
    policyinfoData.value = res.data.row
  }
  //最新政策
  if (activeIndex.value == 1) {

    policyinfoData.value.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))

  }
  //热度推荐
  if (activeIndex.value == 0) {
    policyinfoData.value.sort((a, b) => new Date(b.hotLevel) - new Date(a.hotLevel))

  }
  //申报去除过期数据
  if (categories[4].children[0] == '申报中') {
    policyinfoData.value = policyinfoData.value.filter(item => daysUntil(item.expireDate) !== '已过期')
    console.log(policyinfoData.value.length);
    total.value = policyinfoData.value.length
  }
}
const getKeyWordPolicy = async ({ categories, index, keyWord, timePeriod }) => {
  let params = {
    categories: newData.value,
    query1: tabs.value[index],
    query2: '',
    timePeriod: timePeriod
  }
  let res = []
  policyinfoData.value = []
  total.value = 0
  for (let item of keyWord) {
    // console.log('item',item)
    params.query2 = item
    let data = await policyinfoAPI(params)
    res = [...res, ...data?.data?.row]
  }
  // keyWord.forEach(item => {
  //   params.query2=item
  //   let data=policyinfoAPI(params)
  //   res.push(data.data.row)
  // })
  const unique = Array.from(new Map(res.map(item => [item.id, item])).values());
  policyinfoData.value = unique
  // 确保total也被更新
  total.value = unique.length

}

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return policyinfoData.value.slice(start, end)
})

const handlePageChange = (page) => {
  currentPage.value = page
}
// 获取政策分类数据
const getPolicyClassInfo = async () => {
  // let policyName=urlParams.policyName
  const res = await policyclassinfoAPI()
  policyCalssinfo.value = res.data
  policyCalssinfo.value.forEach(item => item.index = 0)
  if (res.status == 0) {
    //新增：是否有时间历史记录
    if (sessionStorage.getItem('time')) {
      timeRange.value = JSON.parse(sessionStorage.getItem('time'))
      dateRange.value = JSON.parse(sessionStorage.getItem('time'))
      // console.log(timeRange.value)
    }
    //新增：是否有区县历史记录
    if (sessionStorage.getItem('selectedDistrictIndex')) {
      selectedDistrictIndex.value = parseInt(sessionStorage.getItem('selectedDistrictIndex'))
      // console.log(selectedDistrictIndex.value)
    }
    // 新增：查看是否有关键词
    if (sessionStorage.getItem('keyWord')) {
      keyWord.value = String(JSON.parse(sessionStorage.getItem('keyWord')))
      // console.log(keyWord.value)
    }
    // 新增：查看是否有历史检索条件
    if (sessionStorage.getItem('categories')) {
      datalist = JSON.parse(sessionStorage.getItem('categories'));
      // console.log('storage数据', datalist)
      selectAllCategories('cookie')
      initClass()
    }
    else {
      //新增：没有历史检索条件，初始化默认分类
      console.log('初始数据')
      datalist = policyCalssinfo.value
      selectAllCategories('selectAll')
    }
    console.log(newData.value, 11);
    // keyWord.value = getKeyWordCookie()
    // console.log(kw)
    getPolicy({ categories: newData.value, index: activeIndex.value, keyWord: keyWord.value, timePeriod: timeRange.value })

  }

}
//新增方法：切换tab时，保存当前tab索引
const handleTabChange = (index) => {
  setTabCookie(index)
  activeIndex.value = index
  getPolicy({ categories: newData.value, index: index, keyWord: keyWord.value, timePeriod: timeRange.value })
}
// 新增方法：构建全选分类参数 补充：默认勾选全部 ，若有历史记录则根据storage的内容勾选
const selectAllCategories = (status) => {
  if (status == 'selectAll') {
    newData.value = policyCalssinfo.value.map(category => {
      let obj = {
        id: category.id,
        name: category.name,
        children: [category.children[0]], // 直接使用全部子项
        // 如果有其他字段需要保留（如 subCity），需一并处理
        updateTime: null
      }
      if (category.id == 5) {
        obj.selectDistrict = '全部'
      }

      return obj
    });
  }
  else {
    // console.log(datalist)
    newData.value = datalist.map(category => {
      let obj = {
        id: category.id,
        name: category.name,
        children: [category.children[0]], // 直接使用全部子项
        // 如果有其他字段需要保留（如 subCity），需一并处理
        updateTime: null
      }
      // if (category.id == 5) {
      //    obj.selectDistrict = '全部'
      // }

      return obj
    });

  }


};
const searchFun = () => {
  // let keyPiece=keyWord.value.replace(/[\s 、+]+/g, '')
  let keyPiece = [keyWord.value.replace(/[\s 、+]+/g, '')]
  let spiltData = keyWord.value.split(/[\s 、+]+/)
  if (spiltData.length != 1) {
    keyPiece = [...keyPiece, ...spiltData]
  }

  ElMessage({
    message: keyPiece,
    type: 'warning'
  })
  getKeyWordPolicy({ categories: newData.value, index: activeIndex.value, keyWord: keyPiece, timePeriod: timeRange.value })
  // 新增：将关键词存储到sessionStorage
  sessionStorage.setItem('keyWord', JSON.stringify(keyWord.value))
  // getPolicy({ categories: newData.value, index: activeIndex.value, keyWord: keyWord.value, timePeriod: timeRange.value })
}
// 区县选择方法
const selectDistrict = (district, index) => {
  // 保存区县索引
  selectedDistrictIndex.value = index;
  sessionStorage.setItem('selectedDistrictIndex', selectedDistrictIndex.value)
  // 更新筛选参数（需根据接口要求调整）
  newData.value = newData.value.map(item => {

    if (item.id === 5) {
      return {
        ...item,
        selectedCity: currentCityName.value,
        selectedDistrict: district
      };
    }
    return item;
  });

  getPolicy({
    categories: newData.value,
    index: activeIndex.value,
    keyWord: keyWord.value,
    timePeriod: []
  });
};
onMounted(async () => {
  // if(useCounterStore.count==undefined) useCounterStore.count=1
  // else{activeIndex.value=useCounterStore.count}
  if (getTabCookie() != undefined) activeIndex.value = await Number(getTabCookie())
  else { activeIndex.value = 1 }
  // console.log(activeIndex.value);
  getPolicyClassInfo()
  const info = getCookie()
  if (info) {
    userId.value = info.id
  }
})

onUnmounted(() => {
  removeKeyWordCookie()
})
const formatDate = (date) => {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  // console.log(`${year}-${month}-${day}`);

  return `${year}-${month}-${day}`
}
const timeFun = (time) => {
  if (time) {
    time = time.map((item) => formatDate(item))
    timeRange.value = time
    getPolicy({ categories: newData.value, index: activeIndex.value, keyWord: keyWord.value, timePeriod: timeRange.value })
    //新增：保存时间范围到storage
    sessionStorage.setItem('time', JSON.stringify(timeRange.value))
  } else {

    getPolicy({ categories: newData.value, index: activeIndex.value, keyWord: keyWord.value, timePeriod: [] })
  }
}

const detail = async (id) => {
  await policyNumberAPI(id)
  router.push({ path: `/detail`, query: { id } })
}

const lastDays = (deadTime) => {
  return daysUntil(deadTime)
}

const clearEvent = () => {
  timeRange.value = []
  dateRange.value = []
  sessionStorage.setItem('time', JSON.stringify([]))
}


</script>

<template>
  <div>
    <HomeHeader></HomeHeader>
    <div class="banner" style="position: relative;">
      <img src="../assets/images/banner1.png" alt="">
      <div style="position: absolute; left: 6vw;top: 3vw;">
        <h2 style="margin-bottom: 0.5vw;">政策查询</h2>
        <span style=" font-size: 1vw;
    font-weight:lighter;
    color:grey;">汇集最新行业政策，智能解读匹配，政策支持早知道</span>
      </div>
    </div>
    <!-- // 政策分类区域 -->
    <div id="area">
      <div class="bb" :key="item.id" v-for="(item, index) in policyCalssinfo">
        <span style="flex:1;text-align: right;height: 2vw;line-height: 2vw;float: left;">{{ item.name }}：</span>
        <div id="nn">
          <span style="margin-left:1vw;padding: 0 1vw;text-align: center;" :key="i"
            v-for="(subItem, i) in item.children"
            :class="{ active: newData.find(d => d.id === item.id)?.children[0] === subItem }"
            @click="changeIndex(subItem, index, i)">
            {{ subItem }}
          </span>
        </div>
      </div>
      <!-- 在政策分类区域下方添加 -->
      <div v-if="showDistrictSelector" style="margin-top: -1vw;">
        <div class="bb">
          <span style="flex:1;text-align: right;">{{ currentCityName }}区县：</span>
          <div id="nn">
            <!-- <span style="margin-left:1vw;padding: 0 1vw;text-align: center;">市本级</span> -->
            <span style="margin-left:1vw;padding: 0 1vw;text-align: center;"
              v-for="(district, di) in currentCityDistricts" :key="di" :class="{ active: selectedDistrictIndex === di }"
              @click="selectDistrict(district, di)">
              {{ district }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 政策列表 -->
    <div class="box">
      <div id="search_tabs_box">
        <div class="block block_span">
          <div style="display: flex;margin-right: 13vw;padding-left: 2vw;width: 35%;">
            <span :class="{ activeSpan: activeIndex === index }" @click="handleTabChange(index)"
              v-for="item, index in tabs" :key="index">{{ item }}</span>

          </div>
          <!-- 时间组件 -->
          <div style="width:50%;display: flex;justify-content: flex-end;align-items: center;">
            <el-config-provider :locale="locale">
              <el-date-picker style="height: 2vw;width: 20vw;font-size:1vw;" v-model="dateRange" type="daterange"
                range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" @change="timeFun"
                @clear="clearEvent" />
            </el-config-provider>
            <el-tooltip placement="top" effect="light" content="输入多个关键词时支持的格式: ①“科技 发展”②“科技、发展”③“科技+发展”"
              :trigger-keys="[]">
              <el-input style="height: 2vw;font-size:1vw;margin: 0 1vw;width:10vw" v-model="keyWord"
                placeholder="请输入政策名称" :suffix-icon="Calendar" />
            </el-tooltip>
            <el-button style="height: 2vw;font-size:1vw; padding: 0 1vw;" type="primary"
              @click="searchFun">智能搜索</el-button>

          </div>
        </div>

      </div>
      <div id="policy_box">
        <div class="policyItem" v-for="item in paginatedData" :key="item.id">
          <div class="left" style="display: flex;flex-direction: column;">
            <div style="display: flex; ">
              <span class="iconfont">
                <img src="../assets/images/定位.png" alt="">
                <span style="margin-left:0.5vw;">{{ item.applicableArea }}</span>
              </span>
              <h3 class="h3-hidden" style="margin-left: 1vw;cursor:pointer" @click="detail(item.id)">{{ item.name }}
              </h3>
            </div>

            <div style="display: flex; color: #ccc;margin-top: 0.5vw;">
              <span style="margin-right: 2vw;">牵头部门：{{ item.leaderDepartment }}</span>
              <span>发布时间：{{ item.publishDate.split("T")[0] }}</span>
            </div>

          </div>
          <div class="right" style="display: flex;justify-content: space-between;">
            <div style="margin-right: 20px;text-align: center;">
              <span>政策访问量</span>
              <h3><i style="font-style: normal;font-size: 2vw;">{{ item.hotLevel }}</i>次</h3>
            </div>
            <div style="text-align: center;display: flex;flex-direction: column;">
              <span>政策剩余时间</span>
              <h3 style="padding-top: 1px;"><i style="font-style: normal;font-size: 1vw;">{{ daysUntil(item.expireDate)
                  }}</i></h3>
            </div>
          </div>
        </div>


        <!-- <Pagination
        :itemsPerPage="itemsPerPage"
        :totalItems="policyinfoData.length"
        @page-changed="handlePageChange"
      /> -->
        <Pagination :itemsPerPage="itemsPerPage" :totalItems="total" :currentPage="currentPage"
          @page-changed="handlePageChange" />
      </div>

    </div>
    <!-- 底部区域 -->
  </div>
</template>


<style scoped>
.banner {
  z-index: -999;
}

.banner img {
  width: 100%;
  margin-top: 0.3vw;
}

#nn {
  display: flex;
  flex-wrap: wrap;
  flex: 12;
}

.bb {
  width: 100%;
  display: flex;
  margin-bottom: 1vw;
}


#area {
  width: 95%;
  margin: 0 auto;
  /* height: 80vw !important; */
  /* background-color: #f3f9ff; */
  font-size: 0.8vw !important;
  padding: 0 5.5vw 2vw 5.5vw;
  /* height: 38vw; */
  display: flex;
  flex-direction: column;
  height: auto;
}

#nn {
  height: 2vw;
  line-height: 2vw;
  display: flex;
  flex-wrap: wrap;
  flex: 12;
  height: auto;
}

#nn:hover {
  cursor: pointer;
}

#nn span {
  flex-grow: 0;
  flex-shrink: 1;
}

.active {
  border-radius: 0.3vw;
  background: linear-gradient(45deg, #3580F5, #5FA2FD);
  color: white;
}

#geli_box {
  width: 85%;
  height: 1vw;
}

.box {
  padding: 1vw 5.5vw;

  width: 95%;
  margin: 0 auto;
}

#policy_box {

  margin-top: 1vw;
}

.policyItem {
  font-size: 1vw;
  height: 5vw;
  background-color: #fff;
  display: flex;
  margin-bottom: 1vw;
  justify-content: space-between;
  align-items: center;
  padding: 0.5vw 2vw;
  border-radius: 10px;
}

.policyContent {
  text-align: left;
}

#search_tabs_box {


  background-color: #fff;
  padding: 1vw 0;
}

.block {

  display: flex;
}

.block_span span {
  display: block;
  display: flex;
  width: 8vw;
  height: 2.5vw;
  border-right: 0.1vw solid #ecebeb;
  justify-content: center;
  align-items: center;
  font-size: 0.8vw;
}

.block_span span:hover {
  cursor: pointer;
}

.block_span .activeSpan {

  background: linear-gradient(45deg, #3580F5, #5FA2FD);
  color: #fff;
}



.iconfont {
  display: flex;
  align-items: center;
  font-size: 1vw;

}

.iconfont img {
  width: 1vw;
  height: 1.2vw;
}

.h3-hidden {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 55vw;
}
</style>
