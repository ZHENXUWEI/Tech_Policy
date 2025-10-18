<script setup>
import HomeHeader from "@/components/HomeHeader.vue"
import { ref, onMounted,nextTick } from "vue"
import { setKeyWordCookie, getCookie } from '@/utils/cookie'
import { policyinfoAPI, policystatusAPI, policyNumberAPI, policyVisitNAPI, policyMatchNAPI, policyPushAPI, policyeffectiveAPI, policyclassinfoAPI } from "@/api/policy"
import { More, Search } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router';
import { daysUntil } from "@/utils/daysUtil"
import { useCounterStore } from "../stores/counter";
const router = useRouter();
const route = useRoute();
const policyStatus = ref({});
const policyinfoNewData = ref({});
const policyinfoHotData = ref({});
const policyinfoPushData = ref({});
const policyEffectiveData = ref({})
const searchData = ref("");
const refineOpts = ref([
])
const activeIndexList = ref([999, 999])//当前选中的tab 默认999避免选中
const loadingList = ref([true, true])//政策模块加载状态绑定
let params = [
        {
            "id": 0,
            "name": "发布时间",
            "children": [
                "全部"
            ],
            "updateTime": null
        },
        {
            "id": 1,
            "name": "政策类别",
            "children": [
                "全部"
            ],
            "updateTime": null
        },
        {
            "id": 2,
            "name": "政策类型",
            "children": [
                "全部"
            ],
            "updateTime": null
        },
        {
            "id": 3,
            "name": "牵头部门",
            "children": [
                "全部"
            ],
            "updateTime": null
        },
        {
            "id": 4,
            "name": "申报状态",
            "children": [
                "全部"
            ],
            "updateTime": null
        },
        {
            "id": 5,
            "name": "适用区域",
            "children": [
                "全部"
            ],
            "updateTime": null,
            "selectDistrict": "全部"
        }
    ]
const lastDays = (deadTime) => {

    return daysUntil(deadTime)
}
const getpolicyEffectiveData = async (category, init = false) => {
    var jsonData = {
        categories: [],
        query1: "可申报政策",
        query2: "",
        timePeriod: []
    }
    const res = await policyeffectiveAPI(jsonData)
    // console.log("233" + res)
    if (res.data == undefined) {
        policyEffectiveData.value = []
        return
    }
    var arr = res.data.row

    var newArr = []

    for (var i = 0; i < arr.length; i++) {
        newArr.push(arr[i])
        if (newArr.length == 5) break
    }

    // for(var i=0;i<arr.length;i++){
    //     if(lastDays(arr[i].expireDate)!="已过期"){
    //         // console.log(arr[i])
    //         newArr.push(arr[i])
    //         if(newArr.length==5) break
    //     }
    // }
    if (init==false) {
        policyEffectiveData.value = newArr
    }
    else {
        return newArr || []
    }
    // console.log(arr.length)
    // if (arr.length > 5) {
    //     policyEffectiveData.value = arr.slice(0, 5);
    // } else {
    //     policyEffectiveData.value = arr
    // }

}


const getPolicyNewData = async (category, init = false) => {
    // console.log(type1,policyType,subPolicyType)
    var jsonData = {
        categories: category || [],
        query1: "最新政策",
        query2: "",
        timePeriod: []
    }
    const jsonString = JSON.stringify(jsonData);
    const res = await policyinfoAPI(jsonString)
    if (!res ||res.data == undefined) {
        policyinfoNewData.value = []
        return
    }
    var arr = res.data.row || []
    arr = arr.slice(0, 10).sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate)) || []
    if (!init) {
        policyinfoNewData.value = arr
    }
    else {
        return arr || []
    }
    // console.log("-----------")
    // console.log(arr)
    //  var newArr=[]

    //  for(var i=0;i<arr.length;i++){
    //     newArr.push(arr[i])
    //     if(newArr.length==5) break
    //  }
    // for(var i=0;i<arr.length;i++){
    //     if(lastDays(arr[i].expireDate)!="已过期"){
    //         // console.log(arr[i])
    //         newArr.push(arr[i])
    //         if(newArr.length==5) break
    //     }
    // }
    // console.log(newArr)
    // newArr.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))

    // policyinfoNewData.value=newArr
    // policyinfoNewData.value.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
    // console.log(arr.length)
    // if (arr.length > 5) {
    //     policyinfoNewData.value = arr.slice(0, 5);
    // } else {
    //     policyinfoNewData.value = arr
    // }


}

