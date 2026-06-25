package com.company.module.kleanaps.service;

import com.company.core.common.exception.EntityNotFoundException;
import com.company.core.common.exception.ErrorCode;
import com.company.module.kleanaps.dto.MachineResponse;
import com.company.module.kleanaps.repository.ApsMachineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApsMachineService {

    private final ApsMachineRepository machineRepository;

    @Transactional(readOnly = true)
    public List<MachineResponse> getAll() {
        return machineRepository.findAllWithExceptions()
                .stream().map(MachineResponse::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MachineResponse getById(Long machineId) {
        return machineRepository.findById(machineId)
                .map(MachineResponse::from)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.ENTITY_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public MachineResponse getByMachineNo(String machineNo) {
        return machineRepository.findByMachineNoWithExceptions(machineNo)
                .map(MachineResponse::from)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.ENTITY_NOT_FOUND));
    }
}
