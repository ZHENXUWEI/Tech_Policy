package com.ruoyi.web.controller.api.mapper;

import com.ruoyi.web.controller.api.domain.Material;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MaterialMapper {
    List<Material> getMaterial(Integer id, String modelName);

}
