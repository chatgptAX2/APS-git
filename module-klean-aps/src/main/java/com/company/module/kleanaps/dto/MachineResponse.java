package com.company.module.kleanaps.dto;

import com.company.module.kleanaps.entity.ApsMachine;
import com.company.module.kleanaps.entity.ApsMachineException;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class MachineResponse {

    private Long    machineId;
    private String  machineNo;
    private String  machineName;
    private Integer maxWidth;
    private Integer minWidth;
    private Integer maxPlyCount;
    private Integer mimiWidth;
    private Boolean isActive;
    private List<MachineExceptionDto> exceptions;

    public static MachineResponse from(ApsMachine m) {
        MachineResponse dto = new MachineResponse();
        dto.machineId   = m.getMachineId();
        dto.machineNo   = m.getMachineNo();
        dto.machineName = m.getMachineName();
        dto.maxWidth    = m.getMaxWidth();
        dto.minWidth    = m.getMinWidth();
        dto.maxPlyCount = m.getMaxPlyCount();
        dto.mimiWidth   = m.getMimiWidth();
        dto.isActive    = m.getIsActive();
        dto.exceptions  = m.getExceptions() != null
            ? m.getExceptions().stream().map(MachineExceptionDto::from).collect(Collectors.toList())
            : List.of();
        return dto;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class MachineExceptionDto {
        private Long       exceptionId;
        private BigDecimal basisWeight;
        private Integer    maxWidth;
        private String     remark;

        public static MachineExceptionDto from(ApsMachineException e) {
            MachineExceptionDto dto = new MachineExceptionDto();
            dto.exceptionId = e.getExceptionId();
            dto.basisWeight = e.getBasisWeight();
            dto.maxWidth    = e.getMaxWidth();
            dto.remark      = e.getRemark();
            return dto;
        }
    }
}
