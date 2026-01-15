package com.redhat.ecosystemappeng.morpheus.model.audit;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.*;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;


import static com.redhat.ecosystemappeng.morpheus.repository.JobRepositoryService.*;

@RegisterForReflection
public class Batch {
    @JsonProperty(BATCH_ID_FIELD_NAME)
    private String batchId;
    @PastOrPresent
    @JsonFormat(pattern = "yyyy-MM-ddT HH:mm:ss.MMMMMM")
    @JsonProperty(EXECUTION_START_TIMESTAMP)
    private LocalDateTime executionStartTimestamp;

    @JsonFormat(pattern = "yyyy-MM-ddT HH:mm:ss.MMMMMM")
    private LocalDateTime executionEndTimestamp;
    @JsonProperty("app_language")
    @Pattern(regexp = "go|python|c|javascript|java|all")
    private String appLanguage;
    @Nullable
    private Duration duration;
    @PositiveOrZero
    @JsonProperty("total_number_of_executed_jobs")
    private Integer numberOfExecutedJobs;
    @DecimalMin("0.00")
    @DecimalMin("1.00")
    private Float confusionMatrixAccuracy;
    @DecimalMin("0.00")
    @DecimalMin("1.00")
    private Float confusionMatrixPrecision;
    @DecimalMin("0.00")
    @DecimalMin("1.00")
    private Float confusionMatrixF1Score;
    @DecimalMin("0.00")
    @DecimalMin("1.00")
    private Float confusionMatrixRecall;
    @PositiveOrZero
    @JsonProperty("total_number_of_failures")
    private Integer numberOfFailures;
    @NotNull
    @Size(min = 0)
    private List<String> regressiveJobIds;
    @PositiveOrZero
    private Integer numberOfRegressiveJobIds;


    public String getBatchId() {
        return batchId;
    }

    public void setBatchId(String batchId) {
        this.batchId = batchId;
    }

    public LocalDateTime getExecutionStartTimestamp() {
        return executionStartTimestamp;
    }

    public void setExecutionStartTimestamp(LocalDateTime executionStartTimestamp) {
        this.executionStartTimestamp = executionStartTimestamp;
    }

    public LocalDateTime getExecutionEndTimestamp() {
        return executionEndTimestamp;
    }

    public void setExecutionEndTimestamp(LocalDateTime executionEndTimestamp) {
        this.executionEndTimestamp = executionEndTimestamp;
    }

    @Nullable
    public String getAppLanguage() {
        return appLanguage;
    }

    public void setAppLanguage(@Nullable String appLanguage) {
        this.appLanguage = appLanguage;
    }

    @Nullable
    public Duration getDuration() {
        return duration;
    }

    public void setDuration(@Nullable Duration duration) {
        this.duration = duration;
    }

    public Integer getNumberOfExecutedJobs() {
        return numberOfExecutedJobs;
    }

    public void setNumberOfExecutedJobs(Integer numberOfExecutedJobs) {
        this.numberOfExecutedJobs = numberOfExecutedJobs;
    }

    public Float getConfusionMatrixAccuracy() {
        return confusionMatrixAccuracy;
    }

    public void setConfusionMatrixAccuracy(Float confusionMatrixAccuracy) {
        this.confusionMatrixAccuracy = confusionMatrixAccuracy;
    }

    public Float getConfusionMatrixPrecision() {
        return confusionMatrixPrecision;
    }

    public void setConfusionMatrixPrecision(Float confusionMatrixPrecision) {
        this.confusionMatrixPrecision = confusionMatrixPrecision;
    }

    public Float getConfusionMatrixF1Score() {
        return confusionMatrixF1Score;
    }

    public void setConfusionMatrixF1Score(Float confusionMatrixF1Score) {
        this.confusionMatrixF1Score = confusionMatrixF1Score;
    }

    public Float getConfusionMatrixRecall() {
        return confusionMatrixRecall;
    }

    public void setConfusionMatrixRecall(Float confusionMatrixRecall) {
        this.confusionMatrixRecall = confusionMatrixRecall;
    }

    public Integer getNumberOfFailures() {
        return numberOfFailures;
    }

    public void setNumberOfFailures(Integer numberOfFailures) {
        this.numberOfFailures = numberOfFailures;
    }

    public List<String> getRegressiveJobIds() {
        return regressiveJobIds;
    }

    public void setRegressiveJobIds(List<String> regressiveJobIds) {
        this.regressiveJobIds = regressiveJobIds;
    }

    public Integer getNumberOfRegressiveJobIds() {
        return numberOfRegressiveJobIds;
    }

    public void setNumberOfRegressiveJobIds(Integer numberOfRegressiveJobIds) {
        this.numberOfRegressiveJobIds = numberOfRegressiveJobIds;
    }
}
