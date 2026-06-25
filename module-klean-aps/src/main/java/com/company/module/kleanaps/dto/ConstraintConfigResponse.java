package com.company.module.kleanaps.dto;

import com.company.module.kleanaps.entity.ApsConstraintConfig;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ConstraintConfigResponse {

    private Long   configId;
    private String configKey;
    private String configValue;
    private String configGroup;
    private String machineNo;
    private String dataType;
    private String description;
    private Boolean isActive;
    private LocalDateTime updatedAt;

    public static ConstraintConfigResponse from(ApsConstraintConfig c) {
        ConstraintConfigResponse dto = new ConstraintConfigResponse();
        dto.configId    = c.getConfigId();
        dto.configKey   = c.getConfigKey();
        dto.configValue = c.getConfigValue();
        dto.configGroup = c.getConfigGroup();
        dto.machineNo   = c.getMachineNo();
        dto.dataType    = c.getDataType();
        dto.description = c.getDescription();
        dto.isActive    = c.getIsActive();
        dto.updatedAt   = c.getUpdatedAt();
        return dto;
    }
}
