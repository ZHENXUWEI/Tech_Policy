<script setup>
import HomeHeader from "@/components/HomeHeader.vue"
// 在script部分添加导入
import router from '@/router/index.js'
import { ref, onMounted } from "vue"
import { useRoute } from 'vue-router';
import { policyinfoDetailPAPI } from "@/api/policy"
import { daysUntil } from "@/utils/daysUtil"
import { Back } from '@element-plus/icons-vue'; // 导入返回图标
const policyinfoData = ref({
    leaderDepartment: "",
    deadTime: "",
    name: "",
    content: "",
    policyType: "",
    policyConditions: "",
    contact: "",
    hotLevel: "",
    phone: ""
});
const getPolicy = async (obj) => {
    // console.log(type1,policyType,subPolicyType)
    const res = await policyinfoDetailPAPI(obj)
    policyinfoData.value = res.data.row[0]
    console.log(policyinfoData.value)
}

const route = useRoute();
const lastDays = (deadTime) => {
    console.log(deadTime)
    // console.log(daysUntil(deadTime))
    return daysUntil(deadTime)
}

onMounted(async () => {
    const urlParams = route.query;
    if ("id" in urlParams) {
        getPolicy(urlParams.id)
    }
})
const routerBack = () => {
    router.push({
        path: '/policy'
    })

}
</script>

// 修改template中的back div部分
<template>
    <div id="main">
        <HomeHeader></HomeHeader>
        <div class="container">
            <div class="back-button" @click="routerBack()">
                <div style="    padding: 0.5vw 1vw;">
                    <Back style="margin-right: 0.5vw;" />
                    <span style='color:#000000;'>返回</span>
                </div>
            </div>

            <div class="title">
                <div class="title_left">
                    <h1>{{ policyinfoData.policyName }}</h1>
                    <p>
                        <span>牵头部门:<font style="margin-left: 0.5vw;">{{ policyinfoData.leaderDepartment }}</font></span>
                        <span>发布时间:<font style="margin-left: 0.5vw;">
                                {{ policyinfoData.publishDate ? policyinfoData.publishDate.split('T')[0] : "不详" }}
                            </font>
                        </span>
                    </p>
                </div>
                <div class="title_right">

                    <div>
                        <h3>政策剩余时间</h3>
                        <span>
                            <font style="font-size: 1.3vw;">{{ lastDays(policyinfoData.expireDate) }}</font>
                        </span>
                    </div>


                    <div>
                        <h3>政策访问量</h3>
                        <span>
                            <font style="font-size: 1.3vw;">{{ policyinfoData.hotLevel }}次</font>
                        </span>

                    </div>

                    <!-- <div class="goback_div">
                    
                    <span class="goback">返回</span>
                </div> -->
                </div>


            </div>
        </div>
        <div class="detail_content">
            <div class="polciy_content">
                <div class="content_title">
                    <div></div>
                    <span>政策原文</span>
                </div>
                <p class="content">
                    <a :href="policyinfoData.content">{{ policyinfoData.content }}</a>
                </p>
            </div>
            <div class="polciy_content">
                <div class="content_title">
                    <div></div>
                    <span>政策内容</span>
                </div>
                <p class="content">
                    {{ policyinfoData.description }}
                </p>
            </div>

            <div class="polciy_content">
                <div class="content_title">
                    <div></div>
                    <span>申报材料</span>
                </div>
                <p class="content">{{ policyinfoData.policyDocDetail }}</p>
            </div>

            <div class="polciy_content">
                <div class="content_title">
                    <div></div>
                    <span>政策条件</span>
                </div>
                <p class="content">
                    {{ policyinfoData.policyCondition }}
                </p>
            </div>

            <div class="polciy_content">
                <div class="content_title">
                    <div></div>
                    <span>联系方式</span>
                </div>
                <p class="content">
                <p><span>单位联系人:<font style="margin-left: 0.5vw;">{{ policyinfoData.contact }}</font></span></p>
                <p style="margin-top: 0.5vw;"><span>联系电话:<font style="margin-left: 0.5vw;">{{ policyinfoData.phone }}
                        </font></span></p>
                </p>
            </div>

        </div>
    </div>
</template>

// 修改style部分，添加back-button样式
<style scoped>
.title {

    z-index: -999;
    width: 68%;
    display: flex;
    justify-self: center;
    margin: 0 auto;
    justify-content: space-between;
    padding: 2vw 0;
}

.title .title_left {
    display: flex;
    flex-direction: column;
}

.title .title_left h1 {
    font-size: 1.5vw;
    font-weight: 400;

}

.title .title_left p {
    margin-top: 0.5vw;
}

.title .title_left span {
    font-size: 1.1vw;
    font-weight: lighter;

    margin-right: 3vw;
}

.title .title_right {
    display: flex;

}

.title .title_right div {
    z-index: -9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 3vw;
    width: 10vw;
}

.title .title_right div h3 {
    font-size: 1.1vw;
    font-weight: 400;
    margin-bottom: 1vw;
}

#main .title .title_right .goback_div {
    display: flex;
    width: 20vw;
    justify-content: center;
    background-color: red;
}

.detail_content {
    width: 68%;
    display: flex;
    background-color: white;
    flex-direction: column;
    justify-self: center;
    margin: 0 auto;
    padding: 2vw;

}

.polciy_content {
    margin-bottom: 2vw;
}

.detail_content .content_title {
    display: flex;
    align-items: center;
    margin-bottom: 1vw;

}

.content_title div {
    width: 0.2vw;
    height: 1.2vw;
    margin: 0 1vw 0 0;
    background-color: rgb(8, 154, 227);
    border-radius: 0.1vw;
}



.content_title span {
    font-size: 1.5vw;
}

.polciy_content .content {
    font-size: 1.15vw;
}

.goback {
    display: block;
    width: 5vw;
    height: 2vw;
    border: 1px solid blue;

    align-self: center;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2vh;
    font-size: 1vw;
    cursor: pointer;
}

.back-button {
    position: absolute;
    flex-direction: column;
    top: 50%;
    font-weight: lighter;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    background-color: white;
    /* background-color: #f0f7ff; */
    border: 0.1vw solid #e9ecee;
    border-radius: 0 0.5vw 0.5vw 0;
    color: rgb(8, 154, 227);
    ;
    font-size: 1.2vw;
    cursor: pointer;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

.back-button:hover {
    background-color: rgba(255, 255, 255, 0.5);
    color: rgb(8, 154, 227);
    ;
    box-shadow: 0 1px 2px rgba(53, 128, 245, 0.3);
}

.back-button:active {
    transform: translateY(-50%) scale(0.98);
}

.test {
    position: sticky;
    top: 40%;
    right: 0;
    z-index: 999;
    background: none;
    box-shadow: none;
    background-color: white;
}

.container {
    /* position: relative; */
}
</style>