const getPolicyHotData = async (category, init = false) => {

    // console.log(type1,policyType,subPolicyType)
    var jsonData = {
        categories: category || [],
        query1: "浏览量",
        query2: "",
        timePeriod: []
    }
    const jsonString = JSON.stringify(jsonData);
    const res = await policyinfoAPI(jsonString)

    if (res.data == undefined) {
        policyinfoHotData.value = []
        return
    }
    var arr = res.data.row
    // var newArr=[]

    // for(var i=0;i<arr.length;i++){
    //     newArr.push(arr[i])
    //     if(newArr.length==5) break
    //  }
    // for(var i=0;i<arr.length;i++){
    //     if(lastDays(arr[i].expireDate)!="已过期"){
    //         // console.log(arr[i])
    //         newArr.push(arr[i])
    //         if(newArr.length==5) break
    //     }
    // }
    arr =arr.slice(0, 10);
    if (init==false) {
        policyinfoHotData.value = arr
    }
    else {
        return arr.slice(0, 10) || [];
    }
    // policyinfoHotData.value=newArr
    // if (arr.length > 5) {
    //     policyinfoHotData.value = arr.slice(0, 5);
    // } else {
    //     policyinfoHotData.value = arr
    // }
}

const getPolicyPushData = async (category, init = false) => {
    const info = getCookie()
    // console.log(1111111111111111)
    // console.log(info.id)
    let res;
    if (info) {
        if (info.id) {
            res = await policyPushAPI(info.id)//'getCookie().id'
        }
    }
    //  console.log(res)
    // if (res.data == undefined) {
    //     policyinfoHotData.value = []
    //     return
    // }

    var arr = res.data.row
    // console.log(arr)
    var newArr = []

    for (var i = 0; i < arr.length; i++) {
        newArr.push(arr[i])
        if (newArr.length == 5) break
    }

    // for(var i=0;i<arr.length;i++){
    //     if(lastDays(arr[i].expireDate)!="已过期"){
    //         // console.log(arr[i])
    //         newArr.push(arr[i])
    //         if(newArr.length==5) break
    //     }
    // }
    if (init==false) {
        policyinfoPushData.value = newArr
    }
    else {
        return newArr || []
    }
    // if (arr.length > 5) {
    //     policyinfoPushData.value = arr.slice(0, 5);
    // } else {
    //     policyinfoPushData.value = arr
    // }
    // console.log(policyinfoPushData.value)

}
const getLastDayData=async()=>{
    var jsonData = {
        categories: [],
        query1: "昨日新增",
        query2: "",
        timePeriod: []
    }
    const jsonString = JSON.stringify(jsonData);
    const res = await policyinfoAPI(jsonString)

    if (res.data == undefined) {
        return []
    }
    return res.data.total
}

const detail = async (id) => {
    await policyNumberAPI(id)
    router.push({ path: `/detail`, query: { id } })
}

