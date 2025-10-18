package com.ruoyi.web.controller.policy.mapper;

import com.ruoyi.web.controller.policy.domain.PolicyPropertiesData;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PolicyPropertiesDataMapper
{
    /**
     * 查询【请填写功能名称】
     *
     * @param id 【请填写功能名称】主键
     * @return 【请填写功能名称】
     */
    public PolicyPropertiesData selectPolicyPropertiesDataById(Integer id);

    /**
     * 查询【请填写功能名称】列表
     *
     * @param policyPropertiesData 【请填写功能名称】
     * @return 【请填写功能名称】集合
     */
    public List<PolicyPropertiesData> selectPolicyPropertiesDataList(PolicyPropertiesData policyPropertiesData);

    /**
     * 新增【请填写功能名称】
     *
     * @param policyPropertiesData 【请填写功能名称】
     * @return 结果
     */
    public int insertPolicyPropertiesData(PolicyPropertiesData policyPropertiesData);

    /**
     * 修改【请填写功能名称】
     *
     * @param policyPropertiesData 【请填写功能名称】
     * @return 结果
     */
    public int updatePolicyPropertiesData(PolicyPropertiesData policyPropertiesData);

    /**
     * 删除【请填写功能名称】
     *
     * @param id 【请填写功能名称】主键
     * @return 结果
     */
    public int deletePolicyPropertiesDataById(Integer id);

    /**
     * 批量删除【请填写功能名称】
     *
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deletePolicyPropertiesDataByIds(Integer[] ids);

    public List<PolicyPropertiesData> selectPolicyPropertiesDataByPolicyId(Integer id);

    public List<PolicyPropertiesData> selectPolicyPropertiesDataByCategoryDataId(@Param("policyCategoryDataId") Integer policyCategoryDataId);
    /**
     *
     */
}