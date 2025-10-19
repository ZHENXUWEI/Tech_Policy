import request from '@/utils/request'
export function policystatusAPI() {
    return request({
      url: `/policy/policystatus`,
    })
  }

  export function policyclassinfoAPI() {
    return request({
      url: `/policy/policyclassinfo`,
    })
  }

// 精准推荐  根据用户喜好获取政策
export function policyUserHobby(id) {
  return request({
    url: `/policy/policyPush?companyId=${id}`,
    method: "get"
  })
}

  export function policyhobbyAPI({ obj, method='GET' }) {    
    if (method=='GET') {
      return request({
        url: `/policy/policyhobby`,
        method:'GET',
        params: obj
      })
    }else {
      return request({
        url: `/policy/policyhobby`,
        method:'POST',
        data: obj
      })
    }
  }
  export function policyeffectiveAPI(obj){
    return request({
      url: `/policy/policyinfo`,
      method:'POST',
      data: obj
    })
  }

  export function policyinfoAPI(obj) {
    // var params={}
    // if(obj.type==1){
    //   params={
    //     type:obj.type,
    //     policyType:obj.policyType,
    //     subPolicyType:obj.subPolicyType
    //   }
    // }else if(obj.type==2){
    //   params={
    //     type:obj.type,
    //     timePeriod:obj.timePeriod
    //   }
    // }else if(obj.type==3){
    //     params={
    //       type:obj.type,
    //       id:obj.id
    //     }
    // }else if(obj.type==4){
    //   params={
    //     type:obj.type,
    //     policyName:obj.policyName
    //   }
    // }else if(obj.type==6){
    //   params={
    //     type:obj.type,
    //     isNew:obj.isNew
    //   }
    // }else{
    //   params={
    //     type:obj.type,
    //   }
    // }
    console.log(obj)
    return request({
      url: `/policy/policyinfo`,
      headers: {
        'Content-Type':'application/json'
      },
      method:'post',
      data: obj
    })
  }


  export function policyPushAPI(Id){
    return request({
      url: `/policy/policyPush?companyId=${Id}`,
      method: 'GET',
      // params: companyId
    })
  }


  export function policyinfoPAPI(type,timePeriod) {
    return request({
      url: `/policy/policyinfo`,
      params:{
        type,
        timePeriod
      }
    })
  }


  export function policyinfoDetailPAPI(id) {
    return request({
      url:`/policy/getpolicydetail/${id}`,
     method:"get"
    })
  }

  export function policyNumberAPI(id) {
    return request({
      url:`/policy/vistiedNumber/${id}`,
     method:"get"
    })
  }

  export function policyVisitNAPI() {
    return request({
      url: `/policy/userVisitN`,
    })
  }

  export function policyMatchNAPI() {
    return request({
      url: `/policy/matchN`,
    })
  }


  export function policyMatchListPAPI() {
    return request({
      url: `/policy/policyMatchList`,
    })
  }