onMounted(async () => {
    params.find(item=>item.name==="政策类型").children=['全部']
    await getClassinfo()
    try {
        const [ newDataResult,hotDataResult,statusResult,lastDResult] = await Promise.all([
            getPolicyNewData(params,true),
            getPolicyHotData(params,true),
            policystatusAPI(),
            getLastDayData()
        ]);
        // console.log(newDataResult)
        // console.log(hotDataResult)
        policyinfoNewData.value = newDataResult || []
        policyinfoHotData.value = hotDataResult || []
        policyStatus.value = statusResult.data || []
        policyStatus.value['total']=lastDResult
        activeIndexList.value = [0, 0]
    }
    catch (err) {
        console.log('数据加载失败',err)
        policyinfoNewData.value = []
        policyinfoHotData.value = []
    }finally{
        loadingList.value = [false, false]
    }


    // getClassinfo() 
 
    // await getPolicyPushData()
    // await getpolicyEffectiveData()
})
const searchFun = () => {
    setKeyWordCookie(searchData.value)
    router.push({ path: `/policy` })
}

const toPolicyModelFun = async () => {
    const info = getCookie()
    if (!info) {

        return
    }
    await policyMatchNAPI()
    router.push("/policyModel")
}


const toPolicyModelYuCeFun = async () => {
    const info = getCookie()
    if (!info) {

        return
    }
    await policyMatchNAPI()
    router.push("/policyModelYuCe")
}
const currentYear = ref(null);
currentYear.value = new Date().getFullYear();

//type为从左到右 从上到下 政策内容模块的序号
const moreInfo = (type) => {
    useCounterStore.count=type;
    console.log(useCounterStore.count)
    router.push("/policy")
}
const getClassinfo = async () => {
    let res = await policyclassinfoAPI()
    if (res.data) {
        refineOpts.value = res.data[1].children.slice(0, -1) || []
    }
}

//query-分类参数，type-政策类型，index-当前选中分类
const getPolicyRefineData = async (query, type, index) => {
    // console.log(query,type,index)
    params.find(item => item.name === "政策类型").children=[query]
    loadingList.value[type] = true
    if (type == 0) {
        policyinfoNewData.value = []
        await getPolicyNewData(params)
        activeIndexList.value[type] = index
    }
    else if (type == 1) {
        policyinfoHotData.value = []
        await getPolicyHotData(params)
        activeIndexList.value[type] = index
    }
    loadingList.value[type] = false
}

</script>

