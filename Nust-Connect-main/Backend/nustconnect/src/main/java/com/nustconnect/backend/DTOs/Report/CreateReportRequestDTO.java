package com.nustconnect.backend.DTOs.Report;

import com.nustconnect.backend.Enums.ReportTargetType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateReportRequestDTO {
    @NotNull
    private ReportTargetType targetType;

    @NotNull
    private Long targetId;

    @NotBlank
    @Size(max = 1000)
    private String reason;
}