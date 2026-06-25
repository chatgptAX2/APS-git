package com.company.module.kleanaps.service;

import com.company.core.common.exception.EntityNotFoundException;
import com.company.core.common.exception.ErrorCode;
import com.company.module.kleanaps.dto.MaterialResponse;
import com.company.module.kleanaps.dto.MaterialSyncRequest;
import com.company.module.kleanaps.entity.ApsMaterial;
import com.company.module.kleanaps.repository.ApsMaterialRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApsMaterialService {

    private final ApsMaterialRepository materialRepository;

    /**
     * 자재 목록 조회 (검색)
     */
    @Transactional(readOnly = true)
    public Page<MaterialResponse> getList(String q, int page, int size) {
        // 검색어가 있으면 검색, 없으면 전체 활성 조회
        if (q != null && !q.isBlank()) {
            List<ApsMaterial> result = materialRepository.searchByKeyword(q);
            // 페이징 적용
            int total = result.size();
            int fromIdx = Math.min(page * size, total);
            int toIdx   = Math.min(fromIdx + size, total);
            List<MaterialResponse> content = result.subList(fromIdx, toIdx)
                    .stream().map(MaterialResponse::from).collect(Collectors.toList());
            return new org.springframework.data.domain.PageImpl<>(
                    content, PageRequest.of(page, size), total);
        }
        Page<ApsMaterial> entityPage = materialRepository.findAll(
                PageRequest.of(page, size, Sort.by("materialCode")));
        return entityPage.map(MaterialResponse::from);
    }

    /**
     * 자재 단건 조회
     */
    @Transactional(readOnly = true)
    public MaterialResponse getById(Long materialId) {
        ApsMaterial m = materialRepository.findById(materialId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.ENTITY_NOT_FOUND));
        return MaterialResponse.from(m);
    }

    /**
     * 자재코드로 조회
     */
    @Transactional(readOnly = true)
    public MaterialResponse getByCode(String materialCode) {
        ApsMaterial m = materialRepository.findByMaterialCode(materialCode)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.ENTITY_NOT_FOUND));
        return MaterialResponse.from(m);
    }

    /**
     * 호기 + 평량으로 조회
     */
    @Transactional(readOnly = true)
    public List<MaterialResponse> getByMachineAndBasisWeight(String machineNo, BigDecimal basisWeight) {
        return materialRepository.findByMachineNoAndBasisWeight(machineNo, basisWeight)
                .stream().map(MaterialResponse::from).collect(Collectors.toList());
    }

    /**
     * SAP 자재마스터 동기화 (Upsert)
     */
    @Transactional
    public int syncMaterials(MaterialSyncRequest request) {
        int upsertCount = 0;
        for (MaterialSyncRequest.MaterialSyncItem item : request.getMaterials()) {
            Optional<ApsMaterial> existing = materialRepository.findByMaterialCode(item.getMaterialCode());
            if (existing.isPresent()) {
                existing.get().syncFromSap(
                        item.getMaterialName(), item.getItemType(), item.getMachineNo(),
                        item.getPackingType(), item.getBasisWeight(),
                        item.getPaperWidth(), item.getPaperLength());
            } else {
                materialRepository.save(ApsMaterial.builder()
                        .materialCode(item.getMaterialCode())
                        .materialName(item.getMaterialName())
                        .itemType(item.getItemType())
                        .machineNo(item.getMachineNo())
                        .packingType(item.getPackingType())
                        .basisWeight(item.getBasisWeight())
                        .paperWidth(item.getPaperWidth())
                        .paperLength(item.getPaperLength())
                        .build());
            }
            upsertCount++;
        }
        log.info("[Klean-APS] 자재마스터 동기화 완료: {}건", upsertCount);
        return upsertCount;
    }

    /**
     * 자재 비활성화
     */
    @Transactional
    public void deactivate(Long materialId) {
        ApsMaterial m = materialRepository.findById(materialId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.ENTITY_NOT_FOUND));
        m.deactivate();
    }
}