<template>
    <div id="main">
        <HomeHeader></HomeHeader>
        <div class="banner">
            <div class="image-wrapper">
                <img width="100%;" src="../assets/images/banner.jpg" alt=""/> 
                </div>
            <div class="policySearch">
                <div class="info">
                    <p>政策信息查询</p>
                    <p>汇集最新行业政策,智能解读匹配,政策支持早知道</p>
                </div>

                <div class="search">
                    <el-icon style="font-size: 1.5vw; color:#ccc;margin:0 1vw 0 1vw">
                        <Search />
                    </el-icon>
                    <input id="username" type="text" placeholder="请输入政策名称" v-model="searchData" />
                    <button class="btn" @click="searchFun">智能搜索</button>
                </div>

            </div>
            <div class="policyOverview">

                <div class="policyOverview_show">
                    <img src="../assets/images/政策数量.png" alt="">
                    <div>
                        <p>
                            <font>{{ policyStatus.policyN }}</font>条
                        </p>
                        <p>政策库</p>
                    </div>
                </div>

                <div class="policyOverview_show">
                    <img src="../assets/images/政策智能匹配.png" alt="">
                    <div>
                        <p>
                            <font>{{ policyStatus.total }}</font>条
                        </p>
                        <p>今日新增</p>
                    </div>
                </div>

                <div class="policyOverview_show">
                    <img src="../assets/images/用户访问.png" class="policyOverview_img" alt="">
                    <div>
                        <!-- <p><font >{{ policyStatus.userVisitN}}万+</font>次</p> -->
                        <p>
                            <font>{{ policyStatus.userVisitN }}</font>次
                        </p>
                        <p>用户访问</p>
                    </div>
                </div>

                <!-- <div class="policyOverview_show">
                    <img src="../assets/images/企业用户.png" class="policyOverview_img" alt="">
                    <div>
                        <p>
                            <font>{{ policyStatus.companyN }}</font>个
                        </p>
                        <p>企业用户</p>
                    </div>
                </div>

                <div class="policyOverview_show">
                    <img src="../assets/images/政策智能匹配.png" class="policyOverview_img" alt="">
                    <div>
                        <p>
                            <font>{{ policyStatus.matchN }}</font>次
                        </p>
                        <p>政策智能匹配</p>
                    </div>
                </div>

                <div class="policyOverview_show">
                    <img src="../assets/images/企业申报数量.png" class="policyOverview_img" alt="">
                    <div>
                        <p>
                            <font>{{ policyStatus.declarationN }}</font>次
                        </p>
                        <p>企业申报数量</p>
                    </div>
                </div> -->

            </div>
        </div>

        <!-- <div class style="position: absolute;width: 100%;top:90%;background-color: #F8F9FE;"> -->
        <div class="policy_new">
            <div class="policy_left">
                <div class="newP">
                    <div style="display: flex;justify-content: space-between;">
                        <h1>最新政策</h1><span style="width:3vw;" v-loading="loadingList[0]" element-loading-custom-class="maxheight-5vw"
                            element-loading-background="rgba(255,255,255,0)"></span>
                    </div>
                    <p :class="loadingList[0] == 1 ? 'disabled' : ''"><span @click='getPolicyRefineData(item, 0, index)'
                            :style="{ color: index == activeIndexList[0] ? '#3276FD' : 'rgba(0,0,0,0.85)' }"
                            style="font-size: 1.1vw;cursor: pointer;" v-for="(item, index) in refineOpts"
                            :key="index">{{ item }}</span></p>
                    <!-- <p @click="moreInfo" style="cursor: pointer;">更多>></p> -->
                </div>
                <el-skeleton :count="5" animated :loading='loadingList[0]'>
                    <template #template>
                        <!-- <el-skeleton-item  variant="p" style="height: 0.85vw;"/> -->
                        <div class="el-card">
                            <el-skeleton-item variant="p" style="height: 2.98vw;margin-top:0.3vw" />
                            <div style="display: flex;">
                                <div style="margin-top: 1vw;">
                                    <el-skeleton-item variant="p" style="height: 0.8vw;width:80%;margin-top:0.13vw" />
                                </div>
                                <div style="margin-top: 0.7vw;text-align: end;">
                                    <el-skeleton-item style="width: 7vw;height: 1.3vw;" variant="p"></el-skeleton-item>
                                    <el-skeleton-item style="width: 7vw;height: 1.3vw;margin-left: 1vw;" variant="p"></el-skeleton-item>
                                </div>
                                 
                            </div>
                        </div>
                    </template>
                </el-skeleton>
                <div class="el-card " v-for="(item, index) in policyinfoNewData" :key="index">
                    <h5 @click="detail(item.id)">{{ item.policyName }}</h5>
                    <div class="policyInfo">
                        <div style="width: 55%">
                            <p>
                                <span>牵头部门：</span><span>{{ item.leaderDepartment }}</span>
                                <span style="margin-left: 0.5vw;">发布时间：</span><span>{{ item.publishDate.split('T')[0] }}</span>
                            </p> 
                        </div>
                        <div  style="width: 45%;margin-top: 0.7vw;text-align: end;">
                            <el-tag type="danger">{{ lastDays(item.expireDate) }}</el-tag>
                            <el-tag style="margin-left: 1vw;">{{ item.policyType ? item.policyType : "暂无政策类型" }}</el-tag>
                        <!-- {{ item.isMoney ? "资金支持" : "无资金支持" }} -->
                        </div>
                    </div>
                </div>
                <div style="display: flex;justify-content: end;margin-top: 1vw;font-size: 1vw;">
                    <p @click="moreInfo(0)" style="cursor: pointer;">更多>></p>
                </div>
                <el-empty v-if="policyinfoNewData.length == 0" description="没有找到相关政策信息" />
            </div>

            <div class="policy_right">
                <div class="newP">
                    <div style="display: flex;justify-content: space-between;">
                        <h1>热度推荐</h1><span style="width:3vw" v-loading="loadingList[1]" element-loading-custom-class="maxheight-5vw"
                            element-loading-background="rgba(255,255,255,0)"></span>
                    </div>
                    <p :class="loadingList[1] == 1 ? 'disabled' : ''"><span @click='getPolicyRefineData(item, 1, index)'
                            :style="{ color: index == activeIndexList[1] ? '#3276FD' : 'rgba(0,0,0,0.85)' }"
                            style="font-size: 1.1vw;cursor: pointer;" v-for="(item, index) in refineOpts"
                            :key="index">{{ item }}</span></p>
                    <!-- <p @click="moreInfo" style="cursor: pointer;">更多>></p> -->
                </div>
                <el-skeleton :count="5" animated :loading='loadingList[1]'>
                    <template #template>
                        <!-- <el-skeleton-item  variant="p" style="height: 0.85vw;"/> -->
                        <div class="el-card">
                            <el-skeleton-item variant="p" style="height: 2.98vw;margin-top:0.3vw" />
                            <div style="display: flex;">
                                <div style="margin-top: 1vw;">
                                    <el-skeleton-item variant="p" style="height: 0.8vw;width:80%;margin-top:0.13vw" />
                                </div>
                                <div style="margin-top: 0.7vw;text-align: end;">
                                    <el-skeleton-item style="width: 7vw;height: 1.3vw;" variant="p"></el-skeleton-item>
                                    <el-skeleton-item style="width: 7vw;height: 1.3vw;margin-left: 1vw;" variant="p"></el-skeleton-item>
                                </div>
                                 
                            </div>
                        </div>
                    </template>
                </el-skeleton>
                <div class="el-card " v-for="(item, index) in policyinfoHotData" :key="index">
                    <h5 @click="detail(item.id)">{{ item.name }}</h5>
                    <div class="policyInfo">
                        <div style="width: 55%">
                            <p>
                                <span>牵头部门：</span><span>{{ item.leaderDepartment }}</span>
                                <span style="margin-left: 0.5vw;">发布时间：</span><span>{{ item.publishDate.split('T')[0] }}</span>
                            </p> 
                        </div>
                        <div style="width: 45%;margin-top: 0.7vw;text-align: end;">
                            <el-tag type="danger">{{ lastDays(item.expireDate) }}</el-tag>
                            <el-tag style="margin-left: 1vw;">{{ item.policyType ? item.policyType : "暂无政策类型" }}</el-tag>
                        <!-- {{ item.isMoney ? "资金支持" : "无资金支持" }} -->
                        </div>
                    </div>
                </div>
                <div style="display: flex;justify-content: end;margin-top: 1vw;font-size: 1vw">
                    <p @click="moreInfo(1)" style="cursor: pointer;">更多>></p>
                </div>
                <el-empty v-if="policyinfoHotData.length == 0" description="没有找到相关政策信息" />

            </div>
        </div>
        <!-- <div class="policy_new policy_new_extra">
            <div class="policy_left">
                <div class="newP">
                    <h1>精准推送政策</h1>
                    <p @click="moreInfo" style="cursor: pointer;">更多>></p>
                </div>
                <div class="el-card" v-for="(item, index) in policyinfoPushData" :key="index">
                    <h5 @click="detail(item.id)">{{ item.policyName }}</h5>
                    <p>
                        <span>牵头部门：</span><span>{{ item.leaderDepartment }}</span>
                        <span style="margin-left: 0.5vw;">发布时间：</span><span>{{ item.publishDate.split('T')[0] }}</span>
                    </p>
                    <div>
                        <el-tag type="danger">{{ lastDays(item.expireDate) }}</el-tag>
                        <el-tag style="margin-left: 1vw;">{{ item.policyType ? item.policyType:"暂无政策类型"}}</el-tag>
                        
                    </div>
                </div>
            </div>
            <div class="policy_right">
                <div class="newP">
                    <h1>可申报政策</h1>
                    <p @click="moreInfo" style="cursor: pointer;">更多>></p>
                </div>
                <div class="el-card " v-for="(item, index) in policyEffectiveData" :key="index">
                    <h5 @click="detail(item.id)">{{ item.policyName }}</h5>
                    <p>
                        <span>牵头部门：</span><span>{{ item.leaderDepartment }}</span>
                        <span style="margin-left: 0.5vw;">发布时间：</span><span>{{ item.publishDate.split('T')[0] }}</span>
                    </p>
                    <div>
                        <el-tag type="danger">{{ lastDays(item.expireDate) }}</el-tag>
                        <el-tag style="margin-left: 1vw;">{{ item.policyType ? item.policyType:"暂无政策类型"}}</el-tag>
                       
                    </div>
                </div>
            </div>
        </div> -->


        <!-- <div class="hotpolicy">
            <div class="hotpolicy_header">
                <h3>热门评价模型</h3>
                <p>海量项目申报查询 &nbsp;&nbsp;&nbsp;&nbsp; 一对一政策精准评价</p>
            </div>

            <div class="enterprise">
                <div>
                    <img class="model_img" src="../assets/images/模型0.png" alt="">
                    <h4>{{ currentYear }}科技型中小企业</h4>
                    <span class="txt">浙江省科学技术厅</span>
                    <span class="enterprise_text" @click="toPolicyModelFun" style="cursor: pointer;">
                        立即自评</span>
                </div>
                <div>
                    <img class="model_img" src="../assets/images/模型1.png" alt="">
                    <h4>{{ currentYear }}高新技术企业</h4>
                    <span class="txt">浙江省科学技术厅</span>
                    <span class="enterprise_text" @click="toPolicyModelFun" style="cursor: pointer;">
                        立即自评</span>
                </div>
                <div>
                    <img class="model_img" src="../assets/images/模型2.png" alt="">
                    <h4>{{ currentYear }}国家企业技术中心</h4>
                    <span class="txt">浙江省科学技术厅</span>
                    <span class="enterprise_text" @click="toPolicyModelFun" style="cursor: pointer;">
                        立即自评</span>
                </div>

                <div>
                    <img class="model_img" src="../assets/images/模型3.png" alt="">
                    <h4>{{ currentYear }}创新型中小企业</h4>
                    <span class="txt">浙江省经济和信息化厅</span>
                    <span class="enterprise_text" @click="toPolicyModelFun" style="cursor: pointer;">
                        立即自评</span>
                </div>

                <div>
                    <img class="model_img" src="../assets/images/模型4.png" alt="">
                    <h4>{{ currentYear }}专精特新中小企业</h4>
                    <span class="txt">浙江省经济和信息化厅</span>
                    <span class="enterprise_text" @click="toPolicyModelFun" style="cursor: pointer;">
                        立即自评</span>
                </div>

                <div>
                    <img class="model_img" src="../assets/images/模型5.png" alt="">
                    <h4>{{ currentYear }}专精特新小巨人企业</h4>
                    <span class="txt">浙江省经济和信息化厅</span>
                    <span class="enterprise_text" @click="toPolicyModelFun" style="cursor: pointer;">
                        立即自评</span>
                </div>
            </div>
        </div> -->
        <!-- <div class="hotpolicy">
            <div class="hotpolicy_header">
                <h3>热门预测模型</h3>
                <p>海量项目申报查询 &nbsp;&nbsp;&nbsp;&nbsp; 一对一政策精准预测</p>
            </div>

            <div class="enterprise">
                <div>
                    <img class="model_img" src="../assets/images/模型0.png" alt="">
                    <h4>{{ currentYear + 1 }}科技型中小企业</h4>
                    <span class="txt">浙江省科学技术厅</span>
                    <span class="enterprise_text" @click="toPolicyModelYuCeFun" style="cursor: pointer;">
                        立即自评</span>
                </div>
                <div>
                    <img class="model_img" src="../assets/images/模型1.png" alt="">
                    <h4>{{ currentYear + 1 }}高新技术企业</h4>
                    <span class="txt">浙江省科学技术厅</span>
                    <span class="enterprise_text" @click="toPolicyModelYuCeFun" style="cursor: pointer;">
                        立即自评</span>
                </div>
                <div>
                    <img class="model_img" src="../assets/images/模型2.png" alt="">
                    <h4>{{ currentYear + 1 }}国家企业技术中心</h4>
                    <span class="txt">浙江省科学技术厅</span>
                    <span class="enterprise_text" @click="toPolicyModelYuCeFun" style="cursor: pointer;">
                        立即自评</span>
                </div>

                <div>
                    <img class="model_img" src="../assets/images/模型3.png" alt="">
                    <h4>{{ currentYear + 1 }}创新型中小企业</h4>
                    <span class="txt">浙江省经济和信息化厅</span>
                    <span class="enterprise_text" @click="toPolicyModelYuCeFun" style="cursor: pointer;">
                        立即自评</span>
                </div>

                <div>
                    <img class="model_img" src="../assets/images/模型4.png" alt="">
                    <h4>{{ currentYear + 1 }}专精特新中小企业</h4>
                    <span class="txt">浙江省经济和信息化厅</span>
                    <span class="enterprise_text" @click="toPolicyModelYuCeFun" style="cursor: pointer;">
                        立即自评</span>
                </div>

                <div>
                    <img class="model_img" src="../assets/images/模型5.png" alt="">
                    <h4>{{ currentYear + 1 }}专精特新小巨人企业</h4>
                    <span class="txt">浙江省经济和信息化厅</span>
                    <span class="enterprise_text" @click="toPolicyModelYuCeFun" style="cursor: pointer;">
                        立即自评</span>
                </div>
            </div>
        </div> -->
       
    </div>
