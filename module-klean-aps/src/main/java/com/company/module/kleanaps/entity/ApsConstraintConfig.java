package com.company.module.kleanaps.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 지폭조합 제약조건 설정 Entity
 * 시스템 운영 중 변경 가능한 제약 파라미터를 DB로 관리한다.
 */
@Entity
@Table(name = "aps_constraint_config")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ApsConstraintConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CONFIG_ID")
    private Long configId;

    @Column(name = "CONFIG_KEY", nullable = false, length = 100)
    private String configKey;

    @Column(name = "CONFIG_VALUE", nullable = false, length = 500)
    private String configValue;

    /** 설정 그룹: GENERAL / MACHINE / EXCEPTION */
    @Column(name = "CONFIG_GROUP", nullable = false, length = 50)
    private String configGroup;

    /** 적용 호기 (null = 전체) */
    @Column(name = "MACHINE_NO", length = 1)
    private String machineNo;

    /** 데이터 타입: STRING / INTEGER / DECIMAL / BOOLEAN */
    @Column(name = "DATA_TYPE", nullable = false, length = 20)
    private String dataType;

    @Column(name = "DESCRIPTION", length = 300)
    private String description;

    @Column(name = "IS_ACTIVE", nullable = false)
    private Boolean isActive;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt  = LocalDateTime.now();
        this.updatedAt  = LocalDateTime.now();
        if (this.isActive     == null) this.isActive     = true;
        if (this.configGroup  == null) this.configGroup  = "GENERAL";
        if (this.dataType     == null) this.dataType     = "STRING";
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Builder
    public ApsConstraintConfig(String configKey, String configValue, String configGroup,
                               String machineNo, String dataType, String description) {
        this.configKey   = configKey;
        this.configValue = configValue;
        this.configGroup = configGroup;
        this.machineNo   = machineNo;
        this.dataType    = dataType;
        this.description = description;
        this.isActive    = true;
    }

    public void updateValue(String configValue) {
        this.configValue = configValue;
    }

    public void update(String configValue, String description, Boolean isActive) {
        this.configValue = configValue;
        this.description = description;
        this.isActive    = isActive;
    }

    /** Integer 값으로 반환 */
    public Integer asInteger() {
        return Integer.parseInt(this.configValue);
    }

    /** BigDecimal 값으로 반환 */
    public java.math.BigDecimal asDecimal() {
        return new java.math.BigDecimal(this.configValue);
    }

    /** Boolean 값으로 반환 */
    public Boolean asBoolean() {
        return Boolean.parseBoolean(this.configValue);
    }
}