</template>

<style scoped>
.image-wrapper {
  width: 100%;
  height: 19.25vw; 
  overflow: hidden;
  position: relative;
}

.image-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto; 
  display: block;
}

input:-internal-autofill-previewed,
input:-internal-autofill-selected {
    transition: background-color 15000s ease-out 10s;
}

input::placeholder {
    font-size: 0.8vw;
    /* 设置占位符文字大小为18像素 */
    color: #909090;
    /* 设置占位符文字颜色 */
}

.banner {
    width: 100%;
    position: relative;
    z-index: -999;

}

.banner .policySearch {
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 38vw;
    height: 12vw;
    justify-content: space-around;

    left: 12.5%;
    /* top: 18%; */
    top: -1.8%;
    z-index: 9999;
}


.banner .policySearch .info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 4vw;

}

.policySearch .info p:first-child {
    font-size: 1.8vw;
    font-weight: bold;
}

.policySearch .info p:last-child {
    font-size: 1vw;
    font-weight: lighter;
    color: grey;
}

.policySearch .search {
    display: flex;
    align-items: center;
    width: 38vw;
    height: 3.5vw;
    background-color: white;
    border-radius: 0.5vw;
}

.policySearch #username {
    width: 28vw;
    outline: none;
    border: none;
    height: 3vw;
    font-size: 1.2vw;
    background-color: white;
}
.policySearch #username::placeholder {
    font-size: 1.1vw;
    line-height: 3vw;
    
}

.policySearch .btn {
    width: 6vw;
    height: 3vw;
    font-size: 1.1vw;
    outline: none;
    border: none;
    border-radius: 0.5vw;
    background: linear-gradient(45deg, #3580F5, #5FA2FD);
    color: white;
    cursor: pointer;
}

.policyOverview{
    height: 6vw !important;
}
.banner .policyOverview {
    /* width: 75%; */
    width: 38vw;
    height: 8vw;
    position: absolute;
    display: flex;
    justify-content: space-around;
    align-items: center;
    left: 31.7%;
    /* bottom: 0; */
    top:62.9%;
    transform: translate(-50%, 0);
    background-color: rgba(255, 255, 255, 0.5);

}



.policyOverview_show {
    display: flex;
}

.policyOverview_show img {
    /* width: 3vw; */
    max-width: 3.5vw;
    min-width: 3vw;
}

.policyOverview_show div {
    margin-left: 1vw;
    font-size: 1.1vw;
}

.policyOverview_show div font {
    font-size: 1.8vw;
    color: #3276FD;
}

.policy_new {
    display: flex;
    width: 75%;
    justify-self: center;
    justify-content: space-between;
    margin: 0 auto;
    background-color: #F8F9FE;
    margin: 0 20vw;
    /* margin-top: 5vw; */
    /* 0.7 */
    margin-top: 1.8vw;
}

.policy_new_extra {
    margin-top: 2.5vw;
}

.policy_left {
    width: 49%;
}

.policy_right {
    width: 49%;
}

.newP {
    margin-top: 0.5vw;
    height: 5vw;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-items: center;
    justify-content: space-around;

}

.newP h1 {
    font-size: 1.5vw;

}

.newP p {
    display: flex;
    text-align: start;
    justify-content: space-between;
    /* text-align: end;
    font-size: 0.8vw;
    color: #6B9EF7; */
}

.newP p>span:hover {
    background-color: var(--el-fill-color-light)
}


.el-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    /* margin-top:1vw; */
    margin-top: 0.5vw;
    padding: 0.7vw 1vw;
    /* height: 9.2vw; */
}

.el-card h5 {
    height: 3.6vw;
    max-height: 3.6vw;
    display: flex;
    /* flex-wrap: wrap; */
    cursor: pointer;
    font-size: 1.2vw;
    width: 100%;
    overflow: hidden;
    /* white-space: nowrap; */
    text-overflow: ellipsis;

}
.el-card p{
    margin-top:1vw;
}

.el-card span {
    font-size: 0.8vw;
    font-weight: normal;
}

.el-card div {
    width: 100%;
    height: 2vw;
    margin-bottom: 0.3vw;
    /* text-align: end */
}

.el-card div .el-tag {
    width: 7vw;
    padding: 0 1.5vw;
    font-size: 0.8vw;
    overflow-x: hidden;
    height: 1.3vw;
}


.hotpolicy {
    margin-top: 5vw;
    background-color: white;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    padding: 2vw;

}


.hotpolicy .hotpolicy_header {
    display: flex;
    height: 5vw;
    flex-direction: column;
    justify-content: center;

    align-items: center;
}

.hotpolicy .hotpolicy_header p {
    font-size: 0.8vw;
    font-weight: lighter;
    margin-top: 1vw;
}

.hotpolicy h3 {
    font-size: 1.8vw;
}

.hotpolicy .enterprise {
    width: 100%;
    display: flex;
    justify-content: space-around;
    padding-top: 1vw;
}

.enterprise div {
    width: 14%;
    height: 15vw;
    margin-top: 2vw;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: center;
    background-color: white;
    background-image: url("../assets/images/框.png");
    background-size: cover;
}

.enterprise div h4 {
    font-size: 1vw;
    font-weight: normal;
}

.enterprise div span {
    margin: 1vw 0;
}

.enterprise .txt {
    font-size: 0.8vw;
}

.model_img {
    width: 12vw;
    height: 12vw;
    position: absolute;
    left: 50%;
    top: -4vw;
    transform: translate(-50%, 0);
}

.enterprise_text {
    display: block;
    width: 7vw;
    height: 1.8vw;
    font-size: 1vw;
    text-align: center;
    background-color: #0d9deb;
    border-radius: 1vw;
    color: white;
    line-height: 1.8vw;
}

.disabled {
    pointer-events: none;
    opacity: 0.6;
}
.policyInfo{
    display: flex
}
:deep(.maxheight-5vw .el-loading-spinner .circular){
    margin-top:0.6vw;
    margin-left: 1.5vw;
    width: 1.5vw !important;
    height: 1.5vw !important;
}
</style>